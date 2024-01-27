// src/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titleId : { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
