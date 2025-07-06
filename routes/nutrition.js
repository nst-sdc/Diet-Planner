const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

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
      return {
        id: food.fdcId,
        name: food.description,
        calories: Math.round(nutrients.find(n => n.nutrientId === 1008)?.value || 0),
        protein: Math.round((nutrients.find(n => n.nutrientId === 1003)?.value || 0) * 10) / 10,
        carbs: Math.round((nutrients.find(n => n.nutrientId === 1005)?.value || 0) * 10) / 10,
        fat: Math.round((nutrients.find(n => n.nutrientId === 1004)?.value || 0) * 10) / 10,
        source: 'usda'
      };
    });
  } catch (error) {
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
      return {
        id: product.code || product._id,
        name: product.product_name || 'Unknown Product',
        calories: Math.round(nutriments.energy_kcal_100g || nutriments['energy-kcal_100g'] || 0),
        protein: Math.round((nutriments.proteins_100g || 0) * 10) / 10,
        carbs: Math.round((nutriments.carbohydrates_100g || 0) * 10) / 10,
        fat: Math.round((nutriments.fat_100g || 0) * 10) / 10,
        source: 'openfoodfacts'
      };
    }).filter(item => item.name !== 'Unknown Product');
  } catch (error) {
    return [];
  }
}

// Search for nutrition info
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query needed' });
    }
    const [usdaResults, offResults] = await Promise.allSettled([
      searchUSDA(query.trim()),
      searchOpenFoodFacts(query.trim())
    ]);
    const usdaData = usdaResults.status === 'fulfilled' ? usdaResults.value : [];
    const offData = offResults.status === 'fulfilled' ? offResults.value : [];
    const allResults = [...usdaData, ...offData];
    const uniqueResults = allResults.filter((item, index, array) =>
      index === array.findIndex(t => t.name.toLowerCase() === item.name.toLowerCase())
    );
    res.json({ data: uniqueResults, success: true, total: uniqueResults.length });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 