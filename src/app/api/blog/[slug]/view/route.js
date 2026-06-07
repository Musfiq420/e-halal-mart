import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Increment the total view counter for an article. Fired once per page open
// by the ViewTracker client component.
export async function POST(_request, { params }) {
  const { slug } = await params;
  try {
    await prisma.blogPost.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch {
    // Unknown slug or transient error — don't surface to the reader.
    return Response.json({ ok: false }, { status: 200 });
  }
  return Response.json({ ok: true });
}
