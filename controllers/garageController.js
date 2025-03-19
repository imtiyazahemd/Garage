const Garage = require('../models/Garage');
const Customer = require('../models/Customer');

/**
 * Update garage profile
 * @route PUT /api/garages/profile
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
    
    // Handle location update if coordinates are provided
    if (req.body.latitude && req.body.longitude) {
      req.body.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      };
      
      // Remove the latitude and longitude from the request body
      delete req.body.latitude;
      delete req.body.longitude;
    }
    
    const garage = await Garage.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!garage) {
      return res.status(404).json({
        success: false,
        message: 'Garage not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: garage
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Add a service to garage
 * @route POST /api/garages/services
 * @access Private
 */
exports.addService = async (req, res) => {
  try {
    const { name, description, estimatedTime, basePrice } = req.body;
    
    // Name is no longer required
    // if (!name) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Service name is required'
    //   });
    // }
    
    const garage = await Garage.findById(req.user.id);
    
    if (!garage) {
      return res.status(404).json({
        success: false,
        message: 'Garage not found'
      });
    }
    
    // Add service to services array
    const newService = {
      name,
      description,
      estimatedTime,
      basePrice
    };
    
    garage.services.push(newService);
    await garage.save();
    
    res.status(201).json({
      success: true,
      data: newService,
      message: 'Service added successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all garage services
 * @route GET /api/garages/services
 * @access Private
 */
exports.getServices = async (req, res) => {
  try {
    const garage = await Garage.findById(req.user.id);
    
    if (!garage) {
      return res.status(404).json({
        success: false,
        message: 'Garage not found'
      });
    }
    
    res.status(200).json({
      success: true,
      count: garage.services.length,
      data: garage.services
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update garage's business hours
 * @route PUT /api/garages/hours
 * @access Private
 */
exports.updateHours = async (req, res) => {
  try {
    const garage = await Garage.findById(req.user.id);
    
    if (!garage) {
      return res.status(404).json({
        success: false,
        message: 'Garage not found'
      });
    }
    
    // Update operating hours
    garage.operatingHours = req.body;
    await garage.save();
    
    res.status(200).json({
      success: true,
      data: garage.operatingHours,
      message: 'Operating hours updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update garage specialties
 * @route PUT /api/garages/specialties
 * @access Private
 */
exports.updateSpecialties = async (req, res) => {
  try {
    const { specialties } = req.body;
    
    if (!specialties || !Array.isArray(specialties)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of specialties'
      });
    }
    
    const garage = await Garage.findById(req.user.id);
    
    if (!garage) {
      return res.status(404).json({
        success: false,
        message: 'Garage not found'
      });
    }
    
    garage.specialties = specialties;
    await garage.save();
    
    res.status(200).json({
      success: true,
      data: garage.specialties,
      message: 'Specialties updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get garage reviews
 * @route GET /api/garages/reviews
 * @access Private
 */
exports.getReviews = async (req, res) => {
  try {
    const garage = await Garage.findById(req.user.id)
      .populate({
        path: 'reviews.customerId',
        select: 'firstName lastName'
      });
    
    if (!garage) {
      return res.status(404).json({
        success: false,
        message: 'Garage not found'
      });
    }
    
    res.status(200).json({
      success: true,
      count: garage.reviews.length,
      ratings: garage.ratings,
      data: garage.reviews
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};