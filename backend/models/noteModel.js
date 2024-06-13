const mongoose = require('mongoose')

const noteSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', 
    required: true
  },
  content: {
    type: String,
    required: true
  }
  
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema)
