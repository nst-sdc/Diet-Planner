const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { generateToken } = require('../middleware/auth');

// Sign up user
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', { email: req.body?.email, hasPassword: !!req.body?.password });
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password needed' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });

    // Generate token
    const token = generateToken(user.id);

    console.log('User created successfully:', user.email);
    
    res.status(201).json({ 
      data: { user, token },
      success: true, 
      message: 'User created!' 
    });
  } catch (error) {
    console.error('Signup error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    
    // Handle Prisma unique constraint violation (duplicate email)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Handle database connection errors
    if (error.code === 'P1001' || error.code === 'P1017') {
      return res.status(500).json({ 
        error: 'Database connection error',
        message: 'Unable to connect to database. Please check your database configuration.'
      });
    }
    
    res.status(500).json({ 
      error: 'Server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password needed' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({ 
      data: { 
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt
        },
        token 
      },
      success: true, 
      message: 'Login successful!' 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

module.exports = router;
