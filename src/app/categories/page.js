'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '../../config/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getCategories();
        if (response.status === 'success') {
          // Create category objects with images and descriptions
          const categoryData = response.data.map((category, index) => ({
            name: category.name,
            slug: `${String(category.name).toLowerCase().replace(/\s+/g, '-')}-${index}`,
            image: getCategoryImage(category.name),
            description: getCategoryDescription(category.name),
            productCount: category.productCount || Math.floor(Math.random() * 100) + 20
          }));
          
          setCategories(categoryData);
        } else {
          throw new Error(response.message || 'Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback data
        setCategories([
          {
            name: 'Electronics',
            slug: 'electronics',
            image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
            description: 'Latest gadgets and electronic devices',
            productCount: 45
          },
          {
            name: 'Fashion',
            slug: 'fashion',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
            description: 'Trendy clothing and accessories',
            productCount: 78
          },
          {
            name: 'Home & Garden',
            slug: 'home-garden',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
            description: 'Everything for your home and garden',
            productCount: 32
          },
          {
            name: 'Sports',
            slug: 'sports',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
            description: 'Sports equipment and fitness gear',
            productCount: 56
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryImage = (category) => {
    const categoryStr = String(category).toLowerCase();
    const images = {
      'smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      'laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
      'fragrances': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop',
      'skincare': 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=300&fit=crop',
      'groceries': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
      'home-decoration': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      'furniture': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      'tops': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      'womens-dresses': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop',
      'womens-shoes': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop',
      'mens-shirts': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      'mens-shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
      'mens-watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      'womens-watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      'womens-bags': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
      'womens-jewellery': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
      'sunglasses': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=300&fit=crop',
      'automotive': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
      'motorcycle': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      'lighting': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    };
    return images[categoryStr] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
  };

  const getCategoryDescription = (category) => {
    const categoryStr = String(category).toLowerCase();
    const descriptions = {
      'smartphones': 'Latest smartphones and mobile devices',
      'laptops': 'High-performance laptops and computers',
      'fragrances': 'Premium fragrances and perfumes',
      'skincare': 'Beauty and skincare products',
      'groceries': 'Fresh groceries and daily essentials',
      'home-decoration': 'Beautiful home decoration items',
      'furniture': 'Quality furniture for every room',
      'tops': 'Stylish tops and shirts',
      'womens-dresses': 'Elegant women\'s dresses',
      'womens-shoes': 'Comfortable women\'s footwear',
      'mens-shirts': 'Classic men\'s shirts',
      'mens-shoes': 'Durable men\'s shoes',
      'mens-watches': 'Premium men\'s timepieces',
      'womens-watches': 'Elegant women\'s watches',
      'womens-bags': 'Fashionable women\'s bags',
      'womens-jewellery': 'Beautiful women\'s jewelry',
      'sunglasses': 'Stylish sunglasses and eyewear',
      'automotive': 'Car accessories and parts',
      'motorcycle': 'Motorcycle gear and accessories',
      'lighting': 'Modern lighting solutions'
    };
    return descriptions[categoryStr] || 'Quality products in this category';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h1>
          <p className="text-gray-600">Browse our wide selection of product categories</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={`${category.name}-${index}`}
              href={`/products?category=${category.name}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.productCount} products
                    </span>
                    <svg 
                      className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Can't find what you're looking for?</h2>
          <p className="text-gray-600 mb-6">Browse all our products or use our search feature</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Products
            </Link>
            <Link
              href="/"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
