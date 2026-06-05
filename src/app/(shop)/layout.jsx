import Layout from "@/components/e-halal/Layout";
import { getCategories } from "@/lib/queries";

export default async function ShopLayout({ children }) {
  const categories = await getCategories();
  return <Layout categories={categories}>{children}</Layout>;
}
