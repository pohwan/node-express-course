const mongoose = require('mongoose')

// Using Schema to structure all the documents
// Can set validation as in schema as well
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'must provide name'],
    trim: true,
    maxlength: [20, 'name cannot be more than 20 characters']
  },
  completed: {
    type: Boolean,
    default: false
  }
})

// Can use this schema in our controller
module.exports = mongoose.model('Task', TaskSchema)