"use client";

import { deleteComment } from "../actions";

function initials(name) {
  return (name || "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function timeAgo(date) {
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString("en-GB");
}

export default function CommentList({ comments, slug, currentUserId, isAdmin }) {
  if (!comments?.length) {
    return <p className="text-sm text-gray-400">No comments yet. Be the first to comment.</p>;
  }

  return (
    <ul className="space-y-4">
      {comments.map((c) => {
        const canDelete = isAdmin || (c.userId && c.userId === currentUserId);
        return (
          <li key={c.id} className="flex gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-light-green/40 text-dark-green flex items-center justify-center text-xs font-semibold">
              {initials(c.user?.name || c.authorName)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{c.authorName}</span>
                <span className="text-xs text-gray-400">{timeAgo(c.createdAt)}</span>
                {canDelete && (
                  <form action={deleteComment.bind(null, c.id, slug)} className="ml-auto">
                    <button
                      type="submit"
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </form>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap break-words">{c.body}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
