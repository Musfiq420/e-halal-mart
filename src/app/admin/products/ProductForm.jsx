"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

const FLAGS = [
  { key: "isHalal", label: "Halal" },
  { key: "isOrganic", label: "Organic" },
  { key: "isFeatured", label: "Featured" },
  { key: "isNew", label: "New arrival" },
  { key: "inStock", label: "In stock" },
];

const field = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

export default function ProductForm({ action, categories, product }) {
  const [state, formAction, pending] = useActionState(action, {});
  const [preview, setPreview] = useState(product?.image || null);

  const isEdit = !!product;

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      {isEdit && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="currentImage" value={product?.image || ""} />

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {state.error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Name *</label>
          <input name="name" defaultValue={product?.name || ""} className={field} required />
        </div>
        <div>
          <label className={labelCls}>Name (Bangla)</label>
          <input name="namebn" defaultValue={product?.namebn || ""} className={field} />
        </div>
        <div>
          <label className={labelCls}>Category *</label>
          <select name="categoryId" defaultValue={product?.categoryId || ""} className={field} required>
            <option value="" disabled>Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Unit</label>
          <input name="unit" defaultValue={product?.unit || ""} placeholder="e.g. ২৫০ গ্রাম" className={field} />
        </div>
        <div>
          <label className={labelCls}>Price (৳) *</label>
          <input type="number" name="price" min="0" defaultValue={product?.price ?? ""} className={field} required />
        </div>
        <div>
          <label className={labelCls}>Original Price (৳)</label>
          <input type="number" name="originalPrice" min="0" defaultValue={product?.originalPrice ?? ""} className={field} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea name="description" rows={5} defaultValue={product?.description || ""} className={field} />
      </div>

      <div>
        <label className={labelCls}>Nutrition Info</label>
        <textarea name="nutritionInfo" rows={2} defaultValue={product?.nutritionInfo || ""} className={field} />
      </div>

      <div>
        <label className={labelCls}>Image</label>
        <div className="flex items-center gap-4">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }}
            className="text-sm"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {isEdit ? "Leave empty to keep the current image." : "Upload a product image."}
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {FLAGS.map((f) => {
          const checked = product ? !!product[f.key] : f.key === "isHalal" || f.key === "inStock";
          return (
            <label key={f.key} className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name={f.key} defaultChecked={checked} className="w-4 h-4 accent-primary" />
              {f.label}
            </label>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-60 transition-colors"
        >
          {pending ? "Saving…" : isEdit ? "Update Product" : "Create Product"}
        </button>
        <Link href="/admin/products" className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900">
          Cancel
        </Link>
      </div>
    </form>
  );
}
