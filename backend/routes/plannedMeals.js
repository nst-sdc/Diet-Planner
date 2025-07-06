const express = require('express');
const router = express.Router();
const { authenticateUser, createUserClient } = require('../middleware/auth');

/**
 * GET /api/planned-meals?date=YYYY-MM-DD
 * Get planned meals for a specific date
 */
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date is required' });
    const token = req.headers.authorization?.split(' ')[1];
    const supabase = createUserClient(token);
    const { data, error } = await supabase
      .from('planned_meals')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('planned_date', date)
      .order('meal_type', { ascending: true });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ data, success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /api/planned-meals
 * Add a planned meal
 */
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, planned_date, meal_type } = req.body;
    if (!name || !planned_date || !meal_type) {
      return res.status(400).json({ error: 'Name, date, and meal type are required' });
    }
    const token = req.headers.authorization?.split(' ')[1];
    const supabase = createUserClient(token);
    const meal = { ...req.body, user_id: req.user.id };
    const { data, error } = await supabase
      .from('planned_meals')
      .insert(meal)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ data, success: true, message: 'Meal planned!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * PUT /api/planned-meals/:id
 * Update a planned meal
 */
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const mealId = req.params.id;
    const { name, planned_date, meal_type } = req.body;
    if (!name || !planned_date || !meal_type) {
      return res.status(400).json({ error: 'Name, date, and meal type are required' });
    }
    const token = req.headers.authorization?.split(' ')[1];
    const supabase = createUserClient(token);
    const { data, error } = await supabase
      .from('planned_meals')
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

/**
 * DELETE /api/planned-meals/:id
 * Delete a planned meal
 */
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const mealId = req.params.id;
    const token = req.headers.authorization?.split(' ')[1];
    const supabase = createUserClient(token);
    const { error } = await supabase
      .from('planned_meals')
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
