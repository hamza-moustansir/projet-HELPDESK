// controllers/chatController.js
const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');
const sendEmail = require('../utils/emailService');

// @desc    Get chat messages for a ticket
// @route   GET /api/tickets/:ticketId/chats
// @access  Private
const getChatMessages = asyncHandler(async (req, res) => {
  const messages = await Chat.find({ ticket: req.params.ticketId }).populate('sender', 'name');
  res.status(200).json(messages);
});

// @desc    Send a chat message
// @route   POST /api/tickets/:ticketId/chats
// @access  Private
const sendChatMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message content is required');
  }

  const ticket = await Ticket.findById(req.params.ticketId).populate('user responsibleAgent');

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  const chatMessage = await Chat.create({
    ticket: req.params.ticketId,
    sender: req.user.id,
    message,
  });

  // Determine the recipient of the email
  let recipient;
  if (req.user.id === ticket.user._id.toString()) {
    recipient = ticket.responsibleAgent;
  } else {
    recipient = ticket.user;
  }

  if (recipient) {
    const emailContent = `You have received a new message on ticket titled "${ticket.titre}":\n\n${message}`;
    sendEmail(recipient.email, 'New Chat Message', emailContent);
  }

  res.status(201).json(chatMessage);
});

module.exports = {
  getChatMessages,
  sendChatMessage,
};
