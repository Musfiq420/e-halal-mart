'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, ProductCard, HalalBadge, OrganicBadge, NewBadge } from '@/components/e-halal';
import { getProductById, getRelatedProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function ProductDetailsPage({ params }) {
  const resolvedParams = use(params);
  const productId = parseInt(resolvedParams.id);
  const product = getProductById(productId);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(productId);

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <ProductImages product={product} />

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Product Description */}
        <div className="mt-8 bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {product.nutritionInfo && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Nutrition Info</h3>
              <p className="text-gray-600 text-sm">{product.nutritionInfo}</p>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductImages({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const images = product.images || [product.image];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm cursor-zoom-in"
        onClick={() => setIsZoomed(true)}
      >
        <Image
          src={images[selectedImage]}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isHalal && <HalalBadge />}
          {product.isOrganic && <OrganicBadge />}
        </div>

        {product.isNew && (
          <div className="absolute top-4 right-4 z-10">
            <NewBadge />
          </div>
        )}

        {/* Sale Badge */}
        {product.originalPrice && (
          <div className="absolute bottom-4 right-4 z-10">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          </div>
        )}

        {/* Image Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index ? 'border-primary' : 'border-gray-200'
              }`}
            >
              <Image
                src={img}
                alt={`${product.name} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setIsZoomed(false)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full max-w-4xl aspect-square">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { success } = useToast();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    success(`${quantity} × ${product.name} added to cart!`);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Category */}
      <Link
        href={`/products?category=${product.category}`}
        className="text-sm text-primary hover:underline"
      >
        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
      </Link>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-1">
        {product.name}
      </h1>
      <p className="text-gray-500 text-sm mb-4">{product.namebn}</p>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-200'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {product.rating} ({product.reviewCount} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-3xl font-bold text-primary">৳{product.price}</span>
        <span className="text-gray-400">/{product.unit}</span>
        {product.originalPrice && (
          <>
            <span className="text-lg text-gray-400 line-through">৳{product.originalPrice}</span>
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-sm font-medium">
              Save {discount}%
            </span>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="mb-6">
        {product.inStock ? (
          <span className="inline-flex items-center gap-1 text-primary">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            In Stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-red-500">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            Out of Stock
          </span>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-gray-600">Quantity:</span>
        <div className="flex items-center bg-gray-50 rounded-lg">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-100 rounded-l-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(99, Number(e.target.value))))}
            className="w-12 h-10 text-center bg-transparent border-0 focus:outline-none font-medium"
          />
          <button
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-100 rounded-r-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <span className="text-sm text-gray-500">
          Total: <span className="font-bold text-gray-900">৳{product.price * quantity}</span>
        </span>
      </div>

      {/* Add to Cart Button */}
      <div className="flex gap-3 mb-6">
        <Button
          size="lg"
          fullWidth
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to Cart
        </Button>
        <Button variant="outline" size="lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </Button>
      </div>

      {/* Delivery Info */}
      <div className="border-t border-gray-100 pt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span className="text-gray-600">
            Free delivery on orders over <span className="font-medium">৳1000</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-gray-600">
            Estimated delivery: <span className="font-medium">Today or Tomorrow</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-gray-600">
            Quality guaranteed or <span className="font-medium">money back</span>
          </span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 p-4 bg-light-green/20 rounded-xl">
        <div className="flex flex-wrap gap-4">
          {product.isHalal && (
            <div className="flex items-center gap-2">
              <span className="text-xl">☪</span>
              <div>
                <p className="text-xs font-semibold text-primary">Halal Certified</p>
                <p className="text-xs text-gray-500">Verified source</p>
              </div>
            </div>
          )}
          {product.isOrganic && (
            <div className="flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <div>
                <p className="text-xs font-semibold text-primary">Organic</p>
                <p className="text-xs text-gray-500">Certified organic</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xl">🚚</span>
            <div>
              <p className="text-xs font-semibold text-primary">Fast Delivery</p>
              <p className="text-xs text-gray-500">Same day available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
