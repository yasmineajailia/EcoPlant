const Plant = require('../models/Plant');
const geminiService = require('../services/geminiService');

// @desc    Get all plants with filters
// @route   GET /api/plants
// @access  Public
exports.getAllPlants = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, size, search } = req.query;
    
    // Build query
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (size) {
      query.size = size;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const plants = await Plant.find(query).sort('-createdAt');
    
    res.json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single plant by ID
// @route   GET /api/plants/:id
// @access  Public
exports.getPlantById = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }
    
    res.json({
      success: true,
      data: plant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured plants
// @route   GET /api/plants/featured
// @access  Public
exports.getFeaturedPlants = async (req, res, next) => {
  try {
    const plants = await Plant.find({ featured: true }).limit(6);
    
    res.json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get promotional plants
// @route   GET /api/plants/promotions
// @access  Public
exports.getPromotionalPlants = async (req, res, next) => {
  try {
    const plants = await Plant.find({ onPromotion: true });
    
    res.json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create plant (Admin)
// @route   POST /api/admin/plants
// @access  Private/Admin
exports.createPlant = async (req, res, next) => {
  try {
    // Get image paths from uploaded files
    const images = req.files ? req.files.map(file => `/uploads/plants/${file.filename}`) : [];
    
    const plant = await Plant.create({
      ...req.body,
      images
    });
    
    res.status(201).json({
      success: true,
      data: plant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update plant (Admin)
// @route   PUT /api/admin/plants/:id
// @access  Private/Admin
exports.updatePlant = async (req, res, next) => {
  try {
    let plant = await Plant.findById(req.params.id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }
    
    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/plants/${file.filename}`);
      req.body.images = [...(plant.images || []), ...newImages];
    }
    
    plant = await Plant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: plant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete plant (Admin)
// @route   DELETE /api/admin/plants/:id
// @access  Private/Admin
exports.deletePlant = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }
    
    await plant.deleteOne();
    
    res.json({
      success: true,
      message: 'Plant deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate plant info with AI (description and price)
// @route   POST /api/admin/plants/generate-info
// @access  Private/Admin
exports.generatePlantInfo = async (req, res, next) => {
  try {
    const { plantName, category, size } = req.body;
    
    if (!plantName || !category || !size) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir le nom, la catégorie et la taille de la plante'
      });
    }
    
    const plantInfo = await geminiService.generatePlantInfo(plantName, category, size);
    
    res.json({
      success: true,
      data: plantInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la génération des informations'
    });
  }
};
