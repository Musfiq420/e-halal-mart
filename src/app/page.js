'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard, CategoryCard, Button } from '@/components/e-halal';
import { categories, featuredProducts, newProducts } from '@/data/products';

export default function HomePage() {
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <HeroSection />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Promotional Banner */}
      <PromoBanner />

      {/* New Arrivals */}
      <NewArrivals />

      {/* Why Choose Us */}
      <WhyChooseUs />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-light-green/10 to-accent-beige/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 islamic-pattern-overlay opacity-50" />

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span>☪</span>
              <span>100% Halal Certified</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Fresh & Halal
              <span className="block text-primary">Groceries For You</span>
            </h1>

            <p className="text-gray-600 text-lg mb-6 max-w-lg mx-auto lg:mx-0">
              Discover premium halal-certified meat, organic produce, and authentic Bengali groceries.
              Quality you can trust, delivered to your doorstep.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button size="lg" asChild>
                <Link href="/products">
                  Shop Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/products?category=organic">
                  Explore Organic
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start gap-8 mt-8 pt-8 border-t border-gray-200/50">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">1000+</p>
                <p className="text-sm text-gray-500">Products</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">5000+</p>
                <p className="text-sm text-gray-500">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">100%</p>
                <p className="text-sm text-gray-500">Halal Certified</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Decorative circles */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-light-green/30 rounded-full animate-pulse" />
              <div className="absolute inset-4 bg-gradient-to-br from-primary/30 to-light-green/40 rounded-full" />

              {/* Main image container */}
              <div className="absolute inset-8 rounded-full overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"
                  alt="Fresh halal groceries"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating badges */}
              <div className="absolute top-12 -left-4 bg-white rounded-xl shadow-lg p-3 animate-bounce-soft">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌿</span>
                  <div>
                    <p className="text-xs text-gray-500">Organic</p>
                    <p className="text-sm font-bold text-primary">Fresh</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-12 -right-4 bg-white rounded-xl shadow-lg p-3 animate-bounce-soft" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">☪</span>
                  <div>
                    <p className="text-xs text-gray-500">100%</p>
                    <p className="text-sm font-bold text-primary">Halal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.5" />
          <path d="M0 120L60 115C120 110 240 100 360 95C480 90 600 90 720 92C840 94 960 98 1080 100C1200 102 1320 102 1380 102L1440 102V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

function TrustBadges() {
  const badges = [
    {
      icon: '☪',
      title: 'Halal Certified',
      description: 'All products verified by certified halal authorities',
    },
    {
      icon: '🌿',
      title: 'Organic Options',
      description: 'Wide selection of certified organic products',
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Same-day delivery for orders before 2 PM',
    },
    {
      icon: '💯',
      title: 'Quality Assured',
      description: 'Premium quality guaranteed or money back',
    },
  ];

  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-light-green/10 transition-colors"
            >
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{badge.title}</p>
                <p className="text-xs text-gray-500 hidden sm:block">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Shop by Category
            </h2>
            <p className="text-gray-500">Browse our wide selection of halal products</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/products" className="mt-4 sm:mt-0">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Featured Products
            </h2>
            <p className="text-gray-500">Handpicked favorites from our collection</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/products" className="mt-4 sm:mt-0">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-dark-green to-primary text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 islamic-pattern-overlay opacity-30" />

          <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
            <div>
              <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-medium mb-4">
                Limited Time Offer
              </span>
              <h3 className="text-2xl md:text-4xl font-bold mb-4">
                Get 15% Off on First Order
              </h3>
              <p className="text-white/80 mb-6 max-w-md">
                Use code HALAL15 at checkout. Valid for new customers only.
                Shop our premium halal meat and organic products today!
              </p>
              <Button
                variant="secondary"
                size="lg"
                asChild
              >
                <Link href="/products">
                  Shop Now
                </Link>
              </Button>
            </div>

            <div className="hidden md:block relative">
              <div className="relative w-48 h-48 mx-auto">
                <Image
                  src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400"
                  alt="Fresh halal meat"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewArrivals() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              New Arrivals
            </h2>
            <p className="text-gray-500">Fresh additions to our halal collection</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/products?filter=new" className="mt-4 sm:mt-0">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Halal Integrity',
      description: 'Every product is sourced from certified halal suppliers with strict quality control.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Fresh Daily',
      description: 'Our meat and produce are delivered fresh daily from trusted local farms.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Easy Shopping',
      description: 'Simple, intuitive shopping experience with secure checkout and tracking.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Customer Support',
      description: 'Dedicated support team ready to help with any questions or concerns.',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-light-green/10 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Why Choose E-Halal Mart?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We&apos;re committed to providing the finest halal products with exceptional service
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-light-green/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
