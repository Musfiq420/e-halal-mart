"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth-helpers";

function bool(formData, key) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function intOrNull(value) {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? n : null;
}

async function readProductData(formData) {
  const name = String(formData.get("name") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const price = intOrNull(formData.get("price"));

  if (!name) throw new Error("Name is required.");
  if (!categoryId) throw new Error("Category is required.");
  if (price === null || price < 0) throw new Error("A valid price is required.");

  // Image: newly uploaded file wins, otherwise keep the existing URL.
  const file = formData.get("image");
  const uploaded = await uploadImage(file, "products");
  const currentImage = String(formData.get("currentImage") || "").trim();
  const image = uploaded || currentImage || null;

  return {
    name,
    namebn: String(formData.get("namebn") || "").trim() || null,
    price,
    originalPrice: intOrNull(formData.get("originalPrice")),
    categoryId,
    image,
    images: image ? [image] : [],
    unit: String(formData.get("unit") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    nutritionInfo: String(formData.get("nutritionInfo") || "").trim() || null,
    isHalal: bool(formData, "isHalal"),
    isOrganic: bool(formData, "isOrganic"),
    isFeatured: bool(formData, "isFeatured"),
    isNew: bool(formData, "isNew"),
    inStock: bool(formData, "inStock"),
  };
}

function revalidateStorefront() {
  revalidatePath("/", "layout");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

export async function createProduct(prevState, formData) {
  await requireAdmin();
  try {
    const data = await readProductData(formData);
    await prisma.product.create({ data });
  } catch (e) {
    return { error: e.message || "Could not create product." };
  }
  revalidateStorefront();
  redirect("/admin/products");
}

export async function updateProduct(prevState, formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "Invalid product id." };
  try {
    const data = await readProductData(formData);
    await prisma.product.update({ where: { id }, data });
  } catch (e) {
    return { error: e.message || "Could not update product." };
  }
  revalidateStorefront();
  redirect("/admin/products");
}

export async function deleteProduct(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) {
    await prisma.product.delete({ where: { id } }).catch(() => {});
    revalidateStorefront();
  }
}
