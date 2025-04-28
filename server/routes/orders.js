const express = require('express');
const Order = require('../models/Order');
const CartItem = require('../models/Cart');
const Product = require('../models/Product');
const { protect, admin } = require('../middlewares/auth');

const router = express.Router();

// POST /api/orders - Place order from cart
router.post('/', protect, async (req, res) => {
  try {
    // Get user's cart items
    const cartItems = await CartItem.find({ userId: req.user._id })
      .populate('productId');

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate stock and calculate total
    let total = 0;
    const orderItems = [];
    const stockUpdates = [];

    for (const item of cartItems) {
      const product = item.productId;
      
      // Check if product is still active and has enough stock
      if (!product.isActive) {
        return res.status(400).json({ 
          error: `Product ${product.title} is no longer available` 
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Not enough stock for ${product.title}` 
        });
      }

      // Prepare order item
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });

      // Calculate item total
      total += product.price * item.quantity;

      // Prepare stock update
      stockUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { stock: -item.quantity } }
        }
      });
    }

    // Validate shipping address
    const { street, city, state, zipCode } = req.body;
    if (!street || !city || !state || !zipCode) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      total,
      shippingAddress: { street, city, state, zipCode }
    });

    // Update product stock
    await Product.bulkWrite(stockUpdates);

    // Clear user's cart
    await CartItem.deleteMany({ userId: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

// GET /api/orders - Get user's orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId', 'title images')
      .sort('-createdAt');
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// GET /api/orders/:id - Get specific order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('items.productId', 'title images price');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order' });
  }
});

// GET /api/orders/admin/all - Get all orders (admin only)
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .populate('items.productId', 'title')
      .sort('-createdAt');
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// PUT /api/orders/:id - Update order status (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'shipped', 'delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email')
     .populate('items.productId', 'title');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error updating order' });
  }
});

module.exports = router;
