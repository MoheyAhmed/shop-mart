'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { api } from '@/config/api';
import { jwtDecode } from 'jwt-decode';

// JWT Payload Type
interface JWTPayload {
  id: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

// User Type
interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth State Type
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Auth Actions Type
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Auth Context Type
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyResetCode: (resetCode: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateProfile: (userData: any) => Promise<{ success: boolean; message?: string; error?: string }>;
  changePassword: (passwordData: any) => Promise<{ success: boolean; message?: string; error?: string }>;
}

// Login Credentials Type
interface LoginCredentials {
  email: string;
  password: string;
}

// Signup Data Type
interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null,
  });

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (process.env.NODE_ENV === 'development') {
      console.log('AuthContext useEffect - Token:', token);
      console.log('AuthContext useEffect - User:', user);
      console.log('AuthContext useEffect - Current state:', { isAuthenticated: state.isAuthenticated, loading: state.loading });
    }
    
    // If no token or user in localStorage, ensure we're logged out
    if (!token || !user) {
      if (process.env.NODE_ENV === 'development') {
        console.log('No token or user found in localStorage - logging out');
      }
      dispatch({ type: 'LOGOUT' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }
    
    // Verify token with server
    api.verifyToken()
      .then(() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Token verified successfully');
        }
        
        // Extract user ID from token and store it
        try {
          const tokenPayload = jwtDecode<JWTPayload>(token);
          const userId = tokenPayload.id;
          localStorage.setItem('userId', userId);
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Stored userId from token:', userId);
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.log('Failed to decode token:', error);
          }
        }
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token,
            user: JSON.parse(user),
          },
        });
      })
      .catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Token verification failed:', error);
        }
        // Token is invalid, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        dispatch({ type: 'LOGOUT' });
      })
      .finally(() => {
        dispatch({ type: 'SET_LOADING', payload: false });
      });
  }, []);

  // Additional check to ensure token consistency
  useEffect(() => {
    const checkTokenConsistency = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      // If we think we're authenticated but no token exists, log out
      if (state.isAuthenticated && (!token || !user)) {
        if (process.env.NODE_ENV === 'development') {
          console.log('AuthContext - Token inconsistency detected, logging out');
        }
        dispatch({ type: 'LOGOUT' });
      }
    };

    // Check immediately
    checkTokenConsistency();

    // Set up interval to check periodically
    const interval = setInterval(checkTokenConsistency, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await api.signin(credentials);
      if (process.env.NODE_ENV === 'development') {
        console.log('Login response:', response);
      }
      
      if (response.message === 'success') {
        const { token, user } = response;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Login successful, storing token and user...');
          console.log('Token to store:', token);
          console.log('User to store:', user);
        }
        
        // Extract user ID from token using jwtDecode
        const tokenPayload = jwtDecode<JWTPayload>(token);
        const userId = tokenPayload.id;
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', userId);
        
        // Verify storage immediately
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Token stored successfully:', storedToken);
          console.log('User stored successfully:', storedUser);
          console.log('Token matches:', token === storedToken);
        }
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { token, user },
        });
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData: SignupData): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await api.signup(userData);
      if (process.env.NODE_ENV === 'development') {
        console.log('Signup response:', response);
      }
      
      if (response.message === 'success') {
        const { token, user } = response;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Signup successful, storing token and user...');
          console.log('Token to store:', token);
          console.log('User to store:', user);
        }
        
        // Extract user ID from token using jwtDecode
        const tokenPayload = jwtDecode<JWTPayload>(token);
        const userId = tokenPayload.id;
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', userId);
        
        // Verify storage immediately
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Token stored successfully:', storedToken);
          console.log('User stored successfully:', storedUser);
          console.log('Token matches:', token === storedToken);
        }
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { token, user },
        });
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = (): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Logging out, clearing localStorage...');
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    
    // Verify cleanup
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Logout complete. Token cleared:', !token);
      console.log('User cleared:', !user);
    }
    
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await api.forgotPassword(email);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to send reset email' };
    }
  };

  const verifyResetCode = async (resetCode: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await api.verifyResetCode(resetCode);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Invalid reset code' };
    }
  };

  const resetPassword = async (email: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await api.resetPassword(email, newPassword);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to reset password' };
    }
  };

  const updateProfile = async (userData: any): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await api.updateProfile(userData);
      
      if (response.message === 'success') {
        // Update user in state and localStorage
        const updatedUser = { ...state.user, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token: state.token!,
            user: updatedUser,
          },
        });
        
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update profile' };
    }
  };

  const changePassword = async (passwordData: any): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await api.changePassword(passwordData);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to change password' };
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    clearError,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
