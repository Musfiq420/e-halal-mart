import BlogForm from "../BlogForm";
import { createPost } from "../actions";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">New Article</h1>
      <BlogForm action={createPost} />
    </div>
  );
}
