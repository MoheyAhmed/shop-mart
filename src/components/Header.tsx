'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Header(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-white/95 via-blue-50/95 to-indigo-50/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-blue-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
              ShopMart
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            <Link href="/" className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200">
              Products
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200">
              Categories
            </Link>
            <Link href="/brands" className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200">
              Brands
            </Link>
          </nav>


          {/* Cart and User Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                {getTotalItems()}
              </span>
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200 p-2 rounded-lg hover:bg-blue-50"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="hidden sm:block text-sm font-semibold">{user?.name}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 py-3 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">My Account</p>
                        <p className="text-xs text-gray-500 font-medium">{user?.email}</p>
                      </div>
                      
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-all duration-200 font-semibold"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      
                      <Link
                        href="/allorders"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-all duration-200 font-semibold"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Orders
                      </Link>
                      
                      <div className="border-t border-gray-100 mt-2">
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 font-semibold"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 text-sm font-semibold transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-b from-white/95 to-blue-50/95 backdrop-blur-md border-t border-blue-200/30">
                  <Link 
                    href="/" 
                    className="text-gray-700 hover:text-blue-600 block px-4 py-3 text-base font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/products" 
                    className="text-gray-700 hover:text-blue-600 block px-4 py-3 text-base font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link 
                    href="/categories" 
                    className="text-gray-700 hover:text-blue-600 block px-4 py-3 text-base font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Categories
                  </Link>
                  <Link 
                    href="/brands" 
                    className="text-gray-700 hover:text-blue-600 block px-4 py-3 text-base font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Brands
                  </Link>
              
                  {/* Mobile Auth Links */}
                  {isAuthenticated ? (
                    <>
                      <div className="border-t border-blue-200/50 pt-4 mt-4">
                        <div className="px-4 py-3 bg-blue-50/50 rounded-lg mb-3">
                          <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-600 font-medium">{user?.email}</p>
                        </div>
                        <Link 
                          href="/profile" 
                          className="text-gray-700 hover:text-blue-600 block px-4 py-3 text-base font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link 
                          href="/allorders" 
                          className="text-gray-700 hover:text-blue-600 block px-4 py-3 text-base font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Orders
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 block w-full text-left px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="border-t border-blue-200/50 pt-4 mt-4">
                        <Link 
                          href="/login" 
                          className="text-gray-700 hover:text-blue-600 block px-4 py-3 text-base font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Login
                        </Link>
                        <Link 
                          href="/register" 
                          className="text-gray-700 hover:text-blue-600 block px-4 py-3 text-base font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </div>
                    </>
                  )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
