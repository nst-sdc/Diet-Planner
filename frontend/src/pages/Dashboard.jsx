import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { goalsAPI, loggedMealsAPI, plannedMealsAPI } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import Navigation from '../components/Navigation';
import { authService } from '../services/apiService';

function Dashboard({ user }) {
  const [goals, setGoals] = useState({ calories: 2000 });
  const [todaysCalories, setTodaysCalories] = useState(0);
  const [todaysPlannedMeals, setTodaysPlannedMeals] = useState([]);
  const [todaysLoggedMeals, setTodaysLoggedMeals] = useState([]);
  const [weeklyHistory, setWeeklyHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [goalError, setGoalError] = useState('');
  const navigate = useNavigate();

  // Helper to get today's date as YYYY-MM-DD
  function getToday() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  const today = getToday();

  // Logout handler
  const handleLogout = async () => {
    await authService.signOut();
    navigate('/signin');
  };

  // Fetch dashboard data
  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      setIsLoading(true);
      setGoalError('');
      try {
        const token = await authService.getAccessToken();
        // Get 7 days ago as YYYY-MM-DD
        const d = new Date();
        d.setDate(d.getDate() - 6);
        const startDate = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

        // Fetch all dashboard data
        const [goalsRes, plannedMealsRes, loggedHistoryRes, todaysLoggedMealsRes] = await Promise.all([
          goalsAPI.getGoals(token),
          plannedMealsAPI.getPlannedMeals(today, token),
          loggedMealsAPI.getLoggedMealsRange(startDate, today, token),
          loggedMealsAPI.getLoggedMeals(today, token),
        ]);

        let currentGoals = { calories: 2000 };
        if (goalsRes.data) {
          setGoals(goalsRes.data);
          setNewGoal(goalsRes.data.calories);
          currentGoals = goalsRes.data;
        } else {
          setIsEditingGoal(true);
        }

        if (plannedMealsRes.data) {
          setTodaysPlannedMeals(plannedMealsRes.data);
        }

        if (todaysLoggedMealsRes.data) {
          setTodaysLoggedMeals(todaysLoggedMealsRes.data);
          const totalLoggedCalories = todaysLoggedMealsRes.data.reduce((sum, meal) => sum + (meal.calories || 0), 0);
          setTodaysCalories(totalLoggedCalories);
        } else {
          setTodaysLoggedMeals([]);
          setTodaysCalories(0);
        }

        // Build weekly history - handle both camelCase and snake_case
        if (loggedHistoryRes.data) {
          let historyByDate = {};
          loggedHistoryRes.data.forEach(meal => {
            // Handle both mealDate (camelCase) and meal_date (snake_case)
            let dateStr = meal.mealDate || meal.meal_date;
            if (dateStr) {
              let date = dateStr.split('T')[0];
              if (!historyByDate[date]) historyByDate[date] = 0;
              historyByDate[date] += meal.calories || 0;
            }
          });
          let formattedHistory = [];
          for (let i = 6; i >= 0; i--) {
            let d = new Date();
            d.setDate(d.getDate() - i);
            let dateStr = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
            let totalCals = historyByDate[dateStr] || 0;
            formattedHistory.push({
              date: dateStr,
              calories: totalCals,
              goalMet: totalCals >= currentGoals.calories && totalCals > 0,
            });
          }
          setWeeklyHistory(formattedHistory);
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setGoalError('Failed to load dashboard data.');
      }
      setIsLoading(false);
    }
    fetchData();
  }, [user?.id]);

  // Handle goal update
  const handleGoalUpdate = async (e) => {
    e.preventDefault();
    setGoalError('');
    const calories = parseInt(newGoal, 10);
    if (!calories || calories <= 0) {
      setGoalError('Please enter a valid number for your calorie goal.');
      return;
    }
    try {
      const token = await authService.getAccessToken();
      const res = await goalsAPI.setGoals({ calories }, token);
      if (res.error) {
        setGoalError('Failed to update your goal.');
      } else {
        setGoals(res.data);
        setIsEditingGoal(false);
        setGoalError('');
      }
    } catch (err) {
      setGoalError('Failed to update your goal.');
    }
  };

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', marginTop: '2rem' }}>
        <div>
          <h1>Welcome back, {user?.user_metadata?.full_name || user?.email || 'User'}! 👋</h1>
          <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Here's your nutrition overview.</p>
        </div>
        <div style={{ fontSize: '1rem', color: '#6b7280', textAlign: 'right' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="card-title" style={{ margin: 0 }}>Today's Planned Progress</h3>
          <button onClick={() => setIsEditingGoal(!isEditingGoal)} className="btn btn-primary" style={{ fontWeight: 700, fontSize: '1rem', padding: '0.5rem 1.5rem', background: '#059669', color: 'white', border: 'none', boxShadow: '0 2px 8px rgba(5,150,105,0.08)' }}>
            {isEditingGoal ? 'Cancel' : 'Edit Goal'}
          </button>
        </div>
        {isEditingGoal ? (
          <form onSubmit={handleGoalUpdate} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
            <input type="number" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} className="form-input" placeholder="e.g., 2000" required style={{ maxWidth: 120 }} />
            <button type="submit" className="btn btn-primary" style={{ fontWeight: 700, fontSize: '1rem', padding: '0.5rem 1.5rem' }}>Save Goal</button>
            {goalError && <span style={{ color: '#dc2626', marginLeft: '1rem' }}>{goalError}</span>}
          </form>
        ) : (
          <ProgressBar value={todaysCalories} max={goals.calories} />
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        <div className="card">
          <h3 className="card-title">Today's Planned Meals</h3>
          {todaysPlannedMeals.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {todaysPlannedMeals.map(meal => (
                <li key={meal.id} className="nutrition-item">
                  <span>{meal.name} ({meal.mealType || meal.meal_type})</span>
                  <span style={{ color: '#6b7280' }}>{meal.calories || 0} kcal</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#6b7280' }}>You haven't planned any meals for today.</p>
          )}
          <Link to="/meal-planner" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
            + Plan a Meal
          </Link>
        </div>

        <div className="card">
          <h3 className="card-title">Weekly Calorie History (Logged)</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {weeklyHistory.map(day => (
              <li key={day.date} className="nutrition-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 500 }}>{new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  {day.goalMet && <span title="Goal Met!">✅</span>}
                </div>
                <span style={{ color: '#6b7280' }}>{day.calories} / {goals.calories} kcal</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 className="card-title">Track Your Nutrition</h3>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          Log what you eat throughout the day in the Nutrition Tracker. This helps you understand your habits and see how your daily intake compares to your goals.
        </p>
        <Link to="/nutrition-tracker" className="btn btn-primary" style={{ width: '100%', fontWeight: 700, fontSize: '1rem', padding: '0.75rem 0' }}>
          Go to Nutrition Tracker
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
