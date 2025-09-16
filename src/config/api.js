// API Configuration
export const API_BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    SIGNIN: `${API_BASE_URL}/auth/signin`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgotPasswords`,
    VERIFY_RESET_CODE: `${API_BASE_URL}/auth/verifyResetCode`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/resetPassword`,
    VERIFY_TOKEN: `${API_BASE_URL}/auth/verifyToken`,
  },
  
  // Categories
  CATEGORIES: {
    ALL: `${API_BASE_URL}/categories`,
    BY_ID: (id) => `${API_BASE_URL}/categories/${id}`,
    SUBCATEGORIES: (categoryId) => `${API_BASE_URL}/categories/${categoryId}/subcategories`,
  },
  
  // SubCategories
  SUBCATEGORIES: {
    ALL: `${API_BASE_URL}/subcategories`,
    BY_ID: (id) => `${API_BASE_URL}/subcategories/${id}`,
  },
  
  // Brands
  BRANDS: {
    ALL: `${API_BASE_URL}/brands`,
    BY_ID: (id) => `${API_BASE_URL}/brands/${id}`,
  },
  
  // Products
  PRODUCTS: {
    ALL: `${API_BASE_URL}/products`,
    BY_ID: (id) => `${API_BASE_URL}/products/${id}`,
  },
  
  // Wishlist
  WISHLIST: {
    ALL: `${API_BASE_URL}/wishlist`,
    ADD: `${API_BASE_URL}/wishlist`,
    REMOVE: (id) => `${API_BASE_URL}/wishlist/${id}`,
  },
  
  // Addresses
  ADDRESSES: {
    ALL: `${API_BASE_URL}/addresses`,
    ADD: `${API_BASE_URL}/addresses`,
    BY_ID: (id) => `${API_BASE_URL}/addresses/${id}`,
    REMOVE: (id) => `${API_BASE_URL}/addresses/${id}`,
  },
  
  // Cart
  CART: {
    ALL: `${API_BASE_URL}/cart`,
    ADD: `${API_BASE_URL}/cart`,
    UPDATE: (id) => `${API_BASE_URL}/cart/${id}`,
    REMOVE: (id) => `${API_BASE_URL}/cart/${id}`,
    CLEAR: `${API_BASE_URL}/cart`,
  },
  
  // Orders
  ORDERS: {
    ALL: `${API_BASE_URL}/orders/`,
    USER_ORDERS: (userId) => `${API_BASE_URL}/orders/user/${userId}`,
    CREATE_CASH: (cartId) => `${API_BASE_URL}/orders/${cartId}`,
    CHECKOUT_SESSION: (cartId) => `${API_BASE_URL}/orders/checkout-session/${cartId}`,
  },
  
  // Users
  USERS: {
    ALL: `${API_BASE_URL}/users`,
    UPDATE_ME: `${API_BASE_URL}/users/updateMe/`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/changeMyPassword`,
  },
};

// API Helper Functions
export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Specific API functions
export const api = {
  // Products
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_ENDPOINTS.PRODUCTS.ALL}?${queryString}` : API_ENDPOINTS.PRODUCTS.ALL;
    return apiRequest(url);
  },
  
  getProduct: (id) => apiRequest(API_ENDPOINTS.PRODUCTS.BY_ID(id)),
  
  // Categories
  getCategories: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_ENDPOINTS.CATEGORIES.ALL}?${queryString}` : API_ENDPOINTS.CATEGORIES.ALL;
    return apiRequest(url);
  },
  
  getCategory: (id) => apiRequest(API_ENDPOINTS.CATEGORIES.BY_ID(id)),
  
  // Brands
  getBrands: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_ENDPOINTS.BRANDS.ALL}?${queryString}` : API_ENDPOINTS.BRANDS.ALL;
    return apiRequest(url);
  },
  
  // Cart
  getCart: () => apiRequest(API_ENDPOINTS.CART.ALL),
  
  addToCart: (productId) => apiRequest(API_ENDPOINTS.CART.ADD, {
    method: 'POST',
    body: JSON.stringify({ productId }),
  }),
  
  updateCartItem: (id, count) => apiRequest(API_ENDPOINTS.CART.UPDATE(id), {
    method: 'PUT',
    body: JSON.stringify({ count }),
  }),
  
  removeFromCart: (id) => apiRequest(API_ENDPOINTS.CART.REMOVE(id), {
    method: 'DELETE',
  }),
  
  clearCart: () => apiRequest(API_ENDPOINTS.CART.CLEAR, {
    method: 'DELETE',
  }),
  
  // Wishlist
  getWishlist: () => apiRequest(API_ENDPOINTS.WISHLIST.ALL),
  
  addToWishlist: (productId) => apiRequest(API_ENDPOINTS.WISHLIST.ADD, {
    method: 'POST',
    body: JSON.stringify({ productId }),
  }),
  
  removeFromWishlist: (id) => apiRequest(API_ENDPOINTS.WISHLIST.REMOVE(id), {
    method: 'DELETE',
  }),
  
  // Authentication
  signup: (userData) => apiRequest(API_ENDPOINTS.AUTH.SIGNUP, {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  signin: (credentials) => apiRequest(API_ENDPOINTS.AUTH.SIGNIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  forgotPassword: (email) => apiRequest(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  
  verifyResetCode: (resetCode) => apiRequest(API_ENDPOINTS.AUTH.VERIFY_RESET_CODE, {
    method: 'POST',
    body: JSON.stringify({ resetCode }),
  }),
  
  resetPassword: (email, newPassword) => apiRequest(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
    method: 'PUT',
    body: JSON.stringify({ email, newPassword }),
  }),
  
  verifyToken: () => apiRequest(API_ENDPOINTS.AUTH.VERIFY_TOKEN),
};
