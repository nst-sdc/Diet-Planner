/**
 * Diet Planner Backend Server
 * Express.js server for managing diet planning and nutrition tracking
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client'); // ✅ add this line

// Import route modules
const authRoutes = require('./routes/auth');
const mealsRoutes = require('./routes/meals');
const nutritionRoutes = require('./routes/nutrition');
const goalsRoutes = require('./routes/goals');
const loggedMealsRoutes = require('./routes/loggedMeals');
const plannedMealsRoutes = require('./routes/plannedMeals');

// Initialize Express app
const app = express();
const prisma = new PrismaClient(); // ✅ initialize Prisma

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Diet Planner Backend is running!',
    version: '1.0.0',
    status: 'healthy'
  });
});

// ✅ Add this DB connection test route
app.get('/api/dbtest', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, message: '✅ Database connection successful!' });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/logged-meals', loggedMealsRoutes);
app.use('/api/planned-meals', plannedMealsRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Diet Planner Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api/`);
});
