'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from './Button';
import { HalalBadge, OrganicBadge, NewBadge, SaleBadge } from './Badge';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function ProductCard({ product, className = '' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { success } = useToast();

  const {
    id,
    name,
    namebn,
    price,
    originalPrice,
    image: productImage,
    isHalal,
    isOrganic,
    isNew,
    inStock,
    unit,
    rating,
    reviewCount,
  } = product;

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    success(`${name} added to cart!`);
  };

  return (
    <Link href={`/products/${id}`}>
      <div
        className={`
          group relative bg-white rounded-2xl overflow-hidden
          border border-gray-100 shadow-sm
          transition-all duration-300 ease-in-out
          hover:shadow-lg hover:shadow-primary/10
          hover:-translate-y-1
          ${!inStock ? 'opacity-75' : ''}
          ${className}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          <Image
            src={productImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`
              object-cover transition-all duration-500
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              ${isHovered ? 'scale-110' : 'scale-100'}
            `}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Badges Container */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isHalal && <HalalBadge size="sm" />}
            {isOrganic && <OrganicBadge size="sm" />}
          </div>

          {/* Sale/New Badge */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            {isNew && <NewBadge size="sm" />}
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <div
            className={`
              absolute bottom-3 left-3 right-3 z-10
              transition-all duration-300
              ${isHovered && inStock ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="sm"
              fullWidth
              className="shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </Button>
          </div>

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
              <span className="text-gray-600 font-medium text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-200'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{namebn}</p>

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-primary">৳{price}</span>
            <span className="text-xs text-gray-400">/{unit}</span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">৳{originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Loading Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4">
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-1" />
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-5 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}
