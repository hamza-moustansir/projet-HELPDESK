const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    responsibleAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Référence au modèle User pour les agents responsables
    },
    // Autres champs du service
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
