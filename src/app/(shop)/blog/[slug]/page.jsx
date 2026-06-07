import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getPostBySlug, getUserLike } from "@/lib/queries";
import { Markdown } from "@/components/e-halal";
import ViewTracker from "./ViewTracker";
import LikeButton from "./LikeButton";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article | E-Halal Mart" };
  return {
    title: `${post.title} | E-Halal Blog`,
    description: post.excerpt || undefined,
  };
}

function formatDate(date) {
  return date
    ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const session = await auth();
  const user = session?.user;
  const isAuthed = !!user;
  const myLike = isAuthed ? await getUserLike(post.id, user.id) : null;

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      <ViewTracker slug={post.slug} />

      <article className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/blog" className="text-sm text-primary hover:underline">← All articles</Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-3">
          <span>{post.author?.name || "E-Halal"}</span>
          <span>·</span>
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          <span>·</span>
          <span>👁 {post.views} reads</span>
        </div>

        {post.coverImage && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mt-6">
            <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
          <Markdown className="text-gray-700 leading-relaxed">{post.content}</Markdown>
        </div>

        {/* Like */}
        <div className="flex items-center gap-3 mt-6">
          <LikeButton
            postId={post.id}
            slug={post.slug}
            initialCount={post._count.likes}
            initialLiked={!!myLike}
            isAuthed={isAuthed}
          />
          <span className="text-sm text-gray-400">{post._count.comments} comments</span>
        </div>

        {/* Comments */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Comments ({post._count.comments})
          </h2>

          <div className="mb-6">
            <CommentForm postId={post.id} slug={post.slug} isAuthed={isAuthed} />
          </div>

          <CommentList
            comments={post.comments}
            slug={post.slug}
            currentUserId={user?.id}
            isAdmin={user?.role === "ADMIN"}
          />
        </section>
      </article>
    </div>
  );
}
