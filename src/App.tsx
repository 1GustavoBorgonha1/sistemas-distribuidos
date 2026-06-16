import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import MyLoans from './pages/MyLoans';
import Admin from './pages/Admin';

function PrivateRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/catalog" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/catalog" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/catalog" /> : <Register />} />
        <Route path="/catalog" element={<PrivateRoute><Catalog /></PrivateRoute>} />
        <Route path="/my-loans" element={<PrivateRoute><MyLoans /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute adminOnly><Admin /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={user ? '/catalog' : '/login'} replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
