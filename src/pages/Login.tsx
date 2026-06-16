import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.login(form);
      login(data.token, data.user);
      navigate('/catalog');
    } catch {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">📚 BiblioSys</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Senha"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Não tem conta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
