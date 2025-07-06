const express = require('express');
const router = express.Router();
const { authenticateUser, createUserClient } = require('../middleware/auth');

// Get user goals
router.get('/', authenticateUser, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const supabase = createUserClient(token);
    const { data, error } = await supabase
      .from('daily_goals')
      .select('*')
      .eq('user_id', req.user.id)
      .maybeSingle();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ data, success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Save goals
router.post('/', authenticateUser, async (req, res) => {
  try {
    // Provide defaults for all required fields
    const calories = req.body.calories ?? 2000;
    const protein = req.body.protein ?? 100;
    const carbs = req.body.carbs ?? 250;
    const fat = req.body.fat ?? 67;
    
    if (!calories && !protein && !carbs && !fat) {
      return res.status(400).json({ error: 'At least one field is required' });
    }
    
    const token = req.headers.authorization?.split(' ')[1];
    const supabase = createUserClient(token);
    const goal = { user_id: req.user.id, calories, protein, carbs, fat };
    
    const { data, error } = await supabase
      .from('daily_goals')
      .upsert(goal, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ data, success: true, message: 'Goals saved!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete goals
router.delete('/', authenticateUser, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const supabase = createUserClient(token);
    const { error } = await supabase
      .from('daily_goals')
      .delete()
      .eq('user_id', req.user.id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true, message: 'Goals deleted!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
