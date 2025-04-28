const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  images: [{ 
    type: String,
    required: true
  }],
  stock: { 
    type: Number, 
    required: true,
    min: 0,
    default: 0
  },
  // Additional fields for better product management
  category: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Add an index for better search performance
productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
