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
      if (process.env.NODE_ENV === 'development') {
        console.log('Reducer - CLEAR_CART_SUCCESS case executed');
        console.log('Reducer - Previous state:', state);
      }
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

export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    loading: false,
    error: null,
  });

  // Helper function to transform cart items from API response
  const transformCartItems = (products: any[]) => {
    return products.map((cartItem: any) => ({
      _id: cartItem._id,
      count: Number(cartItem.count),
      price: Number(cartItem.price),
      title: cartItem.product.title,
      imageCover: cartItem.product.imageCover,
      brand: cartItem.product.brand,
      category: cartItem.product.category,
      quantity: Number(cartItem.product.quantity),
      ratingsAverage: Number(cartItem.product.ratingsAverage),
      priceAfterDiscount: Number(cartItem.product.priceAfterDiscount || cartItem.price),
      product: {
        _id: cartItem.product._id,
        title: cartItem.product.title,
        imageCover: cartItem.product.imageCover,
        brand: cartItem.product.brand,
        category: cartItem.product.category,
        quantity: Number(cartItem.product.quantity),
        ratingsAverage: Number(cartItem.product.ratingsAverage),
        priceAfterDiscount: Number(cartItem.product.priceAfterDiscount || cartItem.price),
        id: cartItem.product.id,
      },
    }));
  };

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
      if (process.env.NODE_ENV === 'development') {
        console.log('loadCart - Full response:', response);
        console.log('loadCart - Data:', (response as any).data);
        console.log('loadCart - Products:', (response as any).data?.products);
      }
      if ((response as any).status === 'success') {
        const cartItems = transformCartItems((response as any).data.products || []);
        if (process.env.NODE_ENV === 'development') {
          console.log('loadCart - Transformed items:', cartItems);
        }
        dispatch({ type: 'LOAD_CART_SUCCESS', payload: cartItems });
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
      
      if ((response as any).status === 'success') {
        // After adding to cart, reload the cart to get the updated data
        await loadCart();
        return { success: true };
      } else {
        throw new Error((response as any).message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
      
      // If authentication error, clear the cart state
      if (errorMessage.includes('Authentication required')) {
        dispatch({ type: 'LOAD_CART_SUCCESS', payload: [] });
      } else {
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const removeFromCart = async (cartItemId: string): Promise<{ success: boolean; error?: string }> => {
    // Find the cart item to get the product ID
    const cartItem = state.items.find(item => item._id === cartItemId);
    if (!cartItem) {
      return { success: false, error: 'Item not found in cart' };
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Use the product ID from the cart item
      const response = await api.removeFromCart(cartItem.product._id);
      if ((response as any).status === 'success') {
        // After removing from cart, reload the cart to get the updated data
        await loadCart();
        return { success: true };
      } else {
        throw new Error((response as any).message || 'Failed to remove from cart');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove from cart';
      
      // If authentication error, clear the cart state
      if (errorMessage.includes('Authentication required')) {
        dispatch({ type: 'LOAD_CART_SUCCESS', payload: [] });
      } else {
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number): Promise<{ success: boolean; error?: string }> => {
    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }
    
    // Find the cart item to get the product ID
    const cartItem = state.items.find(item => item._id === cartItemId);
    if (!cartItem) {
      return { success: false, error: 'Item not found in cart' };
    }
    
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Use the product ID from the cart item
      const response = await api.updateCartItem(cartItem.product._id, quantity);
      if ((response as any).status === 'success') {
        // After updating quantity, reload the cart to get the updated data
        await loadCart();
        return { success: true };
      } else {
        throw new Error((response as any).message || 'Failed to update quantity');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update quantity';
      
      // If authentication error, clear the cart state
      if (errorMessage.includes('Authentication required')) {
        dispatch({ type: 'LOAD_CART_SUCCESS', payload: [] });
      } else {
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async (): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.clearCart();
      if (process.env.NODE_ENV === 'development') {
        console.log('clearCart - API response:', response);
      }
      if ((response as any).status === 'success' || (response as any).message === 'success') {
        if (process.env.NODE_ENV === 'development') {
          console.log('clearCart - Clearing cart state directly');
          console.log('clearCart - Current state before dispatch:', state);
        }
        // Clear the cart state directly since the API call was successful
        dispatch({ type: 'CLEAR_CART_SUCCESS' });
        if (process.env.NODE_ENV === 'development') {
          console.log('clearCart - Dispatch completed');
        }
        return { success: true };
      } else {
        throw new Error((response as any).message || 'Failed to clear cart');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
      
      // If authentication error, clear the cart state
      if (errorMessage.includes('Authentication required')) {
        dispatch({ type: 'LOAD_CART_SUCCESS', payload: [] });
      } else {
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
      
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
