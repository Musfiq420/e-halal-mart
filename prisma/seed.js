// Seeds the initial category + products that previously lived in src/data/products.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  {
    slug: "traditional",
    name: "Traditional Foods",
    namebn: "ঐতিহ্যবাহী খাবার",
    image: "/categories/traditional.png",
    description: "Traditional Bengali dishes",
  },
];

const products = [
  {
    id: 1,
    name: "Kumro Bori",
    namebn: "কুমড়া বরি",
    price: 200,
    originalPrice: null,
    categorySlug: "traditional",
    image: "/products/kumro_bori.png",
    images: ["/products/kumro_bori.png"],
    isHalal: true,
    isOrganic: false,
    isFeatured: true,
    isNew: false,
    inStock: true,
    unit: "২৫০ গ্রাম",
    description:
      "বাংলার ঐতিহ্যবাহী শুকনো খাবারের একটি অনন্য নাম কুমড়া বরি। তানোরের অর্গানিক কুমড়া ও ডালের মিশ্রণে তৈরি এই বরি সম্পূর্ণ ঘরোয়া পদ্ধতিতে প্রস্তুত করা হয়, যেখানে থাকে না কোনো কৃত্রিম রং বা প্রিজারভেটিভ। সূর্যের আলোতে প্রাকৃতিকভাবে শুকিয়ে তৈরি হওয়ায় এর স্বাদ, ঘ্রাণ ও পুষ্টিগুণ থাকে অটুট।এই কুমড়া বরি রান্নায় এনে দেয় ভিন্ন মাত্রা—ভর্তা,ডাল মাছের ঝোল বা সবজি—সবকিছুর সাথে এটি দারুণ মানিয়ে যায়। রান্নার সময় নরম হয়ে ভেতরে শোষে নেয় মসলার স্বাদ, আর দেয় হালকা মিষ্টি ও স্মোকি ফ্লেভার।",
    nutritionInfo: null,
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 2,
    name: "Mango Bar",
    namebn: "আমসত্ত্ব",
    price: 350,
    originalPrice: null,
    categorySlug: "traditional",
    image: "/products/mango_bar.png",
    images: ["/products/mango_bar.png"],
    isHalal: true,
    isOrganic: false,
    isFeatured: true,
    isNew: true,
    inStock: true,
    unit: "২৫০ গ্রাম",
    description:
      "খাঁটি কাঁচা আমের ঐতিহ্যবাহী স্বাদ প্রাকৃতিকভাবে রোদে শুকানো কাঁচা আমের ঘন ও মিষ্টি-টক স্বাদের আমসত্ত্ব।সম্পূর্ণ প্রিজারভেটিভ-মুক্ত, ঘরোয়া পদ্ধতিতে প্রস্তুত এই আমসত্ত্বে কাঁচা আমের আসল সুগন্ধ ও পুষ্টিগুণের নিখুঁত সংমিশ্রণ। প্রতিটি স্তরে যত্নসহকারে প্রস্তুত করে রোদে শুকিয়ে তৈরি করা হয়েছে, যাতে এর স্বাদ থাকে খাঁটি ও দীর্ঘস্থায়ী। এটি শিশু থেকে বড়—সবাই খেতে পারবে নাস্তা হিসেবে বা খাবারের পর মিষ্টি স্বাদের টুইস্ট হিসেবে।",
    nutritionInfo: null,
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 3,
    name: "Lobongo Lotika",
    namebn: "লবঙ্গ লতিকা",
    price: 300,
    originalPrice: null,
    categorySlug: "traditional",
    image: "/products/lobongo_lotika.png",
    images: ["/products/lobongo_lotika.png"],
    isHalal: true,
    isOrganic: false,
    isFeatured: true,
    isNew: true,
    inStock: true,
    unit: "১০ পিস",
    description:
      "ঘরে তৈরি খাঁটি স্বাদের লবঙ্গ লতিকা, যা প্রতিটি কামড়ে এনে দেয় নরম-মোলায়েম আবরণ আর ভেতরে সুস্বাদু মিষ্টি পুরের অনন্য সমন্বয়। সূক্ষ্মভাবে ভাঁজ করা ময়দার খোলের মাঝে থাকে নারিকেল, ঘি ও গুড় দিয়ে তৈরি সুগন্ধি পুর, আর উপরে লবঙ্গ দিয়ে আটকানো—যা শুধু স্বাদই নয়, বাড়িয়ে দেয় এর আকর্ষণও।",
    nutritionInfo: null,
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 4,
    name: "Nakshi Pitha",
    namebn: "নকশি পিঠা",
    price: 600,
    originalPrice: null,
    categorySlug: "traditional",
    image: "/products/nakshi_pitha.png",
    images: ["/products/nakshi_pitha.png"],
    isHalal: true,
    isOrganic: false,
    isFeatured: true,
    isNew: true,
    inStock: true,
    unit: "১০ পিস",
    description:
      "নকশি পিঠা বাংলাদেশের গ্রামীণ ঐতিহ্যের এক অনন্য নিদর্শন, যা তার সূক্ষ্ম কারুকাজ ও খাঁটি স্বাদের জন্য বিশেষভাবে সমাদৃত। চালের গুঁড়া দিয়ে তৈরি এই পিঠাগুলো হাতে নিখুঁতভাবে নকশা করে গড়া হয়, যেখানে প্রতিটি ডিজাইনে ফুটে ওঠে আমাদের সংস্কৃতি ও ঐতিহ্যের ছোঁয়া। প্রতিটি পিঠায় পাওয়া যায় ঘরোয়া স্বাদ ও যত্নের ছাপ। নকশি পিঠা উৎসব, আপ্যায়ন কিংবা উপহার দেওয়ার জন্য দারুণ একটি পছন্দ। সম্পূর্ণ ঘরোয়া পরিবেশে, স্বাস্থ্যসম্মত উপায়ে এবং কোনো ধরনের কৃত্রিম উপাদান বা প্রিজারভেটিভ ছাড়া প্রস্তুত করা হয়।",
    nutritionInfo: null,
    rating: 0,
    reviewCount: 0,
  },
];

async function main() {
  const slugToId = {};

  for (const c of categories) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, namebn: c.namebn, image: c.image, description: c.description },
      create: c,
    });
    slugToId[c.slug] = category.id;
  }

  for (const p of products) {
    const { categorySlug, ...rest } = p;
    const data = { ...rest, categoryId: slugToId[categorySlug] };
    await prisma.product.upsert({
      where: { id: p.id },
      update: data,
      create: data,
    });
  }

  // Keep the autoincrement sequence ahead of the manually-seeded ids
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Product"', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "Product"))`
  );

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
