import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { heroSlide } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteHeroSlide } from "./actions";

export default async function AdminHeroSlidesPage() {
  const slides = await db.select().from(heroSlide).orderBy(asc(heroSlide.order));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-bold text-neutral-darkest">Hero slides</h1>
          <p className="mt-1 text-medium text-neutral">The carousel at the top of the Home page.</p>
        </div>
        <Link
          href="/admin/hero-slides/new"
          className="rounded-button bg-mountain-meadow px-4 py-2.5 font-medium text-white hover:bg-mountain-meadow-dark"
        >
          + New slide
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-card border border-neutral-lighter bg-white">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-neutral-lighter text-neutral">
              <th className="px-4 py-3 font-semibold">Image</th>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">See more</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {slides.map((slide) => (
              <tr key={slide.id} className="border-b border-neutral-lighter last:border-0">
                <td className="px-4 py-3">
                  {slide.backgroundImage && (
                    <img src={slide.backgroundImage} alt="" className="h-10 w-16 rounded object-cover" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-neutral-darkest">{slide.title}</td>
                <td className="px-4 py-3 text-neutral-dark">{slide.order}</td>
                <td className="px-4 py-3 text-neutral-dark">{slide.seeMoreEnabled ? "Yes" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/hero-slides/${slide.id}`}
                      className="rounded-button border border-neutral-lighter px-3 py-1.5 font-medium text-neutral-darkest hover:bg-neutral-lightest"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteHeroSlide.bind(null, slide.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {slides.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-neutral" colSpan={5}>
                  No slides added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
