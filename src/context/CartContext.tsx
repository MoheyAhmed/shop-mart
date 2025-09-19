'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { api } from '@/config/api';
import { Product } from '@/types/api';

// Cart Item Type
interface CartItem extends Product {
  count: number;
  price: number;
  priceAfterDiscount?: number;
}

// Cart State Type
interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

// Cart Actions Type
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_CART_SUCCESS'; payload: CartItem[] }
  | { type: 'ADD_TO_CART_SUCCESS'; payload: CartItem[] }
  | { type: 'UPDATE_QUANTITY_SUCCESS'; payload: CartItem[] }
  | { type: 'REMOVE_FROM_CART_SUCCESS'; payload: CartItem[] }
  | { type: 'CLEAR_CART_SUCCESS' };

// Cart Context Type
interface CartContextType extends CartState {
  addToCart: (product: Product) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (productId: string) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (productId: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => Promise<{ success: boolean; error?: string }>;
  loadCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'LOAD_CART_SUCCESS':
      return {
        ...state,
        items: action.payload || [],
        loading: false,
        error: null,
      };

    case 'ADD_TO_CART_SUCCESS':
      return {
        ...state,
        items: action.payload || state.items,
        loading: false,
        error: null,
      };

    case 'UPDATE_QUANTITY_SUCCESS':
      return {
        ...state,
        items: action.payload || state.items,
        loading: false,
        error: null,
      };

    case 'REMOVE_FROM_CART_SUCCESS':
      return {
        ...state,
        items: action.payload || state.items,
        loading: false,
        error: null,
      };

    case 'CLEAR_CART_SUCCESS':
      return {
        ...state,
        items: [],
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    loading: false,
    error: null,
  });

  // Load cart from API on mount only if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadCart();
    }
  }, []);

  const loadCart = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.getCart();
      if (response.status === 'success') {
        dispatch({ type: 'LOAD_CART_SUCCESS', payload: response.data.products });
      }
    } catch (error) {
      // Don't show error for authentication issues - just clear the cart
      if (error instanceof Error && error.message.includes('Authentication required')) {
        dispatch({ type: 'LOAD_CART_SUCCESS', payload: [] });
      } else {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load cart' });
      }
    }
  };

  const addToCart = async (product: Product): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.addToCart(product._id);
      if (response.status === 'success') {
        dispatch({ type: 'ADD_TO_CART_SUCCESS', payload: response.data.products });
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to add to cart');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const removeFromCart = async (productId: string): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.removeFromCart(productId);
      if (response.status === 'success') {
        dispatch({ type: 'REMOVE_FROM_CART_SUCCESS', payload: response.data.products });
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to remove from cart');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove from cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<{ success: boolean; error?: string }> => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.updateCartItem(productId, quantity);
      if (response.status === 'success') {
        dispatch({ type: 'UPDATE_QUANTITY_SUCCESS', payload: response.data.products });
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to update quantity');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update quantity';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async (): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.clearCart();
      if (response.status === 'success') {
        dispatch({ type: 'CLEAR_CART_SUCCESS' });
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to clear cart');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const getTotalItems = (): number => {
    return state.items.reduce((total, item) => total + item.count, 0);
  };

  const getTotalPrice = (): number => {
    return state.items.reduce((total, item) => {
      const price = item.priceAfterDiscount || item.price;
      return total + (price * item.count);
    }, 0);
  };

  const value: CartContextType = {
    items: state.items,
    loading: state.loading,
    error: state.error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
