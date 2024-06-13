// routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicket,
  createTicket,
  deleteTicket,
  updateTicketDescription,
  updateTicket,
  getTicketsByAgent,
  getTicketStats,
  getTicketStatsByAgentAndService, 
  getMonthlyTicketStats,
  getAgentRanking,
  getMonthlyTicketStatsByAgent,
  getServiceByAgent,
} = require('../controllers/ticketController');
const {
  getChatMessages,
  sendChatMessage,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Re-route into note router
const noteRouter = require('./noteRoutes');
router.use('/:ticketId/notes', noteRouter);

// Routes pour les tickets
router.route('/').get(protect, getTickets).post(protect, createTicket);
router.route('/agent').get(protect, getTicketsByAgent);
router.route('/update-description/:id').put(protect, updateTicketDescription);
router.route('/statss').get(protect, getTicketStats);
router.route('/stats/agent/:agentId/service/:serviceId').get(protect, getTicketStatsByAgentAndService);
router.get('/stats/service', protect, getServiceByAgent);
router.route('/:id').get(protect, getTicket).put(protect, updateTicket).delete(protect, deleteTicket);
router.get('/stats/monthly-closed', getMonthlyTicketStats);
router.route('/stats/monthlyStatsByAgent/:agentId/:serviceId').get(protect, getMonthlyTicketStatsByAgent);

router.route('/:ticketId/chats').get(protect, getChatMessages).post(protect, sendChatMessage);

module.exports = router;
