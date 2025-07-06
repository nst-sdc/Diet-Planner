const express = require('express');
const router = express.Router();
const { authenticateUser, createUserClient } = require('../middleware/auth');

// Get all meals
router.get('/', authenticateUser, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const supabase = createUserClient(token);
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', req.user.id)
      .order('planned_date', { ascending: true });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ data, success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new meal
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat } = req.body;
    if (!name || !calories || !protein || !carbs || !fat) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const token = req.headers.authorization?.split(' ')[1];
    const supabase = createUserClient(token);
    const meal = { ...req.body, user_id: req.user.id };
    const { data, error } = await supabase
      .from('meals')
      .insert(meal)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ data, success: true, message: 'Meal created!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update meal
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const mealId = req.params.id;
    const { name, calories, protein, carbs, fat } = req.body;
    if (!name || !calories || !protein || !carbs || !fat) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const token = req.headers.authorization?.split(' ')[1];
    const supabase = createUserClient(token);
    const { data, error } = await supabase
      .from('meals')
      .update(req.body)
      .eq('id', mealId)
      .eq('user_id', req.user.id)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Meal not found' });
    res.json({ data, success: true, message: 'Meal updated!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete meal
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const mealId = req.params.id;
    const token = req.headers.authorization?.split(' ')[1];
    const supabase = createUserClient(token);
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', mealId)
      .eq('user_id', req.user.id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true, message: 'Meal deleted!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
