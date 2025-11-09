const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const prisma = require('../lib/prisma');

// Get logged meals for a date
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const meals = await prisma.loggedMeal.findMany({
      where: {
        userId: req.user.id,
        mealDate: new Date(date)
      },
      orderBy: { loggedAt: 'asc' }
    });

    res.json({ data: meals, success: true });
  } catch (error) {
    console.error('Get logged meals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a logged meal
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat, meal_date, quantity, baseQuantity } = req.body;
    
    if (!name || calories === undefined || protein === undefined || carbs === undefined || fat === undefined || !meal_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const meal = await prisma.loggedMeal.create({
      data: {
        userId: req.user.id,
        name,
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat),
        quantity: quantity ? parseFloat(quantity) : 100,
        baseQuantity: baseQuantity ? parseFloat(baseQuantity) : 100,
        mealDate: new Date(meal_date)
      }
    });

    res.status(201).json({ data: meal, success: true, message: 'Meal logged!' });
  } catch (error) {
    console.error('Log meal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update meal quantity and recalculate nutrition
router.patch('/:id/quantity', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    // Check if meal exists and belongs to user
    const existingMeal = await prisma.loggedMeal.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existingMeal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    // Calculate the ratio for nutritional adjustment
    const ratio = parseFloat(quantity) / existingMeal.baseQuantity;

    // Recalculate all nutritional values based on the new quantity
    const updatedMeal = await prisma.loggedMeal.update({
      where: { id },
      data: {
        quantity: parseFloat(quantity),
        calories: Math.round((existingMeal.calories / existingMeal.quantity) * existingMeal.baseQuantity * ratio),
        protein: Math.round(((existingMeal.protein / existingMeal.quantity) * existingMeal.baseQuantity * ratio) * 10) / 10,
        carbs: Math.round(((existingMeal.carbs / existingMeal.quantity) * existingMeal.baseQuantity * ratio) * 10) / 10,
        fat: Math.round(((existingMeal.fat / existingMeal.quantity) * existingMeal.baseQuantity * ratio) * 10) / 10
      }
    });

    res.json({ data: updatedMeal, success: true, message: 'Meal quantity updated!' });
  } catch (error) {
    console.error('Update meal quantity error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Manually add a custom food
router.post('/manual', authenticateUser, async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat, meal_date, quantity } = req.body;
    
    if (!name || calories === undefined || protein === undefined || carbs === undefined || fat === undefined || !meal_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if this custom food already exists for this user
    const existingCustomFood = await prisma.customFood.findFirst({
      where: {
        userId: req.user.id,
        name: { equals: name }
      }
    });

    // If it doesn't exist, save it to custom foods
    if (!existingCustomFood) {
      await prisma.customFood.create({
        data: {
          userId: req.user.id,
          name,
          calories: parseFloat(calories),
          protein: parseFloat(protein),
          carbs: parseFloat(carbs),
          fat: parseFloat(fat)
        }
      });
    }

    // Log the meal

    const meal = await prisma.loggedMeal.create({
      data: {
        userId: req.user.id,
        name,
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat),
        quantity: quantity ? parseFloat(quantity) : 100,
        baseQuantity: 100, // Always use 100g as base for manual entries
        mealDate: new Date(meal_date)
      }
    });

    res.status(201).json({ data: meal, success: true, message: 'Custom meal added!' });
  } catch (error) {
    console.error('Manual meal entry error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a logged meal
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if meal exists and belongs to user
    const existingMeal = await prisma.loggedMeal.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existingMeal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    await prisma.loggedMeal.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Meal deleted!' });
  } catch (error) {
    console.error('Delete logged meal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get logged meals for a date range
router.get('/range', authenticateUser, async (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end dates are required' });
    }

    const meals = await prisma.loggedMeal.findMany({
      where: {
        userId: req.user.id,
        mealDate: {
          gte: new Date(start),
          lte: new Date(end)
        }
      },
      orderBy: { mealDate: 'asc' }
    });

    res.json({ data: meals, success: true });
  } catch (error) {
    console.error('Get logged meals range error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
