"use client";

import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
} from "@mdxeditor/editor";
import InsertImageButton from "./InsertImageButton";

// Upload an image dropped/selected in the editor to Supabase, return its URL.
async function uploadEditorImage(file) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", "blog");
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Image upload failed");
  }
  const data = await res.json();
  return data.url;
}

// All MDXEditor + plugin imports live here so they only load on the client
// (this module is dynamically imported with ssr:false).
export default function InitializedMDXEditor({ markdown, onChange }) {
  return (
    <MDXEditor
      markdown={markdown || ""}
      onChange={onChange}
      contentEditableClassName="mdx-content"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({ imageUploadHandler: uploadEditorImage }),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <BlockTypeSelect />
              <CreateLink />
              <InsertImageButton />
            </>
          ),
        }),
      ]}
    />
  );
}
