const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Import controllers
const {
  createPlant,
  updatePlant,
  deletePlant,
  generatePlantInfo
} = require('../controllers/plantController');

const {
  getAllOrders,
  updateOrderStatus,
  updateDeliveryStatus,
  getDashboardStats
} = require('../controllers/orderController');

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Plant management
router.post('/plants/generate-info', generatePlantInfo);
router.post('/plants', upload.array('images', 5), createPlant);
router.put('/plants/:id', upload.array('images', 5), updatePlant);
router.delete('/plants/:id', deletePlant);

// Order management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/delivery', updateDeliveryStatus);

module.exports = router;
