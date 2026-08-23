import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { blogPost } from "@/db/schema";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { updateBlogPost } from "../actions";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post] = await db.select().from(blogPost).where(eq(blogPost.id, Number(id)));
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-h3 font-bold text-neutral-darkest">Edit {post.title}</h1>
      <div className="mt-8">
        <BlogPostForm key={post.id} action={updateBlogPost.bind(null, post.id)} defaultValues={post} />
      </div>
    </div>
  );
}
