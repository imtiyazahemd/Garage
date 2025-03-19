const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./utils/errorHandler');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
require('./config/db');

// Initialize Swagger
require('./utils/swagger')(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/garages', require('./routes/garageRoutes'));

// Default route
app.get('/', (req, res) => {
  res.send('Garage Application API is running');
});

// Error handling middleware
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'production') {
  // Only listen if running locally (for dev/testing).
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;