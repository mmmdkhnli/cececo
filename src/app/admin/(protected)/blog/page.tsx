import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { blogPost } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteBlogPost } from "./actions";

export default async function AdminBlogPage() {
  const posts = await db.select().from(blogPost).orderBy(desc(blogPost.publishedAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-bold text-neutral-darkest">Blog</h1>
          <p className="mt-1 text-medium text-neutral">The &quot;Latest Insights&quot; section on the Home page.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-button bg-mountain-meadow px-4 py-2.5 font-medium text-white hover:bg-mountain-meadow-dark"
        >
          + New post
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-card border border-neutral-lighter bg-white">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-neutral-lighter text-neutral">
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-neutral-lighter last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-darkest">{post.title}</td>
                <td className="px-4 py-3 text-neutral-dark">{post.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      post.status === "published"
                        ? "rounded-badge bg-mountain-meadow-lightest px-2 py-0.5 text-tiny font-semibold text-mountain-meadow-darker"
                        : "rounded-badge bg-neutral-lightest px-2 py-0.5 text-tiny font-semibold text-neutral-dark"
                    }
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-dark">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US") : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="rounded-button border border-neutral-lighter px-3 py-1.5 font-medium text-neutral-darkest hover:bg-neutral-lightest"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteBlogPost.bind(null, post.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
