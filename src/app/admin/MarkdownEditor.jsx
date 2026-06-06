"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";

// MDXEditor must not run during SSR.
const Editor = dynamic(() => import("./InitializedMDXEditor"), {
  ssr: false,
  loading: () => (
    <div className="px-3 py-3 text-sm text-gray-400">Loading editor…</div>
  ),
});

/**
 * WYSIWYG Markdown editor that submits its value through a hidden input,
 * so it drops into a plain <form action={serverAction}> like a normal field.
 *
 * The value is written directly to the hidden input via a ref (not React
 * state) — MDXEditor fires onChange during mount, and a state update there
 * would warn about updating an unmounted component.
 */
export default function MarkdownEditor({ name, defaultValue = "" }) {
  const inputRef = useRef(null);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
      <Editor
        markdown={defaultValue}
        onChange={(md) => {
          if (inputRef.current) inputRef.current.value = md;
        }}
      />
      <input type="hidden" name={name} defaultValue={defaultValue} ref={inputRef} />
    </div>
  );
}
