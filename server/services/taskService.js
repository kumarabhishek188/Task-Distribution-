/**
 * Task distribution service: contains pure functions to persist tasks and
 * assign them to agents. Keeps routes thin and focused on transport logic.
 */
const Task = require('../models/Task');

/**
 * Distribute leads among agents round-robin and persist as Task documents.
 * @param {Array<object>} leads - Parsed rows from CSV/XLSX.
 * @param {Array<import('mongoose').Document & { _id: string, tasks: string[] }>} agents - Agent documents.
 * @returns {Promise<void>}
 */
async function distributeTasks(leads, agents) {
  const totalAgents = agents.length;
  for (let idx = 0; idx < leads.length; idx++) {
    const lead = leads[idx];
    const agentIdx = idx % totalAgents;
    const agent = agents[agentIdx];
    const task = new Task({ lead, agent: agent._id });
    await task.save();
    agent.tasks.push(task._id);
    await agent.save();
  }
}

module.exports = { distributeTasks };
