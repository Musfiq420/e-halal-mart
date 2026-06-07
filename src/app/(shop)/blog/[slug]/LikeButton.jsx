"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toggleLike } from "../actions";

export default function LikeButton({ postId, slug, initialCount, initialLiked, isAuthed }) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [pending, startTransition] = useTransition();

  if (!isAuthed) {
    return (
      <Link
        href={`/login?callbackUrl=/blog/${slug}`}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <HeartIcon filled={false} />
        <span>{count}</span>
        <span className="text-gray-400">· Sign in to like</span>
      </Link>
    );
  }

  const onClick = () => {
    // Optimistic update.
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));
    startTransition(async () => {
      try {
        const res = await toggleLike(postId, slug);
        if (res) {
          setLiked(res.liked);
          setCount(res.count);
        }
      } catch {
        // revert on failure
        setLiked(liked);
        setCount((c) => c + (nextLiked ? -1 : 1));
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={liked}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors disabled:opacity-60 ${
        liked
          ? "border-red-200 bg-red-50 text-red-600"
          : "border-gray-200 text-gray-600 hover:bg-gray-50"
      }`}
    >
      <HeartIcon filled={liked} />
      <span>{count}</span>
    </button>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
