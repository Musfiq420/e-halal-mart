"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { addComment } from "../actions";

export default function CommentForm({ postId, slug, isAuthed }) {
  const [state, formAction, pending] = useActionState(addComment, {});
  const formRef = useRef(null);

  // Clear the textarea after a successful post.
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  if (!isAuthed) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
        <Link href={`/login?callbackUrl=/blog/${slug}`} className="text-primary font-medium hover:underline">
          Sign in
        </Link>{" "}
        to join the conversation.
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="slug" value={slug} />
      <textarea
        name="body"
        rows={3}
        required
        placeholder="Write a comment…"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-60 transition-colors"
        >
          {pending ? "Posting…" : "Post Comment"}
        </button>
      </div>
    </form>
  );
}
