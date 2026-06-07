"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { uploadImage, deleteImages } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth-helpers";
import { logAudit, diff } from "@/lib/audit";

const POST_FIELDS = ["slug", "title", "excerpt", "coverImage", "published"];

// ASCII-only slug — Bangla characters in a URL path break article lookups, so
// the admin must provide an English slug (letters, numbers, hyphens).
function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Find a free slug by appending -2, -3, … when the base is already taken.
async function uniqueSlug(base, excludeId) {
  let slug = base;
  let n = 1;
  while (n < 1000) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

function bool(formData, key) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

async function readPostData(formData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Title is required.");

  const content = String(formData.get("content") || "").trim();
  if (!content) throw new Error("Content is required.");

  // Slug must be entered explicitly by the admin (no auto-derive from the title,
  // since Bangla titles can't produce a working URL slug).
  const slug = slugify(formData.get("slug"));
  if (!slug) {
    throw new Error("Please enter a slug using English letters, numbers and hyphens.");
  }

  // Cover image: newly uploaded file wins, otherwise keep the existing URL.
  const file = formData.get("coverImage");
  const uploaded = await uploadImage(file, "blog");
  const currentImage = String(formData.get("currentImage") || "").trim();
  const coverImage = uploaded || currentImage || null;

  return {
    title,
    slug,
    excerpt: String(formData.get("excerpt") || "").trim() || null,
    content,
    coverImage,
    published: bool(formData, "published"),
  };
}

function revalidateBlog(slug) {
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
}

export async function createPost(prevState, formData) {
  const session = await requireAdmin();
  let created;
  try {
    const data = await readPostData(formData);
    data.slug = await uniqueSlug(data.slug);
    created = await prisma.blogPost.create({
      data: {
        ...data,
        authorId: session.user.id,
        publishedAt: data.published ? new Date() : null,
      },
    });
  } catch (e) {
    return { error: e.message || "Could not create article." };
  }
  await logAudit({
    action: "CREATE",
    entity: "BlogPost",
    entityId: created.id,
    summary: `Created article “${created.title}”${created.published ? " (published)" : " (draft)"}`,
  });
  revalidateBlog(created.slug);
  redirect("/admin/blog");
}

export async function updatePost(prevState, formData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Invalid article id." };
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return { error: "Article not found." };

  let updated;
  try {
    const data = await readPostData(formData);
    data.slug = await uniqueSlug(data.slug, id);
    updated = await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        // Stamp publishedAt the first time it goes live; keep it once set.
        publishedAt: data.published ? existing.publishedAt ?? new Date() : null,
      },
    });
  } catch (e) {
    return { error: e.message || "Could not update article." };
  }
  await logAudit({
    action: "UPDATE",
    entity: "BlogPost",
    entityId: id,
    summary: `Updated article “${updated.title}”`,
    changes: diff(existing, updated, POST_FIELDS),
  });
  revalidateBlog(updated.slug);
  if (existing.slug !== updated.slug) revalidatePath(`/blog/${existing.slug}`);
  redirect("/admin/blog");
}

export async function deletePost(formData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  const deleted = await prisma.blogPost
    .delete({ where: { id } })
    .then(() => true)
    .catch(() => false);
  if (deleted && existing) {
    await deleteImages([existing.coverImage]);
    await logAudit({
      action: "DELETE",
      entity: "BlogPost",
      entityId: id,
      summary: `Deleted article “${existing.title}”`,
    });
    revalidateBlog(existing.slug);
  }
  redirect("/admin/blog");
}

// Admin moderation: remove any comment.
export async function adminDeleteComment(formData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const comment = await prisma.blogComment.findUnique({
    where: { id },
    include: { post: { select: { slug: true } } },
  });
  if (!comment) return;
  await prisma.blogComment.delete({ where: { id } }).catch(() => {});
  await logAudit({
    action: "DELETE",
    entity: "BlogComment",
    entityId: id,
    summary: `Deleted a comment by ${comment.authorName}`,
  });
  revalidateBlog(comment.post?.slug);
}
