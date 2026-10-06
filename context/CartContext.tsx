'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/lib/types';
import { StockLimitModal } from '@/components/StockLimitModal';
import { triggerFlyToCart } from '@/components/FlyingCartAnimation';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, sourceEl?: HTMLElement | null) => void;
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
  showStockLimitNotice: (product: Product, availableStock: number) => void;
}

const SHIPPING_FEE = 500;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [stockLimitNotice, setStockLimitNotice] = useState<{ product: Product; availableStock: number } | null>(null);

  const showStockLimitNotice = (product: Product, availableStock: number) => {
    setStockLimitNotice({ product, availableStock });
  };

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

  const addToCart = (product: Product, quantity: number = 1, sourceEl?: HTMLElement | null) => {
    if (!product.inStock) return;

    // Trigger visual floating animation & sound effect!
    triggerFlyToCart(product, sourceEl);

    const maxAllowed = product.warehouseStock > 0 ? product.warehouseStock : 99;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product._id === product._id);
      const currentQty = existingIndex > -1 ? prev[existingIndex].quantity : 0;
      const targetQty = currentQty + quantity;

      if (targetQty > maxAllowed) {
        setStockLimitNotice({ product, availableStock: maxAllowed });
      }

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(targetQty, maxAllowed)
        };
        return updated;
      }
      return [...prev, { product, quantity: Math.min(quantity, maxAllowed) }];
    });

    // Open cart drawer after animation lands
    setTimeout(() => {
      setIsCartOpen(true);
    }, 450);
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
          if (quantity > maxAllowed) {
            setStockLimitNotice({ product: item.product, availableStock: maxAllowed });
          }
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
        showStockLimitNotice,
      }}
    >
      {children}
      <StockLimitModal
        stockInfo={stockLimitNotice}
        onClose={() => setStockLimitNotice(null)}
      />
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
