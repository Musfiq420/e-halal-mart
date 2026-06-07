'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

export default function Layout({ children, categories = [] }) {
  return (
    <SessionProvider>
      <CartProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col bg-accent-beige/30 overflow-x-hidden">
            <Navbar categories={categories} />
            <main className="flex-1">
              {children}
            </main>
            <Footer categories={categories} />
            <CartDrawer />
          </div>
        </ToastProvider>
      </CartProvider>
    </SessionProvider>
  );
}
