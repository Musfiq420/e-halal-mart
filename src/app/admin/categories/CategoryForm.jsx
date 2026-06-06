"use client";

import { useActionState } from "react";
import Link from "next/link";
import ImageUpload from "../ImageUpload";

const field = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

export default function CategoryForm({ action, category }) {
  const [state, formAction, pending] = useActionState(action, {});
  const isEdit = !!category;

  return (
    <form action={formAction} className="space-y-5 max-w-2xl">
      {isEdit && <input type="hidden" name="id" value={category.id} />}
      <input type="hidden" name="currentImage" value={category?.image || ""} />

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {state.error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Name *</label>
          <input name="name" defaultValue={category?.name || ""} className={field} required />
        </div>
        <div>
          <label className={labelCls}>Name (Bangla)</label>
          <input name="namebn" defaultValue={category?.namebn || ""} className={field} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Slug</label>
        <input name="slug" defaultValue={category?.slug || ""} placeholder="auto-generated from name if empty" className={field} />
        <p className="text-xs text-gray-400 mt-1">Used in URLs (e.g. /products?category=traditional).</p>
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea name="description" rows={3} defaultValue={category?.description || ""} className={field} />
      </div>

      <div>
        <label className={labelCls}>Image</label>
        <ImageUpload
          name="image"
          defaultPreview={category?.image || null}
          helpText={isEdit ? "Leave unchanged to keep the current image." : "Upload a category image."}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-60 transition-colors"
        >
          {pending ? "Saving…" : isEdit ? "Update Category" : "Create Category"}
        </button>
        <Link href="/admin/categories" className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900">
          Cancel
        </Link>
      </div>
    </form>
  );
}
