const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function to set auth token
const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

// Helper function to remove auth token
const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

// Helper function to make authenticated requests
const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeAuthToken();
    window.location.href = '/signin';
  }

  return response;
};

// Authentication functions
export const authService = {
  // Sign up with email and password
  signUp: async (email, password, fullName) => {
    try {
      // Clear any existing session first
      removeAuthToken();
      
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: result.error || 'Signup failed' } };
      }

      // Store token and user
      if (result.data?.token) {
        setAuthToken(result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      return { data: { user: result.data.user }, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message || 'Network error' } };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      // Clear any existing session first
      removeAuthToken();
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: result.error || 'Login failed' } };
      }

      // Store token and user
      if (result.data?.token) {
        setAuthToken(result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      return { data: { user: result.data.user }, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message || 'Network error' } };
    }
  },

  // Sign out
  signOut: async () => {
    removeAuthToken();
    return { error: null };
  },

  // Get current user
  getCurrentUser: async () => {
    const token = getAuthToken();
    if (!token) {
      return { user: null, error: null };
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return { user, error: null };
      } catch {
        removeAuthToken();
        return { user: null, error: null };
      }
    }

    return { user: null, error: null };
  },

  // Listen to auth changes (mock for compatibility)
  onAuthStateChange: (callback) => {
    // Return a mock subscription object
    return { 
      data: { 
        subscription: { 
          unsubscribe: () => {} 
        } 
      } 
    };
  },

  // Get current access token
  getAccessToken: async () => {
    return getAuthToken();
  },
};

// Daily goals functions
export const goalsService = {
  // Get user's daily goals
  getDailyGoals: async (userId) => {
    try {
      const response = await authFetch(`${API_URL}/goals`);
      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: result.error || 'Failed to fetch goals' } };
      }

      return { data: result.data, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  },

  // Create or update daily goals
  setDailyGoals: async (userId, goals) => {
    try {
      const response = await authFetch(`${API_URL}/goals`, {
        method: 'POST',
        body: JSON.stringify(goals),
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: result.error || 'Failed to save goals' } };
      }

      return { data: result.data, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  },
};

// Logged meals functions (for nutrition tracker)
export const loggedMealsService = {
  // Get logged meals for a specific date
  getLoggedMeals: async (userId, date) => {
    try {
      const response = await authFetch(`${API_URL}/logged-meals?date=${date}`);
      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: result.error || 'Failed to fetch meals' } };
      }

      return { data: result.data || [], error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  },

  // Add a logged meal
  addLoggedMeal: async (mealData) => {
    try {
      const response = await authFetch(`${API_URL}/logged-meals`, {
        method: 'POST',
        body: JSON.stringify(mealData),
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: result.error || 'Failed to add meal' } };
      }

      return { data: result.data, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  },

  // Delete a logged meal
  deleteLoggedMeal: async (mealId) => {
    try {
      const response = await authFetch(`${API_URL}/logged-meals/${mealId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: { message: result.error || 'Failed to delete meal' } };
      }

      return { error: null };
    } catch (err) {
      return { error: { message: err.message } };
    }
  },

  // Get logged meals for a date range
  getLoggedMealsRange: async (userId, startDate, endDate) => {
    try {
      const response = await authFetch(`${API_URL}/logged-meals/range?start=${startDate}&end=${endDate}`);
      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: result.error || 'Failed to fetch meals' } };
      }

      return { data: result.data || [], error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  },
};

// Planned meals functions (for meal planner)
export const plannedMealsService = {
  // Get planned meals for a specific date
  getPlannedMeals: async (userId, date) => {
    try {
      const response = await authFetch(`${API_URL}/planned-meals?date=${date}`);
      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: result.error || 'Failed to fetch meals' } };
      }

      return { data: result.data || [], error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  },

  // Add a planned meal
  addPlannedMeal: async (mealData) => {
    try {
      const response = await authFetch(`${API_URL}/planned-meals`, {
        method: 'POST',
        body: JSON.stringify(mealData),
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: result.error || 'Failed to add meal' } };
      }

      return { data: result.data, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  },

  // Update a planned meal
  updatePlannedMeal: async (mealId, updates) => {
    try {
      const response = await authFetch(`${API_URL}/planned-meals/${mealId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: result.error || 'Failed to update meal' } };
      }

      return { data: result.data, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  },

  // Delete a planned meal
  deletePlannedMeal: async (mealId) => {
    try {
      const response = await authFetch(`${API_URL}/planned-meals/${mealId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: { message: result.error || 'Failed to delete meal' } };
      }

      return { error: null };
    } catch (err) {
      return { error: { message: err.message } };
    }
  },
};

export default {
  auth: authService,
};
