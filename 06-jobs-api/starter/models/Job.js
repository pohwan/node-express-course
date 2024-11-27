const mongoose = require('mongoose')

const JobSchema = mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    maxlength: 50
  },
  position: {
    type: String,
    required: [true, 'Please provide position'],
    maxlength: 100
  },
  status: {
    type: String,
    enum: ['interview', 'declined', 'pending'],
    default: 'pending'
  },
  createdBy: { // each job created will be tied with user 
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  }, 
}, {
  timestamps: true // automatic create createdAt and updatedAt properties
})

module.exports = mongoose.model("Job", JobSchema);