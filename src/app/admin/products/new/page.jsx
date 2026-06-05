import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
      <ProductForm action={createProduct} categories={categories} />
    </div>
  );
}
