"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Styled image picker with drag-and-drop + preview. Wraps a real
 * <input type="file" name={name}> so it submits with the form exactly like
 * before — the server action keeps reading formData.get(name) as a File.
 *
 * @param {string} name            file input name (default "image")
 * @param {string|null} defaultPreview  existing image URL (edit mode)
 * @param {string} [helpText]      hint shown below the dropzone
 */
export default function ImageUpload({ name = "image", defaultPreview = null, helpText }) {
  const inputRef = useRef(null);
  const fileRef = useRef(null); // the chosen File, kept across form resets
  const [preview, setPreview] = useState(defaultPreview);
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const hasNewFile = fileName !== "";

  const applyFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    fileRef.current = file;
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
  };

  // React 19 auto-resets the <form> after a server action (even on a returned
  // error), clearing the file input while the preview still shows the image.
  // Re-attach the chosen file after any reset so the user need not pick it again.
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const restore = () =>
      setTimeout(() => {
        const f = fileRef.current;
        if (f && inputRef.current && inputRef.current.files.length === 0) {
          const dt = new DataTransfer();
          dt.items.add(f);
          inputRef.current.files = dt.files;
        }
      }, 0);
    form.addEventListener("reset", restore);
    return () => form.removeEventListener("reset", restore);
  }, []);

  const onInputChange = (e) => {
    const f = e.target.files?.[0];
    if (f) applyFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (!f || !inputRef.current) return;
    // Push the dropped file into the real input so it's part of the submission.
    const dt = new DataTransfer();
    dt.items.add(f);
    inputRef.current.files = dt.files;
    applyFile(f);
  };

  const browse = () => inputRef.current?.click();

  const reset = () => {
    if (inputRef.current) inputRef.current.value = "";
    fileRef.current = null;
    setFileName("");
    setPreview(defaultPreview); // revert to the existing image (or empty)
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        onChange={onInputChange}
        className="sr-only"
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative rounded-xl border-2 border-dashed transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-gray-200 bg-gray-50"
        }`}
      >
        {preview ? (
          <div className="group relative flex items-center justify-center h-44 overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="preview" className="max-h-full max-w-full object-contain" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={browse}
                className="px-3 py-1.5 text-sm font-medium bg-white text-gray-800 rounded-lg hover:bg-gray-100"
              >
                Change
              </button>
              {hasNewFile && (
                <button
                  type="button"
                  onClick={reset}
                  className="px-3 py-1.5 text-sm font-medium bg-white/90 text-red-600 rounded-lg hover:bg-white"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={browse}
            className="flex flex-col items-center justify-center gap-2 h-44 w-full text-center px-4"
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
            <span className="text-xs text-gray-400">PNG, JPG or WEBP — up to 10MB</span>
          </button>
        )}
      </div>

      {/* Selected file name / hint */}
      <div className="flex items-center justify-between mt-1.5">
        <p className="text-xs text-gray-400">{helpText}</p>
        {hasNewFile && <p className="text-xs text-gray-500 truncate max-w-[60%]">{fileName}</p>}
      </div>
    </div>
  );
}
