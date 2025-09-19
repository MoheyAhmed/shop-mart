import { 
  ApiResponse, 
  ApiError, 
  ApiEndpoints, 
  ApiRequestOptions,
  ProductsResponse,
  CategoriesResponse,
  BrandsResponse,
  ProductsQueryParams,
  CategoriesQueryParams,
  BrandsQueryParams
} from '@/types/api';

// API Configuration
export const API_BASE_URL = 'https://ecommerce.routemisr.com';

// API Endpoints
export const API_ENDPOINTS: ApiEndpoints = {
  // Authentication
  AUTH: {
    SIGNUP: `${API_BASE_URL}/api/v1/auth/signup`,
    SIGNIN: `${API_BASE_URL}/api/v1/auth/signin`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/v1/auth/forgotPasswords`,
    VERIFY_RESET_CODE: `${API_BASE_URL}/api/v1/auth/verifyResetCode`,
    RESET_PASSWORD: `${API_BASE_URL}/api/v1/auth/resetPassword`,
    VERIFY_TOKEN: `${API_BASE_URL}/api/v1/auth/verifyToken`,
  },
  
  // Categories
  CATEGORIES: {
    ALL: `${API_BASE_URL}/api/v1/categories`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/v1/categories/${id}`,
    SUBCATEGORIES: (categoryId: string) => `${API_BASE_URL}/api/v1/categories/${categoryId}/subcategories`,
  },
  
  // SubCategories
  SUBCATEGORIES: {
    ALL: `${API_BASE_URL}/api/v1/subcategories`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/v1/subcategories/${id}`,
  },
  
  // Brands
  BRANDS: {
    ALL: `${API_BASE_URL}/api/v1/brands`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/v1/brands/${id}`,
  },
  
  // Products
  PRODUCTS: {
    ALL: `${API_BASE_URL}/api/v1/products`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/v1/products/${id}`,
  },
  
  // Wishlist
  WISHLIST: {
    ALL: `${API_BASE_URL}/api/v1/wishlist`,
    ADD: `${API_BASE_URL}/api/v1/wishlist`,
    REMOVE: (id: string) => `${API_BASE_URL}/api/v1/wishlist/${id}`,
  },
  
  // Addresses
  ADDRESSES: {
    ALL: `${API_BASE_URL}/api/v1/addresses`,
    ADD: `${API_BASE_URL}/api/v1/addresses`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/v1/addresses/${id}`,
    REMOVE: (id: string) => `${API_BASE_URL}/api/v1/addresses/${id}`,
  },
  
  // Cart
  CART: {
    ALL: `${API_BASE_URL}/api/v1/cart`,
    ADD: `${API_BASE_URL}/api/v1/cart`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/v1/cart/${id}`,
    REMOVE: (id: string) => `${API_BASE_URL}/api/v1/cart/${id}`,
    CLEAR: `${API_BASE_URL}/api/v1/cart`,
  },
  
  // Orders
  ORDERS: {
    ALL: `${API_BASE_URL}/api/v1/orders/`,
    USER_ORDERS: (userId: string) => `${API_BASE_URL}/api/v1/orders/user/${userId}`,
    CREATE_CASH: (cartId: string) => `${API_BASE_URL}/api/v1/orders/${cartId}`,
    CHECKOUT_SESSION: (cartId: string) => `${API_BASE_URL}/api/v1/orders/checkout-session/${cartId}`,
  },
  
  // Users
  USERS: {
    ALL: `${API_BASE_URL}/api/v1/users`,
    UPDATE_ME: `${API_BASE_URL}/api/v1/users/updateMe/`,
    CHANGE_PASSWORD: `${API_BASE_URL}/api/v1/users/changeMyPassword`,
  },
};

// API Helper Functions
export const apiRequest = async <T>(
  url: string, 
  options: ApiRequestOptions = {},
  requireAuth: boolean = true
): Promise<T> => {
  const token = localStorage.getItem('token');
  
  // Check if token is expired
  if (requireAuth && token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Token expired, clearing localStorage');
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Token expired. Please log in again.');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Invalid token format, clearing localStorage');
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Invalid token. Please log in again.');
    }
  }
  
  const defaultOptions: ApiRequestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(requireAuth && token && { token: token }),
    },
  };

  const config: ApiRequestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Making API request to:', url);
      console.log('Request config:', config);
      console.log('Token from localStorage:', localStorage.getItem('token'));
      console.log('Headers being sent:', config.headers);
      console.log('Token header:', config.headers?.token);
    }
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Response not ok:', response.status, response.statusText);
        console.log('Response headers:', response.headers);
      }
      
      // Handle specific error cases
      if (response.status === 401) {
        if (process.env.NODE_ENV === 'development') {
          console.log('401 Unauthorized - clearing token and user');
        }
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Authentication required. Please log in.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (process.env.NODE_ENV === 'development') {
      console.log('API response:', data);
    }
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API Health Check
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await apiRequest(`${API_BASE_URL}/api/v1/categories`, {}, false);
    return true;
  } catch (error) {
    return false;
  }
};

// Specific API functions
export const api = {
  // Products
  getProducts: (params: ProductsQueryParams = {}): Promise<ProductsResponse> => {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    const url = queryString ? `${API_ENDPOINTS.PRODUCTS.ALL}?${queryString}` : API_ENDPOINTS.PRODUCTS.ALL;
    return apiRequest<ProductsResponse>(url);
  },
  
  getProduct: (id: string) => apiRequest(API_ENDPOINTS.PRODUCTS.BY_ID(id)),
  
  // Categories
  getCategories: (params: CategoriesQueryParams = {}): Promise<CategoriesResponse> => {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    const url = queryString ? `${API_ENDPOINTS.CATEGORIES.ALL}?${queryString}` : API_ENDPOINTS.CATEGORIES.ALL;
    return apiRequest<CategoriesResponse>(url);
  },
  
  getCategory: (id: string) => apiRequest(API_ENDPOINTS.CATEGORIES.BY_ID(id)),
  
  // Brands
  getBrands: (params: BrandsQueryParams = {}): Promise<BrandsResponse> => {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    const url = queryString ? `${API_ENDPOINTS.BRANDS.ALL}?${queryString}` : API_ENDPOINTS.BRANDS.ALL;
    return apiRequest<BrandsResponse>(url);
  },
  
  getBrand: (id: string) => apiRequest(API_ENDPOINTS.BRANDS.BY_ID(id)),
  
  // SubCategories
  getSubCategories: (params: any = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_ENDPOINTS.SUBCATEGORIES.ALL}?${queryString}` : API_ENDPOINTS.SUBCATEGORIES.ALL;
    return apiRequest(url);
  },
  
  getSubCategory: (id: string) => apiRequest(API_ENDPOINTS.SUBCATEGORIES.BY_ID(id)),
  
  getCategorySubCategories: (categoryId: string) => apiRequest(API_ENDPOINTS.CATEGORIES.SUBCATEGORIES(categoryId)),
  
  // Cart
  getCart: () => apiRequest(API_ENDPOINTS.CART.ALL, {}, true),
  
  addToCart: (productId: string) => apiRequest(API_ENDPOINTS.CART.ADD, {
    method: 'POST',
    body: JSON.stringify({ productId }),
  }, true),
  
  updateCartItem: (id: string, count: number) => apiRequest(API_ENDPOINTS.CART.UPDATE(id), {
    method: 'PUT',
    body: JSON.stringify({ count: String(count) }),
  }, true),
  
  removeFromCart: (id: string) => apiRequest(API_ENDPOINTS.CART.REMOVE(id), {
    method: 'DELETE',
  }, true),
  
  clearCart: () => apiRequest(API_ENDPOINTS.CART.CLEAR, {
    method: 'DELETE',
  }, true),
  
  // Wishlist
  getWishlist: () => apiRequest(API_ENDPOINTS.WISHLIST.ALL, {}, true),
  
  addToWishlist: (productId: string) => apiRequest(API_ENDPOINTS.WISHLIST.ADD, {
    method: 'POST',
    body: JSON.stringify({ productId }),
  }, true),
  
  removeFromWishlist: (id: string) => apiRequest(API_ENDPOINTS.WISHLIST.REMOVE(id), {
    method: 'DELETE',
  }, true),
  
  // Authentication
  signup: (userData: any) => apiRequest(API_ENDPOINTS.AUTH.SIGNUP, {
    method: 'POST',
    body: JSON.stringify(userData),
  }, false),
  
  signin: (credentials: any) => apiRequest(API_ENDPOINTS.AUTH.SIGNIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  }, false),
  
  forgotPassword: (email: string) => apiRequest(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
    method: 'POST',
    body: JSON.stringify({ email }),
  }, false),
  
  verifyResetCode: (resetCode: string) => apiRequest(API_ENDPOINTS.AUTH.VERIFY_RESET_CODE, {
    method: 'POST',
    body: JSON.stringify({ resetCode }),
  }, false),
  
  resetPassword: (email: string, newPassword: string) => apiRequest(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
    method: 'PUT',
    body: JSON.stringify({ email, newPassword }),
  }, false),
  
  verifyToken: () => apiRequest(API_ENDPOINTS.AUTH.VERIFY_TOKEN, {}, true),
  
  // User Management
  updateProfile: (userData: any) => apiRequest(API_ENDPOINTS.USERS.UPDATE_ME, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }, true),
  
  changePassword: (passwordData: any) => apiRequest(API_ENDPOINTS.USERS.CHANGE_PASSWORD, {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  }, true),
  
  // Orders
  getAllOrders: () => apiRequest(API_ENDPOINTS.ORDERS.ALL, {}, true),
  
  getUserOrders: (userId: string) => apiRequest(API_ENDPOINTS.ORDERS.USER_ORDERS(userId), {}, true),
  
  createCashOrder: (cartId: string, shippingAddress: any) => apiRequest(API_ENDPOINTS.ORDERS.CREATE_CASH(cartId), {
    method: 'POST',
    body: JSON.stringify({ shippingAddress }),
  }, true),
  
  createCheckoutSession: (cartId: string, shippingAddress: any, url: string = 'http://localhost:3000') => {
    const queryParams = new URLSearchParams({ url }).toString();
    const endpoint = `${API_ENDPOINTS.ORDERS.CHECKOUT_SESSION(cartId)}?${queryParams}`;
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({ shippingAddress }),
    }, true);
  },
};
