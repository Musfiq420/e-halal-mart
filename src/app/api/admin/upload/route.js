import { auth } from "@/auth";
import { uploadImage } from "@/lib/supabase";

export const runtime = "nodejs";

// Admin-only image upload used by the in-article MDXEditor (and reusable
// elsewhere). Returns the public URL of the stored file.
export async function POST(request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  const folder = String(form.get("folder") || "blog");

  try {
    const url = await uploadImage(file, folder);
    if (!url) return Response.json({ error: "No image provided" }, { status: 400 });
    return Response.json({ url });
  } catch (e) {
    return Response.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}
