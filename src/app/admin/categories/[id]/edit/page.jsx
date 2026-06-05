import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryForm from "../../CategoryForm";
import { updateCategory } from "../../actions";

export default async function EditCategoryPage({ params }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
      <CategoryForm action={updateCategory} category={category} />
    </div>
  );
}
