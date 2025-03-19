const Customer = require('../models/Customer');
const Garage = require('../models/Garage');

/**
 * Update customer profile
 * @route PUT /api/customers/profile
 * @access Private
 */
exports.updateProfile = async (req, res) => {
  try {
    // Prevent updating role
    if (req.body.role) {
      delete req.body.role;
    }
    
    // Prevent updating password here (should have separate endpoint)
    if (req.body.password) {
      delete req.body.password;
    }
    
    const customer = await Customer.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Add a vehicle to customer profile
 * @route POST /api/customers/vehicles
 * @access Private
 */
exports.addVehicle = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    // Add vehicle to vehicles array
    customer.vehicles.push(req.body);
    
    await customer.save();
    
    res.status(201).json({
      success: true,
      data: customer.vehicles[customer.vehicles.length - 1],
      message: 'Vehicle added successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all customer vehicles
 * @route GET /api/customers/vehicles
 * @access Private
 */
exports.getVehicles = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      count: customer.vehicles.length,
      data: customer.vehicles
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Find nearby garages
 * @route GET /api/customers/garages/nearby
 * @access Private
 */
exports.findNearbyGarages = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 10000 } = req.query; // maxDistance in meters (default 10km)
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }
    
    const garages = await Garage.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      isVerified: true,
      isActive: true
    }).select('garageName address location ratings services specialties operatingHours');
    
    res.status(200).json({
      success: true,
      count: garages.length,
      data: garages
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Add a garage to customer's preferred list
 * @route POST /api/customers/preferred-garages/:garageId
 * @access Private
 */
exports.addPreferredGarage = async (req, res) => {
  try {
    const { garageId } = req.params;
    
    // Check if garage exists
    const garage = await Garage.findById(garageId);
    
    if (!garage) {
      return res.status(404).json({
        success: false,
        message: 'Garage not found'
      });
    }
    
    const customer = await Customer.findById(req.user.id);
    
    // Check if garage is already in preferred list
    if (customer.preferredGarages.includes(garageId)) {
      return res.status(400).json({
        success: false,
        message: 'Garage already in preferred list'
      });
    }
    
    // Add garage to preferred list
    customer.preferredGarages.push(garageId);
    await customer.save();
    
    res.status(200).json({
      success: true,
      message: 'Garage added to preferred list',
      data: customer.preferredGarages
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Submit a review for a garage
 * @route POST /api/customers/reviews/:garageId
 * @access Private
 */
exports.submitReview = async (req, res) => {
  try {
    const { garageId } = req.params;
    const { rating, comment } = req.body;
    
    // Validate rating only if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    // Check if garage exists
    const garage = await Garage.findById(garageId);
    
    if (!garage) {
      return res.status(404).json({
        success: false,
        message: 'Garage not found'
      });
    }
    
    // Check if customer has already reviewed this garage
    const hasReviewed = garage.reviews.some(
      review => review.customerId.toString() === req.user.id
    );
    
    if (hasReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this garage'
      });
    }
    
    // Add review
    const review = {
      customerId: req.user.id,
      rating,
      comment
    };
    
    garage.reviews.push(review);
    
    // Update garage ratings
    const totalRatings = garage.ratings.count + 1;
    const newAverageRating = 
      (garage.ratings.average * garage.ratings.count + rating) / totalRatings;
    
    garage.ratings = {
      average: newAverageRating,
      count: totalRatings
    };
    
    await garage.save();
    
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};