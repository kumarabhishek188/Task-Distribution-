const express = require('express');
const bcrypt = require('bcryptjs');
const Agent = require('../models/Agent');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/agents
 * Auth: Bearer token (admin)
 * Body: { name, email, phone, password }
 * Creates a new agent with hashed password. Returns agent without password.
 */
router.post('/', auth, async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const existing = await Agent.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Agent already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const agent = new Agent({ name, email, phone, password: hashed });
  await agent.save();
  const agentSafe = agent.toObject();
  delete agentSafe.password;
  res.status(201).json(agentSafe);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/agents
 * Auth: Bearer token (admin)
 * Returns list of agents (no passwords).
 */
router.get('/', auth, async (req, res) => {
  try {
    const agents = await Agent.find().select('-password');
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /api/agents/:id
 * Auth: Bearer token (admin)
 * Deletes agent and unassigns their tasks (agent field unset).
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findByIdAndDelete(id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    // Optionally, unset agent reference in tasks instead of deleting tasks
    try {
      const Task = require('../models/Task');
      await Task.updateMany({ agent: id }, { $unset: { agent: 1 } });
    } catch (_) {}
    return res.json({ message: 'Agent deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
