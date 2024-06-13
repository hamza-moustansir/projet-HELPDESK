const asyncHandler = require('express-async-handler');
const Service = require('../models/serviceModel');

// @desc    Get list of available services
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find().populate('responsibleAgent', 'name email');
  res.json(services);
});

// @desc    Get details of a specific service
// @route   GET /api/services/:id
// @access  Public
const getServiceDetails = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate('responsibleAgents', 'name email');
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json(service);
});

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (admin)
const createService = asyncHandler(async (req, res) => {
  const { name, responsibleAgent } = req.body;

  // Ensure all required fields are provided
  if (!name || !responsibleAgent || !responsibleAgent.length) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if a service with the same name already exists
  const serviceExists = await Service.findOne({ name });
  if (serviceExists) {
    res.status(400);
    throw new Error('Service with this name already exists');
  }

  // Create a new service
  const service = new Service({
    name,
    responsibleAgent,
  });

  // Save the new service to the database
  const createdService = await service.save();
  res.status(201).json(createdService);
});

// @desc    Update service details
// @route   PUT /api/services/:id
// @access  Private (admin)
const updateService = asyncHandler(async (req, res) => {
  const { name, responsibleAgent } = req.body;
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  service.name = name || service.name;
  service.responsibleAgent = responsibleAgent || service.responsibleAgent;
  const updatedService = await service.save();
  res.json(updatedService);
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (admin)
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  await service.remove();
  res.json({ message: 'Service removed' });
});

module.exports = {
  getServices,
  getServiceDetails,
  createService,
  updateService,
  deleteService
};
