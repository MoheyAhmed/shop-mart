'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/config/api';
import { Order } from '@/types/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import Image from 'next/image';

export default function OrderDetailsPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const params = useParams();
  const orderId = params.id as string;

  useEffect(() => {
    if (user?._id) {
      loadOrder();
    }
  }, [user, orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all user orders and find the specific one
      const response = await api.getUserOrders(user!._id);
      if (process.env.NODE_ENV === 'development') {
        console.log('Orders response:', response);
      }
      
      if (response.status === 'success') {
        const foundOrder = response.data.find((o: Order) => o._id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError('Order not found');
        }
      } else {
        setError('Failed to load order');
      }
    } catch (error) {
      console.error('Error loading order:', error);
      setError(error instanceof Error ? error.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusBadge = (order: Order) => {
    if (order.isDelivered) {
      return <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">Delivered</span>;
    } else if (order.isPaid) {
      return <span className="px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">Paid</span>;
    } else {
      return <span className="px-3 py-1 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-full">Pending</span>;
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    const isCard = method === 'card';
    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
        isCard 
          ? 'text-purple-800 bg-purple-100' 
          : 'text-gray-800 bg-gray-100'
      }`}>
        {isCard ? 'Card Payment' : 'Cash on Delivery'}
      </span>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading order details...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !order) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Details</h1>
              <p className="text-red-600 mb-8">{error || 'Order not found'}</p>
              <div className="space-x-4">
                <button
                  onClick={loadOrder}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <Link
                  href="/orders"
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Back to Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/orders"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block"
            >
              ← Back to Orders
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-2">Order #{order.id}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                  
                  <div className="space-y-4">
                    {order.cartItems.map((item) => (
                      <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0">
                          <Image
                            src={item.product.imageCover}
                            alt={item.product.title}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/80x80?text=Product+Image';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.product.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            by {item.product.brand.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Category: {item.product.category.name}
                          </p>
                          <div className="flex items-center mt-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(item.product.ratingsAverage)
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-2 text-sm text-gray-600">
                                ({item.product.ratingsQuantity})
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {formatPrice(item.price)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.count}
                          </p>
                          <p className="text-lg font-semibold text-gray-900 mt-2">
                            Total: {formatPrice(item.price * item.count)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  {/* Status */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(order)}
                      {getPaymentMethodBadge(order.paymentMethodType)}
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="mb-6 space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Order Date</h3>
                      <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
                    </div>
                    
                    {order.paidAt && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Paid Date</h3>
                        <p className="text-sm text-gray-900">{formatDate(order.paidAt)}</p>
                      </div>
                    )}
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h3>
                      <div className="text-sm text-gray-900">
                        <p>{order.shippingAddress.details}</p>
                        <p>{order.shippingAddress.city}</p>
                        <p>{order.shippingAddress.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">{formatPrice(order.totalOrderPrice - order.taxPrice - order.shippingPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">{formatPrice(order.taxPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">{formatPrice(order.shippingPrice)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-semibold text-gray-900">{formatPrice(order.totalOrderPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
