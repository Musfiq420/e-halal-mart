import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteCategory } from "./actions";
import ConfirmDeleteButton from "../ConfirmDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">{categories.length} total</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          + Add Category
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Slug</th>
              <th className="px-5 py-3 font-medium text-right">Products</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-500">No categories yet.</td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {c.image && <Image src={c.image} alt={c.name} fill className="object-cover" sizes="40px" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.namebn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{c.slug}</td>
                  <td className="px-5 py-3 text-right">{c._count.products}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/categories/${c.id}/edit`} className="text-primary hover:underline">
                        Edit
                      </Link>
                      {c._count.products === 0 ? (
                        <ConfirmDeleteButton
                          action={deleteCategory}
                          id={c.id}
                          title="Delete category?"
                          message={`“${c.name}” will be permanently removed. This action cannot be undone.`}
                        />
                      ) : (
                        <span className="text-gray-300" title="Category has products">Delete</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
