"use client";

import { useActionState } from "react";
import Link from "next/link";
import MarkdownEditor from "../MarkdownEditor";
import ImageUpload from "../ImageUpload";

const field =
  "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

export default function BlogForm({ action, post }) {
  const [state, formAction, pending] = useActionState(action, {});
  const isEdit = !!post;

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      {isEdit && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="currentImage" value={post?.coverImage || ""} />

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {state.error}
        </div>
      )}

      <div>
        <label className={labelCls}>Title *</label>
        <input name="title" defaultValue={post?.title || ""} className={field} required />
      </div>

      <div>
        <label className={labelCls}>Slug *</label>
        <input
          name="slug"
          defaultValue={post?.slug || ""}
          placeholder="e.g. halal-food-tips"
          pattern="[A-Za-z0-9\-]+"
          title="English letters, numbers and hyphens only"
          required
          className={field}
        />
        <p className="text-xs text-gray-400 mt-1">
          The article URL: /blog/your-slug — English letters, numbers and hyphens only. A number is
          added automatically if the slug is already taken.
        </p>
      </div>

      <div>
        <label className={labelCls}>Excerpt</label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt || ""}
          placeholder="Short summary shown on the blog list"
          className={field}
        />
      </div>

      <div>
        <label className={labelCls}>Cover Image</label>
        <ImageUpload
          name="coverImage"
          defaultPreview={post?.coverImage || null}
          helpText={isEdit ? "Leave unchanged to keep the current image." : "Upload a cover image."}
        />
      </div>

      <div>
        <label className={labelCls}>Content *</label>
        <MarkdownEditor name="content" defaultValue={post?.content || ""} />
        <p className="text-xs text-gray-400 mt-1">
          Use the toolbar for headings, bold, and lists — saved as Markdown.
        </p>
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post ? post.published : false}
          className="w-4 h-4 accent-primary"
        />
        Published
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-60 transition-colors"
        >
          {pending ? "Saving…" : isEdit ? "Update Article" : "Create Article"}
        </button>
        <Link href="/admin/blog" className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900">
          Cancel
        </Link>
      </div>
    </form>
  );
}
