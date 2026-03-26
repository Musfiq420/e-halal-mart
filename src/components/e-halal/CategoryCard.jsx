'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CategoryCard({ category, className = '' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { id, name, namebn, image, description, productCount } = category;

  return (
    <Link href={`/products?category=${id}`}>
      <div
        className={`
          group relative bg-white rounded-2xl overflow-hidden
          border border-gray-100 shadow-sm
          transition-all duration-300 ease-in-out
          hover:shadow-lg hover:shadow-primary/10
          hover:-translate-y-1
          ${className}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`
              object-cover transition-all duration-500
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              ${isHovered ? 'scale-110' : 'scale-100'}
            `}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-bold text-lg mb-0.5 group-hover:text-light-green transition-colors">
              {name}
            </h3>
            <p className="text-sm text-white/80 mb-1">{namebn}</p>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <span>{productCount} products</span>
              <span>•</span>
              <span className="text-light-green">Shop Now →</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Compact Version for Sidebar
export function CategoryCardCompact({ category, isActive = false, onClick, className = '' }) {
  const { id, name, namebn, productCount } = category;

  return (
    <button
      onClick={() => onClick?.(id)}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl
        transition-all duration-200 text-left
        ${isActive
          ? 'bg-primary text-white shadow-md'
          : 'bg-white hover:bg-light-green/30 text-gray-700'
        }
        ${className}
      `}
    >
      <div className={`
        w-10 h-10 rounded-lg flex items-center justify-center
        ${isActive ? 'bg-white/20' : 'bg-light-green/30'}
      `}>
        <CategoryIcon category={id} className={isActive ? 'text-white' : 'text-primary'} />
      </div>
      <div className="flex-1">
        <p className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>
          {name}
        </p>
        <p className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
          {productCount} items
        </p>
      </div>
      <svg
        className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

// Category Icons
function CategoryIcon({ category, className = '' }) {
  const icons = {
    meat: (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ),
    poultry: (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    groceries: (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    organic: (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    dairy: (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    spices: (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    ),
  };

  return icons[category] || icons.groceries;
}

// Loading Skeleton
export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}
