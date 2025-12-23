const express = require('express');
const router = express.Router();
const {
  getAllPlants,
  getPlantById,
  getFeaturedPlants,
  getPromotionalPlants
} = require('../controllers/plantController');

// Public routes
router.get('/', getAllPlants);
router.get('/featured', getFeaturedPlants);
router.get('/promotions', getPromotionalPlants);
router.get('/:id', getPlantById);

module.exports = router;
