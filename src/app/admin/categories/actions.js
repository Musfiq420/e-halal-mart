"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth-helpers";

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function readCategoryData(formData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Name is required.");

  const rawSlug = String(formData.get("slug") || "").trim();
  const slug = slugify(rawSlug || name);
  if (!slug) throw new Error("A valid slug is required.");

  const file = formData.get("image");
  const uploaded = await uploadImage(file, "categories");
  const currentImage = String(formData.get("currentImage") || "").trim();
  const image = uploaded || currentImage || null;

  return {
    slug,
    name,
    namebn: String(formData.get("namebn") || "").trim() || null,
    image,
    description: String(formData.get("description") || "").trim() || null,
  };
}

function revalidateStorefront() {
  revalidatePath("/", "layout");
  revalidatePath("/products");
  revalidatePath("/admin/categories");
}

export async function createCategory(prevState, formData) {
  await requireAdmin();
  try {
    const data = await readCategoryData(formData);
    await prisma.category.create({ data });
  } catch (e) {
    if (e.code === "P2002") return { error: "That slug is already in use." };
    return { error: e.message || "Could not create category." };
  }
  revalidateStorefront();
  redirect("/admin/categories");
}

export async function updateCategory(prevState, formData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Invalid category id." };
  try {
    const data = await readCategoryData(formData);
    await prisma.category.update({ where: { id }, data });
  } catch (e) {
    if (e.code === "P2002") return { error: "That slug is already in use." };
    return { error: e.message || "Could not update category." };
  }
  revalidateStorefront();
  redirect("/admin/categories");
}

export async function deleteCategory(formData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return; // guarded in the UI; refuse to delete non-empty categories
  await prisma.category.delete({ where: { id } }).catch(() => {});
  revalidateStorefront();
}
