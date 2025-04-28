const express = require('express');
const CartItem = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// GET /api/cart - Get user's cart
router.get('/', protect, async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: req.user._id })
      .populate('productId', 'title price images stock'); // Get product details
    
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart' });
  }
});

// POST /api/cart - Add/update item to cart
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (!product.isActive) {
      return res.status(400).json({ error: 'Product is not available' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    // Update cart item if exists, create if doesn't
    const cartItem = await CartItem.findOneAndUpdate(
      { userId: req.user._id, productId },
      { quantity },
      { new: true, upsert: true }
    ).populate('productId', 'title price images stock');

    res.json(cartItem);
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ error: 'Item already in cart' });
    }
    res.status(500).json({ error: 'Error updating cart' });
  }
});

// DELETE /api/cart/:itemId - Remove item from cart
router.delete('/:itemId', protect, async (req, res) => {
  try {
    const cartItem = await CartItem.findOne({
      _id: req.params.itemId,
      userId: req.user._id
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.deleteOne();
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing item from cart' });
  }
});

// DELETE /api/cart - Clear cart
router.delete('/', protect, async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Error clearing cart' });
  }
});

module.exports = router;
