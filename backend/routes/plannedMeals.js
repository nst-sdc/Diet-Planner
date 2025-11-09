const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const prisma = require('../lib/prisma');

// Get planned meals for a specific date
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const meals = await prisma.plannedMeal.findMany({
      where: {
        userId: req.user.id,
        plannedDate: new Date(date)
      },
      orderBy: { mealType: 'asc' }
    });

    res.json({ data: meals, success: true });
  } catch (error) {
    console.error('Get planned meals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a planned meal
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, planned_date, meal_type, calories, protein, carbs, fat } = req.body;
    
    if (!name || !planned_date || !meal_type) {
      return res.status(400).json({ error: 'Name, date, and meal type are required' });
    }

    const meal = await prisma.plannedMeal.create({
      data: {
        userId: req.user.id,
        name,
        plannedDate: new Date(planned_date),
        mealType: meal_type,
        calories: calories ? parseFloat(calories) : null,
        protein: protein ? parseFloat(protein) : null,
        carbs: carbs ? parseFloat(carbs) : null,
        fat: fat ? parseFloat(fat) : null
      }
    });

    res.status(201).json({ data: meal, success: true, message: 'Meal planned!' });
  } catch (error) {
    console.error('Create planned meal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a planned meal
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, planned_date, meal_type, calories, protein, carbs, fat } = req.body;
    
    if (!name || !planned_date || !meal_type) {
      return res.status(400).json({ error: 'Name, date, and meal type are required' });
    }

    // Check if meal exists and belongs to user
    const existingMeal = await prisma.plannedMeal.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existingMeal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    const meal = await prisma.plannedMeal.update({
      where: { id },
      data: {
        name,
        plannedDate: new Date(planned_date),
        mealType: meal_type,
        calories: calories ? parseFloat(calories) : null,
        protein: protein ? parseFloat(protein) : null,
        carbs: carbs ? parseFloat(carbs) : null,
        fat: fat ? parseFloat(fat) : null
      }
    });

    res.json({ data: meal, success: true, message: 'Meal updated!' });
  } catch (error) {
    console.error('Update planned meal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a planned meal
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if meal exists and belongs to user
    const existingMeal = await prisma.plannedMeal.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existingMeal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    await prisma.plannedMeal.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Meal deleted!' });
  } catch (error) {
    console.error('Delete planned meal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
