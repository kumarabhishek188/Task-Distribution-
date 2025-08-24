/** Base API URL for server requests from the browser */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Login admin using server API. Returns { token } on success.
 */
export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

/** Fetch all agents with bearer token */
export async function getAgents(token: string) {
  const res = await fetch(`${API_URL}/agents`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch agents');
  return res.json();
}

/** Create a new agent with bearer token */
export async function addAgent(agent: { name: string; email: string; phone: string; password: string }, token: string) {
  const res = await fetch(`${API_URL}/agents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(agent),
  });
  if (!res.ok) throw new Error('Failed to add agent');
  return res.json();
}

/** Delete an agent by id with bearer token */
export async function deleteAgent(id: string, token: string) {
  const res = await fetch(`${API_URL}/agents/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to delete agent');
  }
  return res.json();
}

/** Fetch all tasks with populated agent */
export async function getTasks(token: string) {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}
