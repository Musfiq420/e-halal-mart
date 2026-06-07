import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost } from "./actions";
import ConfirmDeleteButton from "../ConfirmDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { likes: true, comments: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-500 mt-1">{posts.length} total</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
        >
          + New Article
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[680px]">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Article</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Views</th>
              <th className="px-5 py-3 font-medium text-right">Likes</th>
              <th className="px-5 py-3 font-medium text-right">Comments</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">No articles yet.</td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{p.title}</p>
                    <p className="text-xs text-gray-400">/{p.slug}</p>
                  </td>
                  <td className="px-5 py-3">
                    {p.published ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-600">{p.views}</td>
                  <td className="px-5 py-3 text-right text-gray-600">{p._count.likes}</td>
                  <td className="px-5 py-3 text-right text-gray-600">{p._count.comments}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      {p.published && (
                        <Link href={`/blog/${p.slug}`} className="text-gray-500 hover:underline" target="_blank">
                          View
                        </Link>
                      )}
                      <Link href={`/admin/blog/${p.id}/edit`} className="text-primary hover:underline">
                        Edit
                      </Link>
                      <ConfirmDeleteButton
                        action={deletePost}
                        id={p.id}
                        title="Delete article?"
                        message={`“${p.title}”, its likes and comments will be permanently removed. This action cannot be undone.`}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
