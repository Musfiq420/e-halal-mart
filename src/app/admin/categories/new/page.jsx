import CategoryForm from "../CategoryForm";
import { createCategory } from "../actions";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Add Category</h1>
      <CategoryForm action={createCategory} />
    </div>
  );
}
