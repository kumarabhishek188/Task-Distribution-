"use client";
import { useEffect, useState } from 'react';
import { getAgents, addAgent, deleteAgent } from '../../utils/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    if (token) {
      getAgents(token)
        .then(setAgents)
        .catch(() => setError('Failed to fetch agents'));
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const agent: Agent = await addAgent(form, token!);
      setAgents((prev) => [...prev, agent]);
      setForm({ name: '', email: '', phone: '', password: '' });
      setSuccess('Agent added successfully');
    } catch {
      setError('Failed to add agent');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this agent? This will unassign their tasks.')) return;
    setError('');
    setSuccess('');
    try {
      await deleteAgent(id, token!);
      setAgents(prev => prev.filter(a => a._id !== id));
      setSuccess('Agent deleted');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete agent');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-yellow-100 p-8 flex flex-col items-center gap-8">
      <Card className="w-full max-w-lg p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-green-700 text-center">Admin Dashboard</h1>
        <form onSubmit={handleAddAgent} className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-2 text-green-600">Add Agent</h2>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
          <Input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
          <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
          {error && <Alert tone="error">{error}</Alert>}
          {success && <Alert tone="success">{success}</Alert>}
          <Button type="submit" variant="success">Add Agent</Button>
        </form>
      </Card>
      <Card className="w-full max-w-lg p-8">
        <h2 className="text-xl font-semibold mb-4 text-green-600 text-center">Agents List</h2>
        <ul className="divide-y divide-gray-200">
          {agents.length === 0 && (
            <li className="py-5 text-center text-gray-400">No agents yet.</li>
          )}
          {agents.map((agent) => (
            <li key={agent._id} className="py-3 flex items-center gap-4 justify-between">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-700 font-bold">
                {getInitials(agent.name)}
              </div>
              <div className="flex-1">
                <strong className="text-lg text-blue-600">{agent.name}</strong> <br />
                <span className="text-gray-600">{agent.email}</span> <br />
                <span className="text-gray-600">{agent.phone}</span>
              </div>
              <Button variant="danger" size="sm" onClick={() => handleDelete(agent._id)}>Delete</Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
