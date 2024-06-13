const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', 
    required: true
  },
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assurez-vous que la référence correspond au modèle User
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'closed'], // Enumérez tous les états possibles
    default: 'new'
  },
  responsibleAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assurez-vous que la référence correspond au modèle User
  }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
