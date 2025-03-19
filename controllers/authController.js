const User = require('../models/User');
const Customer = require('../models/Customer');
const Garage = require('../models/Garage');

/**
 * Register a new user
 * @route POST /api/auth/register/:userType
 * @access Public
 */
exports.register = async (req, res) => {
  try {
    const { userType } = req.params;
    
    if (userType !== 'customer' && userType !== 'garage') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type. Must be customer or garage.'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }
    
    let user;
    
    if (userType === 'customer') {
      user = await Customer.create(req.body);
    } else {
      user = await Garage.create(req.body);
    }
    
    // Create token
    const token = user.getSignedJwtToken();
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate email & password for login (still required for authentication)
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }
    
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Create token
    const token = user.getSignedJwtToken();
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get current logged in user
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = async (req, res) => {
  try {
    let user;
    
    if (req.user.role === 'customer') {
      user = await Customer.findById(req.user.id);
    } else if (req.user.role === 'garage') {
      user = await Garage.findById(req.user.id);
    } else {
      user = await User.findById(req.user.id);
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};