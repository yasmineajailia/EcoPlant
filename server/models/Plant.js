const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a plant name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'TND',
    enum: ['TND', 'EUR', 'USD']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['indoor', 'outdoor', 'succulent', 'flower', 'tree', 'herb', 'other']
  },
  size: {
    type: String,
    required: [true, 'Please specify a size'],
    enum: ['small', 'medium', 'large']
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  onPromotion: {
    type: Boolean,
    default: false
  },
  promotionPrice: {
    type: Number,
    min: [0, 'Promotion price cannot be negative']
  },
  careInstructions: {
    watering: {
      frequency: String,
      amount: String
    },
    sunlight: {
      exposure: String,
      duration: String
    },
    temperature: {
      ideal: String,
      min: String,
      max: String
    },
    soil: String,
    fertilizer: String,
    tips: [String]
  }
}, {
  timestamps: true
});

// Virtual for availability
plantSchema.virtual('available').get(function() {
  return this.stock > 0;
});

// Ensure virtuals are included when converting to JSON
plantSchema.set('toJSON', { virtuals: true });
plantSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Plant', plantSchema);
