'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Add to wishlist functionality
    console.log('Added to wishlist:', product);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
            <Image
              src={product.imageCover || product.thumbnail || product.image || '/placeholder-product.jpg'}
              alt={product.title}
              width={300}
              height={300}
              className="w-full h-48 object-cover"
            />
          </div>
          
          {/* Sale Badge */}
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{product.discount}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleAddToWishlist}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
              isHovered ? 'bg-white shadow-md' : 'bg-white/80'
            }`}
          >
            <svg 
              className="w-5 h-5 text-gray-600 hover:text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </button>

          {/* Quick Add to Cart Button */}
          {isHovered && (
            <div className="absolute bottom-2 left-2 right-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ${product.price}
              </span>
              {product.priceAfterDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.priceAfterDiscount}
                </span>
              )}
            </div>

            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.ratingsAverage || 0) 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  ({product.ratingsAverage || 0})
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <span>Category: {String(product.category?.name || 'N/A')}</span>
            <span>Stock: {String(product.quantity || 'In Stock')}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
