'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { categories } from '@/data/products';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, toggleCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoryOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/products?filter=organic', label: 'Organic' },
    { href: '/products?filter=new', label: 'New Arrivals' },
  ];

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-white border-b border-gray-100'
          }
        `}
      >
        {/* Top Bar */}
        <div className="bg-dark-green text-white text-xs py-1.5">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">☪ 100% Halal Certified Products</span>
              <span className="sm:hidden">☪ Halal Certified</span>
              <span className="hidden md:inline">• Free Delivery on orders over ৳1000</span>
            </div>
            <div className="flex items-center gap-3">
              <a href="tel:+8801234567890" className="hover:text-light-green transition-colors">
                📞 +880 1234-567890
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight text-dark-green">
                  E-Halal Mart
                </h1>
                <p className="text-[10px] text-gray-500 -mt-0.5">ই-হালাল মার্ট</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium
                    transition-colors duration-200
                    ${pathname === link.href
                      ? 'text-primary bg-light-green/30'
                      : 'text-gray-600 hover:text-primary hover:bg-light-green/20'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className={`
                    flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium
                    transition-colors duration-200
                    ${pathname.includes('/products?category')
                      ? 'text-primary bg-light-green/30'
                      : 'text-gray-600 hover:text-primary hover:bg-light-green/20'
                    }
                  `}
                >
                  Categories
                  <svg
                    className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-slide-down">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.id}`}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-light-green/20 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                        <span className="text-xs text-gray-400 ml-auto">{category.productCount}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center gap-2">
              {/* Search - Desktop */}
              <div className="hidden md:block relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-48 lg:w-64 pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Cart Button */}
              <button
                onClick={() => toggleCart(true)}
                className="relative p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-light-green/20 transition-colors"
                aria-label="Open cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-light-green/20 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 animate-slide-down">
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Mobile Nav Links */}
            <nav className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    block px-4 py-2.5 rounded-lg text-sm font-medium
                    transition-colors duration-200
                    ${pathname === link.href
                      ? 'text-primary bg-light-green/30'
                      : 'text-gray-600 hover:text-primary hover:bg-light-green/20'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Categories */}
              <div className="pt-2 border-t border-gray-100 mt-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Categories
                </p>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:text-primary hover:bg-light-green/20 rounded-lg transition-colors"
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-400">{category.productCount}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-[104px]" /> {/* 40px top bar + 64px main nav */}
    </>
  );
}
