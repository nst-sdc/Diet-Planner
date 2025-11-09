const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const prisma = require('../lib/prisma');

// Get all meals
router.get('/', authenticateUser, async (req, res) => {
  try {
    const meals = await prisma.meal.findMany({
      where: { userId: req.user.id },
      orderBy: { plannedDate: 'asc' }
    });
    
    res.json({ data: meals, success: true });
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new meal
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat, plannedDate } = req.body;
    
    if (!name || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const meal = await prisma.meal.create({
      data: {
        userId: req.user.id,
        name,
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat),
        plannedDate: plannedDate ? new Date(plannedDate) : null
      }
    });

    res.status(201).json({ data: meal, success: true, message: 'Meal created!' });
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update meal
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, calories, protein, carbs, fat, plannedDate } = req.body;
    
    if (!name || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if meal exists and belongs to user
    const existingMeal = await prisma.meal.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existingMeal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    const meal = await prisma.meal.update({
      where: { id },
      data: {
        name,
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat),
        plannedDate: plannedDate ? new Date(plannedDate) : null
      }
    });

    res.json({ data: meal, success: true, message: 'Meal updated!' });
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete meal
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if meal exists and belongs to user
    const existingMeal = await prisma.meal.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existingMeal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    await prisma.meal.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Meal deleted!' });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
