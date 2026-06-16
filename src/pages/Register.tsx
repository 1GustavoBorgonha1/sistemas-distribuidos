import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', adminSecret: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.register(form);
      login(data.token, data.user);
      navigate('/catalog');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Erro ao cadastrar';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Criar conta</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
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
          <input
            type="password"
            placeholder="Chave de admin (opcional)"
            value={form.adminSecret}
            onChange={(e) => setForm({ ...form, adminSecret: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Já tem conta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
