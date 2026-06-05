import "server-only";
import { prisma } from "@/lib/prisma";

// Maps a Prisma product (with category relation) to the shape the storefront
// components expect (category as a slug string, images as an array).
function mapProduct(p) {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    namebn: p.namebn,
    price: p.price,
    originalPrice: p.originalPrice,
    category: p.category?.slug ?? null,
    image: p.image,
    images: p.images?.length ? p.images : p.image ? [p.image] : [],
    isHalal: p.isHalal,
    isOrganic: p.isOrganic,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    inStock: p.inStock,
    unit: p.unit,
    description: p.description,
    nutritionInfo: p.nutritionInfo,
    rating: p.rating,
    reviewCount: p.reviewCount,
  };
}

function mapCategory(c) {
  if (!c) return null;
  return {
    // `id` is the slug so existing storefront links (?category=<id>) keep working
    id: c.slug,
    slug: c.slug,
    name: c.name,
    namebn: c.namebn,
    image: c.image,
    description: c.description,
    productCount: c._count?.products ?? 0,
  };
}

export async function getProducts() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(mapProduct);
}

export async function getProductById(id) {
  const numId = Number(id);
  if (!Number.isInteger(numId)) return null;
  const product = await prisma.product.findUnique({
    where: { id: numId },
    include: { category: true },
  });
  return mapProduct(product);
}

export async function getProductsByCategory(slug) {
  const products = await prisma.product.findMany({
    where: { category: { slug } },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(mapProduct);
}

export async function getRelatedProducts(productId, limit = 4) {
  const numId = Number(productId);
  const product = await prisma.product.findUnique({
    where: { id: numId },
    select: { categoryId: true },
  });
  if (!product) return [];
  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: numId } },
    include: { category: true },
    take: limit,
  });
  return related.map(mapProduct);
}

export async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(mapProduct);
}

export async function getNewProducts() {
  const products = await prisma.product.findMany({
    where: { isNew: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(mapProduct);
}

export async function getCategories() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return categories.map(mapCategory);
}
