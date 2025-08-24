const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  lead: { type: Object, required: true }, // Store lead info (e.g., phone, name)
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
});

module.exports = mongoose.model('Task', taskSchema);
