"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";

// Toggle the current user's like on a post. Returns the new state + count.
export async function toggleLike(postId, slug) {
  const session = await requireUser(`/blog/${slug}`);
  const userId = session.user.id;

  const existing = await prisma.blogLike.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    await prisma.blogLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.blogLike
      .create({ data: { postId, userId } })
      .catch(() => {}); // ignore unique-race
  }

  revalidatePath(`/blog/${slug}`);
  const count = await prisma.blogLike.count({ where: { postId } });
  return { liked: !existing, count };
}

export async function addComment(prevState, formData) {
  const postId = String(formData.get("postId") || "");
  const slug = String(formData.get("slug") || "");
  const session = await requireUser(`/blog/${slug}`);
  const body = String(formData.get("body") || "").trim();
  if (!postId || !body) return { error: "Comment cannot be empty." };
  if (body.length > 2000) return { error: "Comment is too long." };

  await prisma.blogComment.create({
    data: {
      postId,
      userId: session.user.id,
      authorName: session.user.name || "User",
      body,
    },
  });

  revalidatePath(`/blog/${slug}`);
  return { ok: true, ts: Date.now() };
}

export async function deleteComment(commentId, slug) {
  const session = await requireUser(`/blog/${slug}`);
  const comment = await prisma.blogComment.findUnique({ where: { id: commentId } });
  if (!comment) return;

  const isOwner = comment.userId && comment.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) return; // not allowed

  await prisma.blogComment.delete({ where: { id: commentId } }).catch(() => {});
  revalidatePath(`/blog/${slug}`);
}
