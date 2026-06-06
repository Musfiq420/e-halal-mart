import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteTag } from "./actions";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import { readableText } from "@/lib/color";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { label: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          <p className="text-gray-500 mt-1">{tags.length} total</p>
        </div>
        <Link
          href="/admin/tags/new"
          className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
        >
          + Add Tag
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Tag</th>
              <th className="px-5 py-3 font-medium">Slug</th>
              <th className="px-5 py-3 font-medium text-right">Products</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-500">No tags yet.</td>
              </tr>
            ) : (
              tags.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: t.color, color: readableText(t.color) }}
                    >
                      {t.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{t.slug}</td>
                  <td className="px-5 py-3 text-right">{t._count.products}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/tags/${t.id}/edit`} className="text-primary hover:underline">
                        Edit
                      </Link>
                      <ConfirmDeleteButton
                        action={deleteTag}
                        id={t.id}
                        title="Delete tag?"
                        message={`“${t.label}” will be removed from all products. This action cannot be undone.`}
                      />
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
