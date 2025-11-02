console.log('🚀 Starting minimal backend server...');

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true
}));
app.use(express.json());

// Health endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'OK', 
    message: 'ConnectHub Pro API is running',
    timestamp: new Date().toISOString()
  });
});

// Demo users (in memory for now)
const demoUsers = [
  {
    id: 1,
    email: 'john@brewconnect.com',
    password: '$2a$12$wXLCm7TZw.kIhJY0r2.3Su8SoQh3mlgk/pReAuJ5Z/9Uq0tKuM1PG', // password123
    firstName: 'John',
    lastName: 'Smith',
    userType: 'business'
  },
  {
    id: 2,
    email: 'alex@example.com',
    password: '$2a$12$wXLCm7TZw.kIhJY0r2.3Su8SoQh3mlgk/pReAuJ5Z/9Uq0tKuM1PG', // password123
    firstName: 'Alex',
    lastName: 'Wilson',
    userType: 'professional'
  }
];

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user
    const user = demoUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      'your-secret-key',
      { expiresIn: '7d' }
    );
    
    console.log('Login successful for:', email);
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType
      },
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { email, password, firstName, lastName, userType } = req.body;
    
    if (!email || !password || !firstName || !lastName || !userType) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Check if user exists
    const existingUser = demoUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const newUser = {
      id: demoUsers.length + 1,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      userType
    };
    
    demoUsers.push(newUser);
    
    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, userType: newUser.userType },
      'your-secret-key',
      { expiresIn: '7d' }
    );
    
    console.log('Registration successful for:', email);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userType: newUser.userType
      },
      token
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Businesses endpoint
app.get('/api/businesses', (req, res) => {
  res.json({
    success: true,
    businesses: [
      {
        id: 1,
        name: 'BrewConnect Local',
        category: 'Food & Beverage',
        description: 'Connecting coffee lovers with local breweries',
        location: 'Downtown District',
        rating: 4.8,
        owner: 'John Smith'
      },
      {
        id: 2,
        name: 'TechForward Solutions',
        category: 'Technology',
        description: 'Innovative software solutions for small businesses',
        location: 'Tech Hub',
        rating: 4.9,
        owner: 'Sarah Johnson'
      }
    ]
  });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('🎉 Minimal Backend Server Started!');
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('🧪 Demo Accounts:');
  console.log('  Business: john@brewconnect.com / password123');
  console.log('  Professional: alex@example.com / password123');
  console.log('');
});

console.log('✅ Backend server setup complete');
