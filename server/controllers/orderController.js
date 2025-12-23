const Order = require('../models/Order');
const Plant = require('../models/Plant');
const { sendOrderConfirmationEmail } = require('../services/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { orderItems, deliveryInfo, isGuestOrder } = req.body;
    
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }
    
    // Calculate total and verify stock
    let totalPrice = 0;
    const processedItems = [];
    
    for (const item of orderItems) {
      const plant = await Plant.findById(item.plant);
      
      if (!plant) {
        return res.status(404).json({
          success: false,
          message: `Plant not found: ${item.plant}`
        });
      }
      
      if (plant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${plant.name}`
        });
      }
      
      const price = plant.onPromotion && plant.promotionPrice 
        ? plant.promotionPrice 
        : plant.price;
      
      totalPrice += price * item.quantity;
      
      processedItems.push({
        plant: plant._id,
        name: plant.name,
        quantity: item.quantity,
        price: price,
        image: plant.images[0]
      });
      
      // Update stock
      plant.stock -= item.quantity;
      await plant.save();
    }
    
    // Create order
    const orderData = {
      orderItems: processedItems,
      deliveryInfo,
      totalPrice,
      paidAt: new Date(),
      isGuestOrder: isGuestOrder || false
    };
    
    // Add user if authenticated
    if (req.user) {
      orderData.user = req.user.id;
    }
    
    const order = await Order.create(orderData);
    
    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(
        deliveryInfo.email,
        deliveryInfo.firstName,
        order
      );
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Continue even if email fails
    }
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.plant', 'name')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Public (for guest orders) / Private (for user orders)
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('orderItems.plant', 'name');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Guest orders are accessible by anyone with the ID
    // User orders are only accessible by the owner or admin
    if (order.user && req.user) {
      if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this order'
        });
      }
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    order.orderStatus = orderStatus;
    
    if (orderStatus === 'delivered') {
      order.deliveredAt = new Date();
      order.deliveryStatus = 'delivered';
    }
    
    await order.save();
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery status (Admin)
// @route   PUT /api/admin/orders/:id/delivery
// @access  Private/Admin
exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const { deliveryStatus, deliveryDriver, deliveryNotes } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (deliveryDriver) order.deliveryDriver = deliveryDriver;
    if (deliveryNotes) order.deliveryNotes = deliveryNotes;
    
    await order.save();
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats (Admin)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    const recentOrders = await Order.find()
      .populate('user', 'firstName lastName')
      .sort('-createdAt')
      .limit(10);
    
    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};
