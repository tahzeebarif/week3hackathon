import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Layout        from './components/layout/Layout';
import LandingPage   from './pages/LandingPage';
import CollectionsPage from './pages/CollectionsPage';
import ProductPage   from './pages/ProductPage';
import CartPage      from './pages/CartPage';
import DeliveryPage  from './pages/DeliveryPage';
import PaymentPage   from './pages/PaymentPage';
import SuccessPage   from './pages/SuccessPage';
import AccountPage   from './pages/AccountPage';
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts  from './pages/admin/AdminProducts';
import AdminOrders    from './pages/admin/AdminOrders';
import AdminUsers     from './pages/admin/AdminUsers';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route path="cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="delivery" element={<ProtectedRoute><DeliveryPage /></ProtectedRoute>} />
        <Route path="payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
        <Route path="account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />

        <Route path="admin" element={<ProtectedRoute roles={['admin','superadmin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/products" element={<ProtectedRoute roles={['admin','superadmin']}><AdminProducts /></ProtectedRoute>} />
        <Route path="admin/orders" element={<ProtectedRoute roles={['admin','superadmin']}><AdminOrders /></ProtectedRoute>} />
        <Route path="admin/users" element={<ProtectedRoute roles={['superadmin']}><AdminUsers /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
