const API_BASE_URL = 'http://localhost:5050/api';

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  };

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  console.log('API CALL:', url, config);

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Nutrition API calls
export const nutritionAPI = {
  // Search for foods using USDA and Open Food Facts
  searchFoods: async (query) => {
    return apiCall(`/nutrition/search?query=${encodeURIComponent(query)}`);
  },
};

// Meals API calls
export const mealsAPI = {
  // Get all meals for a user
  getMeals: async (token) => {
    return apiCall('/meals', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Add a new meal
  addMeal: async (mealData, token) => {
    return apiCall('/meals', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mealData),
    });
  },

  // Update a meal
  updateMeal: async (mealId, mealData, token) => {
    return apiCall(`/meals/${mealId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mealData),
    });
  },

  // Delete a meal
  deleteMeal: async (mealId, token) => {
    return apiCall(`/meals/${mealId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Auth API calls
export const authAPI = {
  // Login user
  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Register user
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Goals API calls
export const goalsAPI = {
  getGoals: async (token) => {
    return apiCall('/goals', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  setGoals: async (goalData, token) => {
    return apiCall('/goals', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(goalData),
    });
  },
  deleteGoals: async (token) => {
    return apiCall('/goals', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Logged Meals API calls
export const loggedMealsAPI = {
  getLoggedMeals: async (date, token) => {
    return apiCall(`/logged-meals?date=${encodeURIComponent(date)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  addLoggedMeal: async (mealData, token) => {
    return apiCall('/logged-meals', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(mealData),
    });
  },
  deleteLoggedMeal: async (mealId, token) => {
    return apiCall(`/logged-meals/${mealId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  getLoggedMealsRange: async (start, end, token) => {
    return apiCall(`/logged-meals/range?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Planned Meals API calls
export const plannedMealsAPI = {
  getPlannedMeals: async (date, token) => {
    return apiCall(`/planned-meals?date=${encodeURIComponent(date)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  addPlannedMeal: async (mealData, token) => {
    return apiCall('/planned-meals', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(mealData),
    });
  },
  updatePlannedMeal: async (mealId, mealData, token) => {
    return apiCall(`/planned-meals/${mealId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(mealData),
    });
  },
  deletePlannedMeal: async (mealId, token) => {
    return apiCall(`/planned-meals/${mealId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default {
  nutrition: nutritionAPI,
  meals: mealsAPI,
  auth: authAPI,
  goals: goalsAPI,
  loggedMeals: loggedMealsAPI,
  plannedMeals: plannedMealsAPI,
}; 