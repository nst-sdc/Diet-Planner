const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const prisma = require('../lib/prisma');

// Get user goals
router.get('/', authenticateUser, async (req, res) => {
  try {
    const goal = await prisma.dailyGoal.findUnique({
      where: { userId: req.user.id }
    });
    
    res.json({ data: goal, success: true });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save goals (create or update)
router.post('/', authenticateUser, async (req, res) => {
  try {
    const calories = req.body.calories ?? 2000;
    const protein = req.body.protein ?? 100;
    const carbs = req.body.carbs ?? 250;
    const fat = req.body.fat ?? 67;

    const goal = await prisma.dailyGoal.upsert({
      where: { userId: req.user.id },
      update: {
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat)
      },
      create: {
        userId: req.user.id,
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat)
      }
    });

    res.json({ data: goal, success: true, message: 'Goals saved!' });
  } catch (error) {
    console.error('Save goals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete goals
router.delete('/', authenticateUser, async (req, res) => {
  try {
    await prisma.dailyGoal.deleteMany({
      where: { userId: req.user.id }
    });

    res.json({ success: true, message: 'Goals deleted!' });
  } catch (error) {
    console.error('Delete goals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
