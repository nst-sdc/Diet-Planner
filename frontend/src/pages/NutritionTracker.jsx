import React, { useState, useEffect } from 'react'
import { nutritionAPI, loggedMealsAPI } from '../services/api'
import Navigation from '../components/Navigation';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/apiService';

function NutritionTracker({ user }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [trackedFoods, setTrackedFoods] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [editingQuantity, setEditingQuantity] = useState(null)
  const [tempQuantity, setTempQuantity] = useState('')
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualFood, setManualFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    quantity: '100'
  })
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/signin');
  };

  // Load logged meals for the selected date
  useEffect(() => {
    if (user?.id) {
      loadLoggedMeals()
    }
  }, [selectedDate, user?.id])

  const loadLoggedMeals = async () => {
    setIsLoading(true)
    try {
      const token = await authService.getAccessToken();
      const { data, error } = await loggedMealsAPI.getLoggedMeals(selectedDate, token)
      if (error) {
        console.error('Error loading logged meals:', error)
        setError('Failed to load your logged meals')
      } else {
        setTrackedFoods(data || [])
      }
    } catch (err) {
      console.error('Error loading logged meals:', err)
      setError('Failed to load your logged meals')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setHasSearched(true)
    setError('')
    
    try {
      const response = await nutritionAPI.searchFoods(searchQuery)
      setSearchResults(response.data || [])
    } catch (error) {
      console.error('Search failed:', error)
      setError('Failed to search for foods. Please try again.')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const addToTracked = async (food) => {
    if (!user?.id) {
      setError('You must be logged in to track foods.')
      return
    }
    console.log('Food to log:', food); // Debug log
    
    // Better validation that handles beverages and other foods with missing nutrition data
    if (!food.name) {
      setError('Food name is required.');
      return;
    }
    
    // Convert nutrition values to numbers, defaulting to 0 if missing or invalid
    const nutritionData = {
      calories: parseFloat(food.calories) || 0,
      protein: parseFloat(food.protein) || 0,
      carbs: parseFloat(food.carbs) || 0,
      fat: parseFloat(food.fat) || 0,
      fiber: parseFloat(food.fiber) || 0
    };
    
    // Check if all nutrition values are valid numbers
    if (Object.values(nutritionData).some(val => isNaN(val))) {
      setError('Invalid nutrition data. Please try a different food item.');
      return;
    }
    
    try {
      const token = await authService.getAccessToken();
      const mealData = {
        name: food.name,
        calories: Math.round(nutritionData.calories),
        protein: Math.round(nutritionData.protein * 10) / 10, // Round to 1 decimal
        carbs: Math.round(nutritionData.carbs * 10) / 10,
        fat: Math.round(nutritionData.fat * 10) / 10,
        fiber: Math.round(nutritionData.fiber * 10) / 10,
        meal_date: selectedDate
      }
      
      console.log('Sending meal data:', mealData);
      const { data, error } = await loggedMealsAPI.addLoggedMeal(mealData, token)
      
      if (error) {
        console.error('API error:', error)
        setError(`Failed to save meal: ${error.message || 'Unknown error'}`)
      } else {
        setTrackedFoods(prev => [...prev, data])
        setSearchResults([])
        setSearchQuery('')
        setError('') // Clear any previous errors
      }
    } catch (err) {
      console.error('Error adding meal:', err)
      setError('An unexpected error occurred while saving your meal.')
    }
  }

  const removeFromTracked = async (mealId) => {
    try {
      const token = await authService.getAccessToken();
      const { error } = await loggedMealsAPI.deleteLoggedMeal(mealId, token)
      if (error) {
        console.error('API error:', error)
        setError(`Failed to remove meal: ${error.message}`)
      } else {
        setTrackedFoods(prev => prev.filter(food => food.id !== mealId))
      }
    } catch (err) {
      console.error('Error removing meal:', err)
      setError('An unexpected error occurred while removing your meal.')
    }
  }

  const handleQuantityEdit = (mealId, currentQuantity) => {
    setEditingQuantity(mealId)
    setTempQuantity(currentQuantity.toString())
  }

  const handleQuantityUpdate = async (mealId) => {
    const newQuantity = parseFloat(tempQuantity)
    if (isNaN(newQuantity) || newQuantity <= 0) {
      setError('Please enter a valid quantity greater than 0')
      return
    }

    try {
      const token = await authService.getAccessToken();
      const { data, error } = await loggedMealsAPI.updateMealQuantity(mealId, newQuantity, token)
      if (error) {
        console.error('API error:', error)
        setError(`Failed to update quantity: ${error.message}`)
      } else {
        setTrackedFoods(prev => prev.map(food => 
          food.id === mealId ? data : food
        ))
        setEditingQuantity(null)
        setTempQuantity('')
        setError('')
      }
    } catch (err) {
      console.error('Error updating quantity:', err)
      setError('An unexpected error occurred while updating quantity.')
    }
  }

  const handleQuantityCancel = () => {
    setEditingQuantity(null)
    setTempQuantity('')
  }

  const handleManualFoodChange = (field, value) => {
    setManualFood(prev => ({ ...prev, [field]: value }))
  }

  const handleManualFoodSubmit = async () => {
    if (!manualFood.name || !manualFood.calories || !manualFood.protein || !manualFood.carbs || !manualFood.fat) {
      setError('Please fill in all fields')
      return
    }

    try {
      const token = await authService.getAccessToken();
      const mealData = {
        name: manualFood.name,
        calories: parseFloat(manualFood.calories),
        protein: parseFloat(manualFood.protein),
        carbs: parseFloat(manualFood.carbs),
        fat: parseFloat(manualFood.fat),
        quantity: parseFloat(manualFood.quantity),
        meal_date: selectedDate
      }

      const { data, error } = await loggedMealsAPI.addManualMeal(mealData, token)
      if (error) {
        setError(`Failed to add meal: ${error.message}`)
      } else {
        setTrackedFoods(prev => [...prev, data])
        setManualFood({ name: '', calories: '', protein: '', carbs: '', fat: '', quantity: '100' })
        setShowManualEntry(false)
        setError('')
      }
    } catch (err) {
      console.error('Error adding manual meal:', err)
      setError('An unexpected error occurred while adding your meal.')
    }
  }

  const getDailyTotals = () => {
    return trackedFoods.reduce((totals, food) => ({
      calories: totals.calories + (food.calories || 0),
      protein: totals.protein + (food.protein || 0),
      carbs: totals.carbs + (food.carbs || 0),
      fat: totals.fat + (food.fat || 0),
      fiber: totals.fiber + (food.fiber || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 })
  }

  const dailyTotals = getDailyTotals()

  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} />
      <div style={{ marginTop: '2rem' }}>
        <h1>Nutrition Tracker</h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Track your daily nutrition intake
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-input"
            style={{ width: 'auto' }}
          />
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Search for foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            onClick={handleSearch} 
            className="btn btn-primary"
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div style={{ 
            color: '#fff', 
            background: '#dc2626', 
            padding: '1rem', 
            borderRadius: '4px', 
            marginBottom: '1rem',
            border: '1px solid #fecaca',
            fontWeight: 600,
            fontSize: '1.1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {searchResults.length > 0 ? (
          <div className="nutrition-form">
            <h3>Search Results</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {searchResults.map(food => (
                <div key={food.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '4px'
                }}>
                  <div>
                    <strong>{food.name}</strong>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {food.calories} cal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      Source: {food.source}
                    </div>
                  </div>
                  <button 
                    onClick={() => addToTracked(food)}
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : hasSearched && searchQuery && !isSearching && searchResults.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: '#f9fafb', borderRadius: '4px', marginBottom: '1rem' }}>
            <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '1.1rem' }}>No results found for "{searchQuery}"</p>
            <button 
              onClick={() => setShowManualEntry(true)}
              className="btn btn-primary"
              style={{ background: '#059669', padding: '0.75rem 1.5rem', fontSize: '1rem' }}
            >
              ➕ Add Custom Food Manually
            </button>
          </div>
        ) : null}

        {showManualEntry && (
          <div className="nutrition-form" style={{ marginBottom: '2rem', border: '2px solid #059669' }}>
            <h3 style={{ color: '#059669' }}>✏️ Add Custom Food</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Food Name (e.g., Homemade Curry)"
                value={manualFood.name}
                onChange={(e) => handleManualFoodChange('name', e.target.value)}
                className="form-input"
                style={{ fontSize: '1rem', padding: '0.75rem' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input
                  type="number"
                  placeholder="Calories"
                  value={manualFood.calories}
                  onChange={(e) => handleManualFoodChange('calories', e.target.value)}
                  className="form-input"
                  style={{ fontSize: '1rem', padding: '0.75rem' }}
                />
                <input
                  type="number"
                  placeholder="Quantity (grams)"
                  value={manualFood.quantity}
                  onChange={(e) => handleManualFoodChange('quantity', e.target.value)}
                  className="form-input"
                  style={{ fontSize: '1rem', padding: '0.75rem' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={manualFood.protein}
                  onChange={(e) => handleManualFoodChange('protein', e.target.value)}
                  className="form-input"
                  style={{ fontSize: '1rem', padding: '0.75rem' }}
                />
                <input
                  type="number"
                  placeholder="Carbs (g)"
                  value={manualFood.carbs}
                  onChange={(e) => handleManualFoodChange('carbs', e.target.value)}
                  className="form-input"
                  style={{ fontSize: '1rem', padding: '0.75rem' }}
                />
                <input
                  type="number"
                  placeholder="Fat (g)"
                  value={manualFood.fat}
                  onChange={(e) => handleManualFoodChange('fat', e.target.value)}
                  className="form-input"
                  style={{ fontSize: '1rem', padding: '0.75rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={handleManualFoodSubmit}
                  className="btn btn-primary"
                  style={{ flex: 1, background: '#059669', padding: '0.75rem', fontSize: '1rem' }}
                >
                  ✅ Add Food
                </button>
                <button 
                  onClick={() => {
                    setShowManualEntry(false)
                    setManualFood({ name: '', calories: '', protein: '', carbs: '', fat: '', quantity: '100' })
                  }}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="nutrition-results">
          <h3>Today's Nutrition ({selectedDate})</h3>
          
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              Loading your nutrition data...
            </div>
          )}
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '4px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                {dailyTotals.calories}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Calories</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '4px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                {dailyTotals.protein.toFixed(1)}g
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Protein</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '4px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                {dailyTotals.carbs.toFixed(1)}g
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Carbs</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '4px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                {dailyTotals.fat.toFixed(1)}g
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Fat</div>
            </div>
          </div>

          <h4>Tracked Foods</h4>
          {!isLoading && trackedFoods.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              No foods tracked for this date. Search and add some foods above!
            </p>
          ) : (
            <div>
              {trackedFoods.map(food => (
                <div key={food.id} className="nutrition-item" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '4px',
                  marginBottom: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ flex: 1 }}>
                    <strong>{food.name}</strong>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      {food.calories} calories | P: {food.protein || 0}g | C: {food.carbs || 0}g | F: {food.fat || 0}g
                    </div>
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {editingQuantity === food.id ? (
                        <>
                          <input
                            type="number"
                            value={tempQuantity}
                            onChange={(e) => setTempQuantity(e.target.value)}
                            placeholder="Grams"
                            style={{
                              width: '80px',
                              padding: '0.25rem 0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '0.875rem'
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && handleQuantityUpdate(food.id)}
                          />
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>grams</span>
                          <button
                            onClick={() => handleQuantityUpdate(food.id)}
                            style={{
                              padding: '0.25rem 0.75rem',
                              fontSize: '0.75rem',
                              background: '#059669',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: '500'
                            }}
                          >
                            ✔ Save
                          </button>
                          <button
                            onClick={handleQuantityCancel}
                            style={{
                              padding: '0.25rem 0.75rem',
                              fontSize: '0.75rem',
                              background: '#6b7280',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: '500'
                            }}
                          >
                            ✖ Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '600' }}>
                            🍽️ {food.quantity || 100}g
                          </span>
                          <button
                            onClick={() => handleQuantityEdit(food.id, food.quantity || 100)}
                            style={{
                              padding: '0.25rem 0.75rem',
                              fontSize: '0.75rem',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: '500'
                            }}
                          >
                            ⚖️ Adjust Quantity
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromTracked(food.id)}
                    className="btn btn-secondary"
                    style={{ 
                      padding: '0.5rem 1rem', 
                      fontSize: '0.875rem',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    🗑️ Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NutritionTracker 