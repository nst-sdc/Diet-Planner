const express = require('express');
const fetch = require('node-fetch');
const { PrismaClient } = require('@prisma/client');
const { authenticateUser } = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

// API keys
const USDA_API_KEY = process.env.USDA_API_KEY || 'your_usda_api_key';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
const OPEN_FOOD_FACTS_BASE_URL = 'https://world.openfoodfacts.org/api/v0';

// Search USDA database
async function searchUSDA(query) {
  try {
    const url = `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=5&dataType=Foundation,SR Legacy`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return (data.foods || []).map(food => {
      const nutrients = food.foodNutrients || [];
      
      // Extract nutrients with better fallback
      const calories = nutrients.find(n => n.nutrientId === 1008)?.value || 0;
      const protein = nutrients.find(n => n.nutrientId === 1003)?.value || 0;
      const carbs = nutrients.find(n => n.nutrientId === 1005)?.value || 0;
      const fat = nutrients.find(n => n.nutrientId === 1004)?.value || 0;
      
      console.log(`USDA: ${food.description} - Cal: ${calories}, P: ${protein}, C: ${carbs}, F: ${fat}`);
      
      return {
        id: food.fdcId,
        name: food.description,
        calories: Math.round(calories),
        protein: Math.round(protein * 10) / 10,
        carbs: Math.round(carbs * 10) / 10,
        fat: Math.round(fat * 10) / 10,
        source: 'usda'
      };
    });
  } catch (error) {
    console.error('USDA API error:', error);
    return [];
  }
}

// Search Open Food Facts
async function searchOpenFoodFacts(query) {
  try {
    const url = `${OPEN_FOOD_FACTS_BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return (data.products || []).map(product => {
      const nutriments = product.nutriments || {};
      
      const calories = nutriments.energy_kcal_100g || nutriments['energy-kcal_100g'] || 0;
      const protein = nutriments.proteins_100g || 0;
      const carbs = nutriments.carbohydrates_100g || 0;
      const fat = nutriments.fat_100g || 0;
      
      console.log(`OpenFoodFacts: ${product.product_name} - Cal: ${calories}, P: ${protein}, C: ${carbs}, F: ${fat}`);
      
      return {
        id: product.code || product._id,
        name: product.product_name || 'Unknown Product',
        calories: Math.round(calories),
        protein: Math.round(protein * 10) / 10,
        carbs: Math.round(carbs * 10) / 10,
        fat: Math.round(fat * 10) / 10,
        source: 'openfoodfacts'
      };
    }).filter(item => item.name !== 'Unknown Product');
  } catch (error) {
    console.error('OpenFoodFacts API error:', error);
    return [];
  }
}

// Search for nutrition info
router.get('/search', authenticateUser, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query needed' });
    }
    
    // Search custom foods first
    const customFoods = await prisma.customFood.findMany({
      where: {
        userId: req.user.id,
        name: {
          contains: query.trim()
        }
      }
    });

    const customFoodResults = customFoods.map(food => ({
      id: `custom-${food.id}`,
      name: `${food.name} (My Food)`,
      calories: Math.round(food.calories),
      protein: Math.round(food.protein * 10) / 10,
      carbs: Math.round(food.carbs * 10) / 10,
      fat: Math.round(food.fat * 10) / 10,
      source: 'custom'
    }));

    console.log(`Found ${customFoods.length} custom foods for "${query}"`);

    // Search external APIs
    const [usdaResults, offResults] = await Promise.allSettled([
      
      searchUSDA(query.trim()),
      searchOpenFoodFacts(query.trim())
    ]);
    const usdaData = usdaResults.status === 'fulfilled' ? usdaResults.value : [];
    const offData = offResults.status === 'fulfilled' ? offResults.value : [];
    const allResults = [...customFoodResults, ...usdaData, ...offData];
    const uniqueResults = allResults.filter((item, index, array) =>
      index === array.findIndex(t => t.name.toLowerCase() === item.name.toLowerCase())
    );
    res.json({ data: uniqueResults, success: true, total: uniqueResults.length });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
