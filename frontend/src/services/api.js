const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add auth token if available and not already set
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  console.log('API CALL:', url, config);

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      return { data: null, error: { message: data.error || 'API request failed' } };
    }
    
    return { data: data.data || data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return { data: null, error: { message: error.message || 'Network error' } };
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
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Add a new meal
  addMeal: async (mealData, token) => {
    return apiCall('/meals', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: mealData,
    });
  },

  // Update a meal
  updateMeal: async (mealId, mealData, token) => {
    return apiCall(`/meals/${mealId}`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: mealData,
    });
  },

  // Delete a meal
  deleteMeal: async (mealId, token) => {
    return apiCall(`/meals/${mealId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};

// Auth API calls
export const authAPI = {
  // Login user
  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  // Register user
  register: async (userData) => {
    return apiCall('/auth/signup', {
      method: 'POST',
      body: userData,
    });
  },
};

// Goals API calls
export const goalsAPI = {
  getGoals: async (token) => {
    return apiCall('/goals', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
  setGoals: async (goalData, token) => {
    return apiCall('/goals', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: goalData,
    });
  },
  deleteGoals: async (token) => {
    return apiCall('/goals', {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};

// Logged Meals API calls
export const loggedMealsAPI = {
  getLoggedMeals: async (date, token) => {
    return apiCall(`/logged-meals?date=${encodeURIComponent(date)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
  addLoggedMeal: async (mealData, token) => {
    return apiCall('/logged-meals', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: mealData,
    });
  },
  addManualMeal: async (mealData, token) => {
    return apiCall('/logged-meals/manual', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: mealData,
    });
  },
  updateMealQuantity: async (mealId, quantity, token) => {
    return apiCall(`/logged-meals/${mealId}/quantity`, {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: { quantity },
    });
  },
  deleteLoggedMeal: async (mealId, token) => {
    return apiCall(`/logged-meals/${mealId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
  getLoggedMealsRange: async (start, end, token) => {
    return apiCall(`/logged-meals/range?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};

// Planned Meals API calls
export const plannedMealsAPI = {
  getPlannedMeals: async (date, token) => {
    return apiCall(`/planned-meals?date=${encodeURIComponent(date)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
  addPlannedMeal: async (mealData, token) => {
    return apiCall('/planned-meals', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: mealData,
    });
  },
  updatePlannedMeal: async (mealId, mealData, token) => {
    return apiCall(`/planned-meals/${mealId}`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: mealData,
    });
  },
  deletePlannedMeal: async (mealId, token) => {
    return apiCall(`/planned-meals/${mealId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
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
