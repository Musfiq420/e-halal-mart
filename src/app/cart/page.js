'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, CartItem, HalalBadge, OrganicBadge } from '@/components/e-halal';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function CartPage() {
  const { items, itemCount, subtotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const { success } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const deliveryFee = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const handleApplyPromo = () => {
    setIsApplyingPromo(true);
    setTimeout(() => {
      setIsApplyingPromo(false);
      if (promoCode.toUpperCase() === 'HALAL15') {
        success('Promo code applied! 15% off on your first order');
      } else {
        setPromoCode('');
      }
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-6">Looks like you haven&apos;t added any products yet</p>
          <Button size="lg" asChild>
            <Link href="/products">
              Start Shopping
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 mt-1">{itemCount} items in your cart</p>
          </div>
          <Button variant="ghost" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cart Items List */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Items Summary */}
              <div className="space-y-3 pb-4 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-primary font-medium' : ''}>
                    {deliveryFee === 0 ? 'Free' : `৳${deliveryFee}`}
                  </span>
                </div>
              </div>

              {/* Free Delivery Progress */}
              {subtotal < 1000 && (
                <div className="py-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500">Add ৳{1000 - subtotal} more for free delivery</span>
                    <span className="text-primary font-medium">৳1000</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / 1000) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Promo Code */}
              <div className="py-4 border-b border-gray-100">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleApplyPromo}
                    loading={isApplyingPromo}
                    disabled={!promoCode}
                  >
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Try: HALAL15 for 15% off</p>
              </div>

              {/* Total */}
              <div className="py-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary">৳{total}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Including VAT</p>
              </div>

              {/* Checkout Button */}
              <Button size="lg" fullWidth className="mb-3">
                Proceed to Checkout
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>

              {/* Trust Badges */}
              <div className="flex justify-center gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <span className="text-lg">☪</span>
                  <p className="text-xs text-gray-500">Halal</p>
                </div>
                <div className="text-center">
                  <span className="text-lg">🔒</span>
                  <p className="text-xs text-gray-500">Secure</p>
                </div>
                <div className="text-center">
                  <span className="text-lg">🚚</span>
                  <p className="text-xs text-gray-500">Fast Delivery</p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center mb-2">We Accept</p>
                <div className="flex justify-center gap-2">
                  {['Visa', 'Mastercard', 'bKash', 'Nagad'].map((method) => (
                    <span
                      key={method}
                      className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Delivery Information</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-light-green/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Inside Dhaka</p>
                <p className="text-sm text-gray-500">Same day delivery for orders before 2 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-light-green/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Outside Dhaka</p>
                <p className="text-sm text-gray-500">2-3 business days via courier</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-light-green/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Cash on Delivery</p>
                <p className="text-sm text-gray-500">Pay when you receive your order</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
