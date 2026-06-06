import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "./actions";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import { readableText } from "@/lib/color";

export const dynamic = "force-dynamic";

function formatBDT(value) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, tags: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">{products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium text-right">Price</th>
              <th className="px-5 py-3 font-medium">Flags</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.image && (
                          <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.namebn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{p.category?.name}</td>
                  <td className="px-5 py-3 text-right">
                    {formatBDT(p.price)}
                    {p.originalPrice ? (
                      <span className="block text-xs text-gray-400 line-through">{formatBDT(p.originalPrice)}</span>
                    ) : null}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.isFeatured && <Badge>Featured</Badge>}
                      {p.isNew && <Badge>New</Badge>}
                      {!p.inStock && <Badge tone="red">Out</Badge>}
                      {p.tags.map((t) => (
                        <span
                          key={t.id}
                          className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                          style={{ backgroundColor: t.color, color: readableText(t.color) }}
                        >
                          {t.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/products/${p.id}/edit`} className="text-primary hover:underline">
                        Edit
                      </Link>
                      <ConfirmDeleteButton
                        action={deleteProduct}
                        id={p.id}
                        title="Delete product?"
                        message={`“${p.name}” will be permanently removed. This action cannot be undone.`}
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

function Badge({ children, tone = "green" }) {
  const tones = {
    green: "bg-light-green/40 text-dark-green",
    red: "bg-red-100 text-red-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
