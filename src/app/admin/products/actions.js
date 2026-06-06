"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth-helpers";
import { logAudit, diff } from "@/lib/audit";

const PRODUCT_FIELDS = [
  "name",
  "namebn",
  "price",
  "originalPrice",
  "categoryId",
  "image",
  "unit",
  "description",
  "nutritionInfo",
  "isFeatured",
  "isNew",
  "inStock",
];

function bool(formData, key) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function intOrNull(value) {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? n : null;
}

// Selected tag ids from the product form's tag chips.
function readTagIds(formData) {
  return formData
    .getAll("tagIds")
    .map((v) => String(v))
    .filter(Boolean);
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
  let created;
  try {
    const data = await readProductData(formData);
    const tagIds = readTagIds(formData);
    created = await prisma.product.create({
      data: { ...data, tags: { connect: tagIds.map((id) => ({ id })) } },
    });
  } catch (e) {
    return { error: e.message || "Could not create product." };
  }
  await logAudit({
    action: "CREATE",
    entity: "Product",
    entityId: created.id,
    summary: `Created product “${created.name}” (৳${created.price})`,
  });
  revalidateStorefront();
  redirect("/admin/products");
}

export async function updateProduct(prevState, formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "Invalid product id." };
  const existing = await prisma.product.findUnique({ where: { id } });
  let updated;
  try {
    const data = await readProductData(formData);
    const tagIds = readTagIds(formData);
    updated = await prisma.product.update({
      where: { id },
      data: { ...data, tags: { set: tagIds.map((id) => ({ id })) } },
    });
  } catch (e) {
    return { error: e.message || "Could not update product." };
  }
  await logAudit({
    action: "UPDATE",
    entity: "Product",
    entityId: id,
    summary: `Updated product “${updated.name}”`,
    changes: diff(existing, updated, PRODUCT_FIELDS),
  });
  revalidateStorefront();
  redirect("/admin/products");
}

export async function deleteProduct(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) {
    const existing = await prisma.product.findUnique({ where: { id } });
    const deleted = await prisma.product
      .delete({ where: { id } })
      .then(() => true)
      .catch(() => false);
    if (deleted && existing) {
      await logAudit({
        action: "DELETE",
        entity: "Product",
        entityId: id,
        summary: `Deleted product “${existing.name}”`,
      });
    }
    revalidateStorefront();
  }
}
