"use client";

import { useEffect, useRef, useState } from "react";
import { usePublisher, insertImage$ } from "@mdxeditor/editor";

// Custom, app-styled "Insert Image" toolbar button + modal for the MDXEditor.
// Supports drag-and-drop / file upload (to Supabase via /api/admin/upload),
// a URL field, and a caption that is stored as the image title.
export default function InsertImageButton() {
  const insertImage = usePublisher(insertImage$);
  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const resetState = () => {
    setFile(null);
    setPreview(null);
    setUrl("");
    setCaption("");
    setError("");
    setDragOver(false);
    setBusy(false);
  };
  const close = () => {
    setOpen(false);
    resetState();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const pickFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setUrl("");
    setError("");
    setPreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    setError("");
    let src = url.trim();
    try {
      if (file) {
        setBusy(true);
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "blog");
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || "Upload failed");
        }
        src = (await res.json()).url;
      }
      if (!src) {
        setError("Choose an image to upload or paste an image URL.");
        setBusy(false);
        return;
      }
      const cap = caption.trim();
      insertImage({ src, altText: cap, title: cap || undefined });
      close();
    } catch (e) {
      setError(e.message || "Could not insert image.");
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Insert image"
        aria-label="Insert image"
        className="inline-flex items-center justify-center w-8 h-8 rounded text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </button>

      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div onClick={close} className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Insert Image</h3>
              <button type="button" onClick={close} aria-label="Close" className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>

            {/* Dropzone */}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                pickFile(e.dataTransfer.files?.[0]);
              }}
              className={`rounded-xl border-2 border-dashed transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-gray-200 bg-gray-50"
              }`}
            >
              {preview ? (
                <div className="group relative flex items-center justify-center h-40 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="preview" className="max-h-full max-w-full object-contain" />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => inputRef.current?.click()} className="px-3 py-1.5 text-sm font-medium bg-white text-gray-800 rounded-lg hover:bg-gray-100">
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                        if (inputRef.current) inputRef.current.value = "";
                      }}
                      className="px-3 py-1.5 text-sm font-medium bg-white/90 text-red-600 rounded-lg hover:bg-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 h-40 w-full text-center px-4"
                >
                  <span className="flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 text-primary">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-600">
                    <span className="text-primary font-medium">Click to upload</span> or drag &amp; drop
                  </span>
                  <span className="text-xs text-gray-400">PNG, JPG or WEBP</span>
                </button>
              )}
            </div>

            {/* URL alternative */}
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">Or paste an image URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (e.target.value) {
                    setFile(null);
                    setPreview(e.target.value);
                  }
                }}
                placeholder="https://…"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            {/* Caption */}
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">Caption (optional)</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Shown below the image"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-5 flex items-center justify-end gap-3">
              <button type="button" onClick={close} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={busy}
                className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-60 transition-colors"
              >
                {busy ? "Uploading…" : "Insert"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
