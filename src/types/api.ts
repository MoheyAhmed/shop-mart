// Base API Response Types
export interface ApiResponse<T> {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
  };
  data: T[];
}

export interface ApiError {
  message: string;
  status: number;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export type CategoriesResponse = ApiResponse<Category>;

// Brand Types
export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export type BrandsResponse = ApiResponse<Brand>;
export type SubCategoriesResponse = ApiResponse<SubCategory>;

// Product Types
export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface ProductBrand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  sold: number | null;
  ratingsQuantity: number;
  ratingsAverage: number;
  category: ProductCategory;
  brand: ProductBrand;
  subcategory: Subcategory[];
  availableColors?: string[];
  createdAt: string;
  updatedAt: string;
  id: string;
}

export type ProductsResponse = ApiResponse<Product>;

// API Endpoints
export interface ApiEndpoints {
  AUTH: {
    SIGNUP: string;
    SIGNIN: string;
    FORGOT_PASSWORD: string;
    VERIFY_RESET_CODE: string;
    RESET_PASSWORD: string;
    VERIFY_TOKEN: string;
  };
  CATEGORIES: {
    ALL: string;
    BY_ID: (id: string) => string;
    SUBCATEGORIES: (categoryId: string) => string;
  };
  SUBCATEGORIES: {
    ALL: string;
    BY_ID: (id: string) => string;
  };
  BRANDS: {
    ALL: string;
    BY_ID: (id: string) => string;
  };
  PRODUCTS: {
    ALL: string;
    BY_ID: (id: string) => string;
  };
  WISHLIST: {
    ALL: string;
    ADD: string;
    REMOVE: (id: string) => string;
  };
  ADDRESSES: {
    ALL: string;
    ADD: string;
    BY_ID: (id: string) => string;
    REMOVE: (id: string) => string;
  };
  CART: {
    ALL: string;
    ADD: string;
    UPDATE: (id: string) => string;
    REMOVE: (id: string) => string;
    CLEAR: string;
  };
  ORDERS: {
    ALL: string;
    USER_ORDERS: (userId: string) => string;
    CREATE_CASH: (cartId: string) => string;
    CHECKOUT_SESSION: (cartId: string) => string;
  };
  USERS: {
    ALL: string;
    UPDATE_ME: string;
    CHANGE_PASSWORD: string;
  };
}

// API Request Options
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
}

// API Query Parameters
export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  brand?: string;
  price?: string;
  keyword?: string;
}

export interface CategoriesQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface BrandsQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
}
