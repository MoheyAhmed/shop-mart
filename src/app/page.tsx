'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { api, checkApiHealth } from '@/config/api';
import { Product } from '@/types/api';
import { useAuth } from '@/context/AuthContext';

export default function Home(): JSX.Element {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Fetch featured products from API
    const fetchProducts = async (): Promise<void> => {
      // First, set fallback data immediately to ensure UI is populated
      const fallbackProducts: Product[] = [
        {
          _id: "1",
          title: "iPhone 15 Pro",
          slug: "iphone-15-pro",
          description: "Latest iPhone with advanced features",
          quantity: 50,
          price: 999,
          imageCover: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
          images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop"],
          sold: 1000,
          ratingsQuantity: 150,
          ratingsAverage: 4.8,
          category: {
            _id: "electronics",
            name: "Electronics",
            slug: "electronics",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511121316.png"
          },
          brand: {
            _id: "apple",
            name: "Apple",
            slug: "apple",
            image: "https://ecommerce.routemisr.com/Route-Academy-brands/1678286391415.png"
          },
          subcategory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          id: "1"
        },
        {
          _id: "2",
          title: "MacBook Pro",
          slug: "macbook-pro",
          description: "Powerful laptop for professionals",
          quantity: 30,
          price: 1999,
          imageCover: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
          images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop"],
          sold: 500,
          ratingsQuantity: 200,
          ratingsAverage: 4.9,
          category: {
            _id: "electronics",
            name: "Electronics",
            slug: "electronics",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511121316.png"
          },
          brand: {
            _id: "apple",
            name: "Apple",
            slug: "apple",
            image: "https://ecommerce.routemisr.com/Route-Academy-brands/1678286391415.png"
          },
          subcategory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          id: "2"
        },
        {
          _id: "3",
          title: "Nike Air Max",
          slug: "nike-air-max",
          description: "Comfortable running shoes",
          quantity: 100,
          price: 120,
          imageCover: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
          images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop"],
          sold: 2000,
          ratingsQuantity: 300,
          ratingsAverage: 4.5,
          category: {
            _id: "fashion",
            name: "Fashion",
            slug: "fashion",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511865180.jpeg"
          },
          brand: {
            _id: "nike",
            name: "Nike",
            slug: "nike",
            image: "https://ecommerce.routemisr.com/Route-Academy-brands/1678285837630.png"
          },
          subcategory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          id: "3"
        },
        {
          _id: "4",
          title: "Samsung Galaxy S24",
          slug: "samsung-galaxy-s24",
          description: "Latest Android smartphone",
          quantity: 75,
          price: 899,
          imageCover: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
          images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop"],
          sold: 1500,
          ratingsQuantity: 250,
          ratingsAverage: 4.7,
          category: {
            _id: "electronics",
            name: "Electronics",
            slug: "electronics",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511121316.png"
          },
          brand: {
            _id: "samsung",
            name: "Samsung",
            slug: "samsung",
            image: "https://ecommerce.routemisr.com/Route-Academy-brands/1678286321029.png"
          },
          subcategory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          id: "4"
        },
        {
          _id: "5",
          title: "Sony WH-1000XM5",
          slug: "sony-wh-1000xm5",
          description: "Premium noise-canceling headphones",
          quantity: 40,
          price: 399,
          imageCover: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
          images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"],
          sold: 800,
          ratingsQuantity: 180,
          ratingsAverage: 4.6,
          category: {
            _id: "electronics",
            name: "Electronics",
            slug: "electronics",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511121316.png"
          },
          brand: {
            _id: "sony",
            name: "SONY",
            slug: "sony",
            image: "https://ecommerce.routemisr.com/Route-Academy-brands/1678286680638.png"
          },
          subcategory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          id: "5"
        },
        {
          _id: "6",
          title: "Adidas Ultraboost 22",
          slug: "adidas-ultraboost-22",
          description: "High-performance running shoes",
          quantity: 60,
          price: 180,
          imageCover: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
          images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop"],
          sold: 1200,
          ratingsQuantity: 220,
          ratingsAverage: 4.4,
          category: {
            _id: "fashion",
            name: "Fashion",
            slug: "fashion",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511865180.jpeg"
          },
          brand: {
            _id: "adidas",
            name: "Adidas",
            slug: "adidas",
            image: "https://ecommerce.routemisr.com/Route-Academy-brands/1678285881943.png"
          },
          subcategory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          id: "6"
        },
        {
          _id: "7",
          title: "Apple Watch Series 9",
          slug: "apple-watch-series-9",
          description: "Advanced smartwatch with health features",
          quantity: 35,
          price: 399,
          imageCover: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop",
          images: ["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop"],
          sold: 600,
          ratingsQuantity: 160,
          ratingsAverage: 4.7,
          category: {
            _id: "electronics",
            name: "Electronics",
            slug: "electronics",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511121316.png"
          },
          brand: {
            _id: "apple",
            name: "Apple",
            slug: "apple",
            image: "https://ecommerce.routemisr.com/Route-Academy-brands/1678286391415.png"
          },
          subcategory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          id: "7"
        },
        {
          _id: "8",
          title: "Dell XPS 13",
          slug: "dell-xps-13",
          description: "Ultra-thin laptop with stunning display",
          quantity: 25,
          price: 1299,
          imageCover: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop",
          images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop"],
          sold: 400,
          ratingsQuantity: 120,
          ratingsAverage: 4.5,
          category: {
            _id: "electronics",
            name: "Electronics",
            slug: "electronics",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511121316.png"
          },
          brand: {
            _id: "dell",
            name: "Dell",
            slug: "dell",
            image: "https://ecommerce.routemisr.com/Route-Academy-brands/1678286767914.png"
          },
          subcategory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          id: "8"
        }
      ];

      // Set fallback data first
      setFeaturedProducts(fallbackProducts);
      setLoading(false);

      // Try to fetch from API in the background
      try {
        // Check if API is available first
        const isApiHealthy = await checkApiHealth();
        if (isApiHealthy) {
          const response = await api.getProducts({ limit: 8 });
          if (response && response.data && response.data.length > 0) {
            console.log('Successfully loaded products from API');
            setFeaturedProducts(response.data);
          } else {
            console.warn('API returned no data, keeping fallback products');
          }
        } else {
          console.warn('API is not healthy, keeping fallback products');
        }
      } catch (error) {
        console.warn('API unavailable, using fallback products:', error);
        // Keep the fallback data that was already set
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to ShopMart
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover amazing products at unbeatable prices. Shop the latest trends in fashion, electronics, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </Link>
              <Link 
                href="/categories"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">30-day money back guarantee</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round the clock customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      {isAuthenticated && user && (
        <section className="bg-green-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Welcome back, {user.name}! 👋
              </h2>
              <p className="text-green-600">
                You're logged in and ready to shop. Add items to your cart and checkout when you're ready!
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Not Logged In Message */}
      {!isAuthenticated && (
        <section className="bg-yellow-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-yellow-800 mb-2">
                Ready to start shopping? 🛒
              </h2>
              <p className="text-yellow-600 mb-4">
                Please log in to add items to your cart and complete your purchase.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/login"
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register"
                  className="border-2 border-yellow-600 text-yellow-600 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 hover:text-white transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of the best products at amazing prices
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={`product-${product._id}-${index}`} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              href="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8">Subscribe to our newsletter for the latest deals and updates</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
