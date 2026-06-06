"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { logAudit, diff } from "@/lib/audit";

const TAG_FIELDS = ["slug", "label", "color"];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeColor(value) {
  const v = String(value || "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(v) ? v.toLowerCase() : "#16a34a";
}

function readTagData(formData) {
  const label = String(formData.get("label") || "").trim();
  if (!label) throw new Error("Label is required.");

  const rawSlug = String(formData.get("slug") || "").trim();
  const slug = slugify(rawSlug || label);
  if (!slug) throw new Error("A valid slug is required.");

  return { label, slug, color: normalizeColor(formData.get("color")) };
}

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/products");
  revalidatePath("/admin/tags");
}

export async function createTag(prevState, formData) {
  await requireAdmin();
  let created;
  try {
    const data = readTagData(formData);
    created = await prisma.tag.create({ data });
  } catch (e) {
    if (e.code === "P2002") return { error: "That slug is already in use." };
    return { error: e.message || "Could not create tag." };
  }
  await logAudit({
    action: "CREATE",
    entity: "Tag",
    entityId: created.id,
    summary: `Created tag “${created.label}”`,
  });
  revalidateAll();
  redirect("/admin/tags");
}

export async function updateTag(prevState, formData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Invalid tag id." };
  const existing = await prisma.tag.findUnique({ where: { id } });
  let updated;
  try {
    const data = readTagData(formData);
    updated = await prisma.tag.update({ where: { id }, data });
  } catch (e) {
    if (e.code === "P2002") return { error: "That slug is already in use." };
    return { error: e.message || "Could not update tag." };
  }
  await logAudit({
    action: "UPDATE",
    entity: "Tag",
    entityId: id,
    summary: `Updated tag “${updated.label}”`,
    changes: diff(existing, updated, TAG_FIELDS),
  });
  revalidateAll();
  redirect("/admin/tags");
}

export async function deleteTag(formData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const existing = await prisma.tag.findUnique({ where: { id } });
  // Implicit m2m join rows are removed automatically (onDelete: Cascade).
  const deleted = await prisma.tag
    .delete({ where: { id } })
    .then(() => true)
    .catch(() => false);
  if (deleted && existing) {
    await logAudit({
      action: "DELETE",
      entity: "Tag",
      entityId: id,
      summary: `Deleted tag “${existing.label}”`,
    });
  }
  revalidateAll();
}
