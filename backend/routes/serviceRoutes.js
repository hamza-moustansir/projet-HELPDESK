const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceDetails,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');

// Routes pour les services
router.route('/').get( getServices).post(protect, createService);
router.route('/:id').get(getServiceDetails).put(protect, updateService).delete(protect, deleteService);

module.exports = router;
