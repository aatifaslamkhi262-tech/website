'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/lib/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  subtotal: number;
  shippingCharges: number;
  grandTotal: number;
  totalItemsCount: number;
}

const SHIPPING_FEE = 350;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on client side mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('pgs_ecommerce_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to parse saved cart:', e);
    }
    setIsInitialized(true);
  }, []);

  // Sync cart with localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('pgs_ecommerce_cart', JSON.stringify(cart));
      } catch (e) {
        console.error('Failed to save cart:', e);
      }
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (!product.inStock) return;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product._id === product._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        // Cap quantity at warehouse stock if available
        const maxAllowed = product.warehouseStock > 0 ? product.warehouseStock : 99;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, maxAllowed)
        };
        return updated;
      }
      return [...prev, { product, quantity: Math.min(quantity, product.warehouseStock || 99) }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product._id === productId) {
          const maxAllowed = item.product.warehouseStock > 0 ? item.product.warehouseStock : 99;
          return { ...item, quantity: Math.min(quantity, maxAllowed) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  const shippingCharges = cart.length > 0 ? SHIPPING_FEE : 0;
  const grandTotal = subtotal + shippingCharges;
  const totalItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        subtotal,
        shippingCharges,
        grandTotal,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
