const express = require('express');
const router = express.Router();
const { authenticateUser, createUserClient } = require('../middleware/auth');

// Get logged meals for a date
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date is required' });
    const token = req.headers.authorization?.split(' ')[1];
    const supabase = createUserClient(token);
    const { data, error } = await supabase
      .from('logged_meals')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('meal_date', date)
      .order('logged_at', { ascending: true });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ data, success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /api/logged-meals
 * Add a logged meal
 */
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat, meal_date } = req.body;
    if (!name || !calories || !protein || !carbs || !fat || !meal_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const token = req.headers.authorization?.split(' ')[1];
    const supabase = createUserClient(token);
    const meal = { ...req.body, user_id: req.user.id };
    const { data, error } = await supabase
      .from('logged_meals')
      .insert(meal)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ data, success: true, message: 'Meal logged!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * DELETE /api/logged-meals/:id
 * Delete a logged meal
 */
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const mealId = req.params.id;
    const token = req.headers.authorization?.split(' ')[1];
    const supabase = createUserClient(token);
    const { error } = await supabase
      .from('logged_meals')
      .delete()
      .eq('id', mealId)
      .eq('user_id', req.user.id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true, message: 'Meal deleted!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/logged-meals/range?start=YYYY-MM-DD&end=YYYY-MM-DD
 * Get logged meals for a date range
 */
router.get('/range', authenticateUser, async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ error: 'Start and end dates are required' });
    const token = req.headers.authorization?.split(' ')[1];
    const supabase = createUserClient(token);
    const { data, error } = await supabase
      .from('logged_meals')
      .select('*')
      .eq('user_id', req.user.id)
      .gte('meal_date', start)
      .lte('meal_date', end)
      .order('meal_date', { ascending: true });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ data, success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
