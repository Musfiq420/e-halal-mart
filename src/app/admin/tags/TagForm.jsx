"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { readableText } from "@/lib/color";

const field =
  "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

const PRESETS = ["#16a34a", "#84cc16", "#0ea5e9", "#6366f1", "#f59e0b", "#ef4444", "#ec4899", "#64748b"];

export default function TagForm({ action, tag }) {
  const [state, formAction, pending] = useActionState(action, {});
  const [color, setColor] = useState(tag?.color || "#16a34a");
  const isEdit = !!tag;

  return (
    <form action={formAction} className="space-y-5 max-w-lg">
      {isEdit && <input type="hidden" name="id" value={tag.id} />}

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {state.error}
        </div>
      )}

      <div>
        <label className={labelCls}>Label *</label>
        <input name="label" defaultValue={tag?.label || ""} className={field} required />
      </div>

      <div>
        <label className={labelCls}>Slug</label>
        <input name="slug" defaultValue={tag?.slug || ""} placeholder="auto-generated from label if empty" className={field} />
        <p className="text-xs text-gray-400 mt-1">Used for storefront filters (e.g. ?filter=organic).</p>
      </div>

      <div>
        <label className={labelCls}>Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer bg-white p-0.5"
            aria-label="Pick color"
          />
          <input
            name="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className={`${field} font-mono w-32`}
            maxLength={7}
          />
          {/* Live badge preview */}
          <span
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: color, color: readableText(color) }}
          >
            Preview
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {PRESETS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 transition ${
                color.toLowerCase() === c ? "border-gray-900" : "border-white shadow"
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Use ${c}`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-60 transition-colors"
        >
          {pending ? "Saving…" : isEdit ? "Update Tag" : "Create Tag"}
        </button>
        <Link href="/admin/tags" className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900">
          Cancel
        </Link>
      </div>
    </form>
  );
}
