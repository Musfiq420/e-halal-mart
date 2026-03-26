'use client';

import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

export default function Layout({ children }) {
  return (
    <CartProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-accent-beige/30">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </ToastProvider>
    </CartProvider>
  );
}
