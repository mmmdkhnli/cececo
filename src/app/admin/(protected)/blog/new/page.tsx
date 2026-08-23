import { BlogPostForm } from "@/components/admin/blog-post-form";
import { createBlogPost } from "../actions";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">New blog post</h1>
      <div className="mt-8">
        <BlogPostForm action={createBlogPost} />
      </div>
    </div>
  );
}
