import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog | E-Halal Mart",
  description: "Halal food tips, traditional recipes, and news from E-Halal Mart.",
};

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
}

export default async function BlogListPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">E-Halal Blog</h1>
          <p className="text-gray-500 mt-2">Halal food tips, traditional recipes & stories.</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No articles published yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="relative aspect-[16/9] bg-gray-100">
                  {post.coverImage && (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-3 flex-1">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-4 pt-3 border-t border-gray-50">
                    <span>{post.author?.name || "E-Halal"}</span>
                    <span>·</span>
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    <span className="ml-auto flex items-center gap-3">
                      <span>👁 {post.views}</span>
                      <span>♥ {post._count.likes}</span>
                      <span>💬 {post._count.comments}</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
