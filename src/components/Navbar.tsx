import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow">
      <Link to="/" className="text-xl font-bold tracking-tight">
        📚 BiblioSys
      </Link>
      {user && (
        <div className="flex items-center gap-4 text-sm">
          <Link to="/catalog" className="hover:underline">Catálogo</Link>
          <Link to="/my-loans" className="hover:underline">Meus Empréstimos</Link>
          {isAdmin && <Link to="/admin" className="hover:underline font-semibold">Admin</Link>}
          <span className="opacity-75">{user.name}</span>
          <button onClick={handleLogout} className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-blue-50">
            Sair
          </button>
        </div>
      )}
    </nav>
  );
}
