'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { HalalBadge, OrganicBadge } from './Badge';

export default function CartItem({ item, showControls = true, className = '' }) {
  const { updateQuantity, removeFromCart } = useCart();

  const {
    id,
    name,
    namebn,
    price,
    image,
    isHalal,
    isOrganic,
    quantity,
    unit,
  } = item;

  const itemTotal = price * quantity;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className={`flex gap-4 p-4 bg-white rounded-xl border border-gray-100 ${className}`}>
      {/* Product Image */}
      <Link href={`/products/${id}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-50">
          <Image
            src={image}
            alt={name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={`/products/${id}`}>
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>
          {showControls && (
            <button
              onClick={() => removeFromCart(id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove item"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500 mb-2">{namebn}</p>

        {/* Badges */}
        <div className="flex gap-1.5 mb-2">
          {isHalal && <HalalBadge size="sm" />}
          {isOrganic && <OrganicBadge size="sm" />}
        </div>

        {/* Price and Quantity */}
        <div className="flex items-end justify-between gap-2">
          {showControls ? (
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-100 rounded-l-lg transition-colors"
                disabled={quantity <= 1}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-8 text-center font-medium text-sm">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-100 rounded-r-lg transition-colors"
                disabled={quantity >= 99}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          ) : (
            <span className="text-sm text-gray-500">Qty: {quantity}</span>
          )}

          <div className="text-right">
            <p className="text-xs text-gray-400">৳{price}/{unit}</p>
            <p className="font-bold text-primary">৳{itemTotal}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton
export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 animate-pulse">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gray-200" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="flex justify-between">
          <div className="h-8 w-24 bg-gray-200 rounded-lg" />
          <div className="h-6 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
