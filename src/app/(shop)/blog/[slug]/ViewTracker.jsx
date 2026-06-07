"use client";

import { useEffect, useRef } from "react";

// Fires a single view increment per page open. Ref-guard avoids the
// React StrictMode double-invoke in development.
export default function ViewTracker({ slug }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    fetch(`/api/blog/${slug}/view`, { method: "POST" }).catch(() => {});
  }, [slug]);
  return null;
}
