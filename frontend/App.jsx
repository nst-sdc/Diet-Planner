import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Home from './src/pages/Home';
import SignIn from './src/pages/Login';
import SignUp from './src/pages/SignUp';
import Dashboard from './src/pages/Dashboard';
import NutritionTracker from './src/pages/NutritionTracker';
import MealPlanner from './src/pages/MealPlanner';
import Navigation from './src/components/Navigation';
import { authService } from './src/services/supabaseService';
import './App.css';

function ProtectedRoute({ user, children }) {
  if (user === undefined) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in

  useEffect(() => {
    let mounted = true;
    authService.getCurrentUser().then(({ user }) => {
      if (mounted) setUser(user);
    });
    // Listen to auth changes
    const { data: listener } = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    return () => {
      mounted = false;
      if (listener && listener.subscription) listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } />
          <Route path="/nutrition-tracker" element={
            <ProtectedRoute user={user}>
              <NutritionTracker user={user} />
            </ProtectedRoute>
          } />
          <Route path="/meal-planner" element={
            <ProtectedRoute user={user}>
              <MealPlanner user={user} />
            </ProtectedRoute>
          } />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App; 