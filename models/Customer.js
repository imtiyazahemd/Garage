const mongoose = require('mongoose');
const User = require('./User');

const customerSchema = new mongoose.Schema({
  address: {
    street: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    zipCode: {
      type: String
    },
    country: {
      type: String,
      default: 'UAE'
    }
  },
  vehicles: [{
    make: {
      type: String
    },
    model: {
      type: String
    },
    year: {
      type: Number
    },
    licensePlate: {
      type: String
    },
    vin: {
      type: String
    }
  }],
  preferredGarages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garage'
  }],
  serviceHistory: [{
    garageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Garage'
    },
    serviceDate: {
      type: Date
    },
    serviceType: {
      type: String
    },
    description: String,
    cost: Number,
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled'
    }
  }]
}, {
  timestamps: true
});

// Set the role to customer by default
customerSchema.pre('save', function(next) {
  this.role = 'customer';
  next();
});

const Customer = User.discriminator('Customer', customerSchema);

module.exports = Customer;