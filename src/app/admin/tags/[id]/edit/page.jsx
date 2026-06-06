import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TagForm from "../../TagForm";
import { updateTag } from "../../actions";

export default async function EditTagPage({ params }) {
  const { id } = await params;
  const tag = await prisma.tag.findUnique({ where: { id } });
  if (!tag) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Tag</h1>
      <TagForm action={updateTag} tag={tag} />
    </div>
  );
}
