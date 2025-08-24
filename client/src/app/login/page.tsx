"use client";
import { useState } from 'react';
import { loginAdmin, API_URL } from '../../utils/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Call Next.js API route to set httpOnly cookie securely
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Login failed');
      // Also keep token in localStorage for client fetches if needed
      localStorage.setItem('token', data.token);
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next') || '/dashboard';
  window.location.href = next;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRegisterSuccess('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setRegisterSuccess('Admin registered! You can now log in.');
      setShowRegister(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-yellow-100 p-4">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">{showRegister ? 'Admin Signup' : 'Admin Login'}</h2>
        <form onSubmit={showRegister ? handleRegister : handleSubmit} className="flex flex-col gap-4">
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <Alert tone="error">{error}</Alert>}
          {registerSuccess && <Alert tone="success">{registerSuccess}</Alert>}
          <Button type="submit" loading={loading}>{showRegister ? 'Sign Up' : 'Login'}</Button>
          <Button type="button" variant="ghost" onClick={() => { setShowRegister(!showRegister); setError(''); setRegisterSuccess(''); }}>
            {showRegister ? 'Already have an account? Login' : 'First time? Sign Up'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
