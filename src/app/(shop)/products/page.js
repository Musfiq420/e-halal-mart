import ProductsBrowser from '@/components/e-halal/ProductsBrowser';
import { getProducts, getCategories } from '@/lib/queries';

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return <ProductsBrowser products={products} categories={categories} />;
}
