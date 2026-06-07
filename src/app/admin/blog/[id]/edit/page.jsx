import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogForm from "../../BlogForm";
import { updatePost } from "../../actions";

export default async function EditPostPage({ params }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
      <BlogForm action={updatePost} post={post} />
    </div>
  );
}
