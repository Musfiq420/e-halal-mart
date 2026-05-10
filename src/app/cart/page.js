'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button, CartItem, HalalBadge, OrganicBadge } from '@/components/e-halal';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import {
  bangladeshCities,
  getDeliveryCharge,
  INSIDE_DHAKA_DELIVERY,
  OUTSIDE_DHAKA_DELIVERY,
} from '@/data/area';

const initialCheckoutForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: 'Dhaka',
  area: '',
  paymentMethod: 'Cash on Delivery',
  notes: '',
};

export default function CartPage() {
  const { items, itemCount, subtotal, clearCart } = useCart();
  const { success, error } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState(initialCheckoutForm);

  const selectedCity = bangladeshCities.find((city) => city.name === checkoutForm.city);
  const deliveryFee = subtotal >= 1000 ? 0 : getDeliveryCharge(checkoutForm.city);
  const deliveryLabel = selectedCity?.insideDhaka ? 'Inside Dhaka' : 'Outside Dhaka';
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

  const handleCheckoutChange = (event) => {
    const { name, value } = event.target;
    setCheckoutForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async (event) => {
    event.preventDefault();
    setIsSubmittingOrder(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: checkoutForm,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            namebn: item.namebn,
            price: item.price,
            quantity: item.quantity,
            unit: item.unit,
          })),
          summary: {
            itemCount,
            subtotal,
            deliveryFee,
            total,
            promoCode: promoCode.trim() || null,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Could not place the order');
      }

      success('Order placed! We will contact you shortly.');
      clearCart();
      setPromoCode('');
      setCheckoutForm(initialCheckoutForm);
      setIsCheckoutOpen(false);
      setIsOrderSubmitted(true);
    } catch (err) {
      error(err.message || 'Could not place the order');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  if (isOrderSubmitted) {
    return (
      <div className="min-h-[70vh] bg-gray-50 px-4 py-12">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-light-green/40">
            <svg className="h-10 w-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mb-3 text-2xl font-bold text-gray-900">Your Order Has Been Submitted</h1>
          <p className="mb-6 text-gray-500">
            Your order is submitted for our team to review. Our team will contact you later.
          </p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

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
                <p className="text-xs text-gray-400">
                  Based on {checkoutForm.city} ({deliveryLabel})
                </p>
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
              <Button
                size="lg"
                fullWidth
                className="mb-3"
                onClick={() => setIsCheckoutOpen(true)}
              >
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
                <p className="text-sm text-gray-500">Same day delivery, à§³{INSIDE_DHAKA_DELIVERY}</p>
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
                <p className="text-sm text-gray-500">2-3 business days via courier, à§³{OUTSIDE_DHAKA_DELIVERY}</p>
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

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Checkout Details</DialogTitle>
            <DialogDescription>
              Fill in your delivery details to place this order.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmitOrder}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={checkoutForm.name}
                  onChange={handleCheckoutChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={checkoutForm.phone}
                  onChange={handleCheckoutChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={checkoutForm.email}
                  onChange={handleCheckoutChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-gray-700">
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  value={checkoutForm.city}
                  onChange={handleCheckoutChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {bangladeshCities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name} - {city.insideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="area" className="mb-1.5 block text-sm font-medium text-gray-700">
                Area
              </label>
              <input
                id="area"
                name="area"
                type="text"
                value={checkoutForm.area}
                onChange={handleCheckoutChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-gray-700">
                Delivery Address
              </label>
              <textarea
                id="address"
                name="address"
                value={checkoutForm.address}
                onChange={handleCheckoutChange}
                required
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label htmlFor="paymentMethod" className="mb-1.5 block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={checkoutForm.paymentMethod}
                onChange={handleCheckoutChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option>Cash on Delivery</option>
                <option>bKash</option>
                <option>Nagad</option>
                <option>Card</option>
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-gray-700">
                Order Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={checkoutForm.notes}
                onChange={handleCheckoutChange}
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Order Total</span>
                <span className="text-xl font-bold text-primary">৳ {total}</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3">
                    <span>{item.name} x {item.quantity}</span>
                    <span>৳ {item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between gap-3 border-t border-gray-200 pt-2">
                  <span>Delivery ({checkoutForm.city})</span>
                  <span>{deliveryFee === 0 ? 'Free' : `৳ ${deliveryFee}`}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCheckoutOpen(false)}
                disabled={isSubmittingOrder}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isSubmittingOrder}>
                Submit Order
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
