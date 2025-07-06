import { supabase } from '../lib/supabase'

// Authentication functions
export const authService = {
  // Sign up with email and password
  signUp: async (email, password, fullName) => {
    try {
      console.log('Supabase signup attempt:', { email, fullName }); // Debug log
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      console.log('Supabase signup response:', { data, error }); // Debug log
      return { data, error };
    } catch (err) {
      console.error('Supabase signup exception:', err); // Debug log
      return { 
        data: null, 
        error: { 
          message: err.message || 'Database error saving new user' 
        } 
      };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
  },

  // Get current access token
  getAccessToken: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  },
}

// Profile functions
export const profileService = {
  // Get user profile
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  }
}

// Daily goals functions
export const goalsService = {
  // Get user's daily goals
  getDailyGoals: async (userId) => {
    const { data, error } = await supabase
      .from('daily_goals')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  // Create or update daily goals
  setDailyGoals: async (userId, goals) => {
    const { data, error } = await supabase
      .from('daily_goals')
      .upsert({ user_id: userId, ...goals }, { onConflict: 'user_id' })
      .select()
      .single()
    return { data, error }
  }
}

// Logged meals functions (for nutrition tracker)
export const loggedMealsService = {
  // Get logged meals for a specific date
  getLoggedMeals: async (userId, date) => {
    const { data, error } = await supabase
      .from('logged_meals')
      .select('*')
      .eq('user_id', userId)
      .eq('meal_date', date)
      .order('logged_at', { ascending: true })
    return { data, error }
  },

  // Add a logged meal
  addLoggedMeal: async (mealData) => {
    const { data, error } = await supabase
      .from('logged_meals')
      .insert(mealData)
      .select()
      .single()
    return { data, error }
  },

  // Delete a logged meal
  deleteLoggedMeal: async (mealId) => {
    const { error } = await supabase
      .from('logged_meals')
      .delete()
      .eq('id', mealId)
    return { error }
  },

  // Get logged meals for a date range
  getLoggedMealsRange: async (userId, startDate, endDate) => {
    const { data, error } = await supabase
      .from('logged_meals')
      .select('*')
      .eq('user_id', userId)
      .gte('meal_date', startDate)
      .lte('meal_date', endDate)
      .order('meal_date', { ascending: true })
    return { data, error }
  }
}

// Planned meals functions (for meal planner)
export const plannedMealsService = {
  // Get planned meals for a specific date
  getPlannedMeals: async (userId, date) => {
    const { data, error } = await supabase
      .from('planned_meals')
      .select('*')
      .eq('user_id', userId)
      .eq('planned_date', date)
      .order('meal_type', { ascending: true })
    return { data, error }
  },

  // Add a planned meal
  addPlannedMeal: async (mealData) => {
    const { data, error } = await supabase
      .from('planned_meals')
      .insert(mealData)
      .select()
      .single()
    return { data, error }
  },

  // Update a planned meal
  updatePlannedMeal: async (mealId, updates) => {
    const { data, error } = await supabase
      .from('planned_meals')
      .update(updates)
      .eq('id', mealId)
      .select()
      .single()
    return { data, error }
  },

  // Delete a planned meal
  deletePlannedMeal: async (mealId) => {
    const { error } = await supabase
      .from('planned_meals')
      .delete()
      .eq('id', mealId)
    return { error }
  }
}

// Only export authService
export default {
  auth: authService
} 