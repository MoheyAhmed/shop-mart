'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/config/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import Image from 'next/image';

interface OrderItem {
  _id: string;
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    brand?: {
      _id: string;
      name: string;
      slug: string;
      image: string;
    };
    category?: {
      _id: string;
      name: string;
      slug: string;
      image: string;
    };
  };
}

interface Order {
  _id: string;
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: 'cash' | 'card';
  isPaid: boolean;
  isDelivered: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  cartItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
  id: number;
  paidAt?: string;
}

export default function AllOrdersPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (process.env.NODE_ENV === 'development') {
    console.log('AllOrdersPage - user:', user);
    console.log('AllOrdersPage - isAuthenticated:', isAuthenticated);
    console.log('AllOrdersPage - authLoading:', authLoading);
  }

      useEffect(() => {
        const fetchOrders = async () => {
          // Get user ID from localStorage (userId from JWT token)
          const userId = localStorage.getItem('userId');
          
          if (!userId) {
            if (process.env.NODE_ENV === 'development') {
              console.log('No userId found in localStorage, cannot fetch orders');
            }
            setLoading(false);
            return;
          }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Fetching orders for userId:', userId);
      }
      
      setLoading(true);
      try {
        const response = await api.getUserOrders(userId);
        if (process.env.NODE_ENV === 'development') {
          console.log('Orders response:', response);
        }
        
        // The API returns orders directly as an array, not wrapped in a status object
        if (Array.isArray(response)) {
          setOrders(response);
        } else if ((response as any).status === 'success') {
          setOrders((response as any).data || []);
        } else {
          setError('Failed to load orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?._id]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (isPaid: boolean, isDelivered: boolean) => {
    if (isDelivered) return 'bg-green-100 text-green-800';
    if (isPaid) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (isPaid: boolean, isDelivered: boolean) => {
    if (isDelivered) return 'Delivered';
    if (isPaid) return 'Paid';
    return 'Pending';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Orders</h1>
            <p className="text-red-600 mb-8">{error}</p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="mt-2 text-gray-600">Track and manage your orders</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-8">Start shopping to see your orders here</p>
              <Link
                href="/products"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.isPaid, order.isDelivered)}`}>
                          {getStatusText(order.isPaid, order.isDelivered)}
                        </span>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Payment Method</h4>
                        <p className="text-sm text-gray-600 capitalize">{order.paymentMethodType}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Total Amount</h4>
                        <p className="text-sm font-semibold text-gray-900">{formatPrice(order.totalOrderPrice)}</p>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Shipping Address</h4>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.details}, {order.shippingAddress.city}
                      </p>
                      <p className="text-sm text-gray-600">Phone: {order.shippingAddress.phone}</p>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Items ({order.cartItems.length})</h4>
                      <div className="space-y-3">
                        {order.cartItems.map((item) => (
                          <div key={item._id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                            <div className="flex-shrink-0">
                              <Image
                                src={item.product.imageCover}
                                alt={item.product.title}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNSAxNUg0NVY0NUgxNVYxNVoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE5IDIxSDQxVjM5SDE5VjIxWiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMjUgMjVIMzVWMzVIMjVWMjVaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
                                }}
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-medium text-gray-900 truncate">
                                {item.product.title}
                              </h5>
                              <p className="text-xs text-gray-500">
                                {item.product.brand?.name || 'Unknown Brand'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Quantity: {item.count}
                              </p>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                {formatPrice(item.price)}
                              </p>
                              <p className="text-xs text-gray-500">
                                each
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">Subtotal</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(order.totalOrderPrice - order.taxPrice - order.shippingPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">Tax</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(order.taxPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">Shipping</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(order.shippingPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-base font-semibold text-gray-900">Total</span>
                        <span className="text-base font-semibold text-gray-900">
                          {formatPrice(order.totalOrderPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
