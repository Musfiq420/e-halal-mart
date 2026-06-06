import TagForm from "../TagForm";
import { createTag } from "../actions";

export default function NewTagPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Add Tag</h1>
      <TagForm action={createTag} />
    </div>
  );
}
