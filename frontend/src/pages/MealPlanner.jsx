import React, { useState, useEffect, useCallback } from 'react';
import { plannedMealsAPI } from '../services/api';
import Navigation from '../components/Navigation';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/apiService';

function MealPlanner({ user }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState({
    Breakfast: { id: null, name: '', calories: '', notes: '' },
    Lunch: { id: null, name: '', calories: '', notes: '' },
    Dinner: { id: null, name: '', calories: '', notes: '' },
    Snacks: { id: null, name: '', calories: '', notes: '' },
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const mealTypes = [
    { key: 'Breakfast', icon: '🌅' },
    { key: 'Lunch', icon: '☀️' },
    { key: 'Dinner', icon: '🌙' },
    { key: 'Snacks', icon: '🍎' },
  ];

  const fetchPlannedMeals = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    const token = await authService.getAccessToken();
    const { data, error } = await plannedMealsAPI.getPlannedMeals(selectedDate, token);
    if (error) {
      console.error('Error fetching planned meals:', error);
      alert('Failed to load your meal plan for this date.');
    } else {
      const newMealsState = {
        Breakfast: { id: null, name: '', calories: '', notes: '' },
        Lunch: { id: null, name: '', calories: '', notes: '' },
        Dinner: { id: null, name: '', calories: '', notes: '' },
        Snacks: { id: null, name: '', calories: '', notes: '' },
      };
      data.forEach(meal => {
        // Handle both camelCase and snake_case
        const mealType = meal.mealType || meal.meal_type;
        if (newMealsState[mealType]) {
          newMealsState[mealType] = {
            id: meal.id,
            name: meal.name,
            calories: meal.calories || '',
            notes: meal.notes || '',
          };
        }
      });
      setMeals(newMealsState);
    }
    setIsLoading(false);
  }, [selectedDate, user?.id]);

  useEffect(() => {
    fetchPlannedMeals();
  }, [fetchPlannedMeals]);

  const handleMealChange = (mealType, field, value) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: { ...prev[mealType], [field]: value },
    }));
  };

  const handleSaveMeal = async (mealType) => {
    const meal = meals[mealType];
    if (!meal.name.trim()) {
      alert('Please enter a meal name.');
      return;
    }
    const token = await authService.getAccessToken();
    const mealData = {
      name: meal.name,
      calories: parseInt(meal.calories, 10) || 0,
      protein: parseInt(meal.protein, 10) || 0,
      carbs: parseInt(meal.carbs, 10) || 0,
      fat: parseInt(meal.fat, 10) || 0,
      notes: meal.notes,
      meal_type: mealType,
      planned_date: selectedDate,
    };
    let result;
    if (meal.id) {
      // Update existing meal
      result = await plannedMealsAPI.updatePlannedMeal(meal.id, mealData, token);
    } else {
      // Create new meal
      result = await plannedMealsAPI.addPlannedMeal(mealData, token);
    }
    if (result.error) {
      alert(`Failed to save ${mealType} meal. Please try again.\n${result.error.message || ''}`);
      console.error(result.error);
    } else {
      alert(`${mealType} meal saved successfully!`);
      setMeals(prev => ({
        ...prev,
        [mealType]: { ...prev[mealType], id: result.data.id },
      }));
    }
  };

  const handleDeleteMeal = async (mealType) => {
    const meal = meals[mealType];
    if (!meal.id) {
      alert('No meal to delete.');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete the ${mealType} meal?`)) {
      return;
    }
    
    try {
      const token = await authService.getAccessToken();
      const result = await plannedMealsAPI.deletePlannedMeal(meal.id, token);
      
      if (result.error) {
        alert(`Failed to delete ${mealType} meal. Please try again.\n${result.error.message || ''}`);
        console.error(result.error);
      } else {
        alert(`${mealType} meal deleted successfully!`);
        setMeals(prev => ({
          ...prev,
          [mealType]: { id: null, name: '', calories: '', notes: '' },
        }));
      }
    } catch (error) {
      console.error('Error deleting meal:', error);
      alert('An unexpected error occurred while deleting the meal.');
    }
  };

  const totalCalories = Object.values(meals).reduce((sum, meal) => sum + (parseInt(meal.calories) || 0), 0);

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/signin');
  };

  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} />
      <div style={{ marginTop: '2rem' }}>
        <h1>Meal Planner</h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Plan your meals for better nutrition tracking. Your plans are now saved automatically.
        </p>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="card-title">Plan for:</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input"
              style={{ width: 'auto' }}
            />
          </div>

          {isLoading ? (
            <div>Loading meal plan...</div>
          ) : (
            <div className="meal-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {mealTypes.map(({ key, icon }) => (
                <div key={key} className="meal-card">
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{icon}</span>
                    <h4 style={{ margin: 0 }}>{key}</h4>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Meal Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={meals[key].name}
                      onChange={(e) => handleMealChange(key, 'name', e.target.value)}
                      placeholder={`Enter ${key.toLowerCase()}...`}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Calories</label>
                    <input
                      type="number"
                      className="form-input"
                      value={meals[key].calories}
                      onChange={(e) => handleMealChange(key, 'calories', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-input"
                      value={meals[key].notes}
                      onChange={(e) => handleMealChange(key, 'notes', e.target.value)}
                      placeholder="Any special notes..."
                      rows="2"
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button 
                      onClick={() => handleSaveMeal(key)} 
                      className="btn btn-primary" 
                      style={{ flex: 1 }}
                    >
                      Save {key}
                    </button>
                    {meals[key].id && (
                      <button 
                        onClick={() => handleDeleteMeal(key)} 
                        className="btn btn-secondary" 
                        style={{ 
                          padding: '0.5rem 1rem',
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ 
            background: '#f3f4f6', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginTop: '1.5rem',
            textAlign: 'center'
          }}>
            <strong>Total Planned Calories: {totalCalories}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealPlanner;
