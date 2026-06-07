import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET || "e-halal-bucket";

// Server-only admin client (uses the service role key — never expose to the browser).
export const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

/**
 * Uploads an image File to Supabase Storage and returns its public URL.
 * Returns null when no file is provided. Throws on a real upload failure.
 *
 * @param {File} file
 * @param {string} folder  e.g. "products" or "categories"
 * @returns {Promise<string|null>}
 */
export async function uploadImage(file, folder = "uploads") {
  if (!file || typeof file === "string" || file.size === 0) {
    return null;
  }

  if (!supabaseAdmin) {
    throw new Error(
      "Supabase storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const ext = (file.name?.split(".").pop() || "bin").toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// Extract the in-bucket storage path from a public URL, or null if the URL is
// not one of our uploaded files (e.g. a seeded /public path or an Unsplash URL).
function storagePath(url) {
  if (!url || typeof url !== "string") return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const path = decodeURIComponent(url.slice(idx + marker.length));
  return path || null;
}

/**
 * Best-effort delete of one or more uploaded images from Supabase Storage.
 * Accepts public URLs (or an array of them); non-Supabase URLs are ignored.
 * Never throws — a storage hiccup must not block the DB delete.
 *
 * @param {string|string[]} urls
 */
export async function deleteImages(urls) {
  if (!supabaseAdmin) return;
  const list = Array.isArray(urls) ? urls : [urls];
  const paths = [...new Set(list.map(storagePath).filter(Boolean))];
  if (paths.length === 0) return;

  const { error } = await supabaseAdmin.storage.from(bucket).remove(paths);
  if (error) {
    console.error("Image delete failed:", error.message);
  }
}
