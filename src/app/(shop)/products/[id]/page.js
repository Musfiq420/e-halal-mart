import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/e-halal/ProductDetailClient';
import { getProductById, getRelatedProducts } from '@/lib/queries';

export default async function ProductDetailsPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
