'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../config/api';

const CartContext = createContext();

const cartReducer = (state, action) => {
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

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    loading: false,
    error: null,
  });

  // Load cart from API on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.getCart();
      if (response.status === 'success') {
        dispatch({ type: 'LOAD_CART_SUCCESS', payload: response.data.products });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addToCart = async (product) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.addToCart(product.id);
      if (response.status === 'success') {
        dispatch({ type: 'ADD_TO_CART_SUCCESS', payload: response.data.products });
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to add to cart');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (productId) => {
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
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = async (productId, quantity) => {
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
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const clearCart = async () => {
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
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.count, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.count), 0);
  };

  const value = {
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
