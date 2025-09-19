'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { api } from '@/config/api';
import { Product, Brand } from '@/types/api';

export default function BrandPage(): JSX.Element {
  const params = useParams();
  const brandId = params.id as string;
  
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrandData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch brand details and products in parallel
        const [brandResponse, productsResponse] = await Promise.all([
          api.getBrand(brandId),
          api.getProducts({ brand: brandId, limit: 20 })
        ]);
        
        if (brandResponse && brandResponse.data) {
          setBrand(brandResponse.data);
        }
        
        if (productsResponse && productsResponse.data) {
          setProducts(productsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching brand data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch brand data');
      } finally {
        setLoading(false);
      }
    };

    if (brandId) {
      fetchBrandData();
    }
  }, [brandId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Brand</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            href="/brands"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Brands
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Brand Header */}
        {brand && (
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
              <img 
                src={brand.image} 
                alt={brand.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{brand.name}</h1>
            <p className="text-xl text-gray-600">
              {products.length > 0 ? `Found ${products.length} products` : 'No products found'}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏷️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h2>
            <p className="text-gray-600 mb-6">This brand doesn't have any products yet</p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
