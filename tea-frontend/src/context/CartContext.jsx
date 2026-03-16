import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0 });

  const fetchCart = useCallback(async () => {
    if (!user) return setCart({ items: [], subtotal: 0 });
    try {
      const { data } = await api.get('/cart');
      setCart(data.cart || { items: [], subtotal: 0 });
    } catch {
      setCart({ items: [], subtotal: 0 });
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, variantId, quantity = 1) => {
    try {
      const { data } = await api.post('/cart/add', { productId, variantId, quantity });
      setCart(data.cart);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add' };
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const { data } = await api.put('/cart/update', { itemId, quantity });
      setCart(data.cart);
    } catch {}
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      setCart(data.cart);
    } catch {}
  };

  const clearCart = () => setCart({ items: [], subtotal: 0 });

  const cartCount = cart.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
