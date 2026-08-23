import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { heroSlide } from "@/db/schema";
import { HeroSlideForm } from "@/components/admin/hero-slide-form";
import { updateHeroSlide } from "../actions";

export default async function EditHeroSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [slide] = await db.select().from(heroSlide).where(eq(heroSlide.id, Number(id)));
  if (!slide) notFound();

  return (
    <div>
      <h1 className="text-h3 font-bold text-neutral-darkest">Edit {slide.title}</h1>
      <div className="mt-8">
        <HeroSlideForm key={slide.id} action={updateHeroSlide.bind(null, slide.id)} defaultValues={slide} />
      </div>
    </div>
  );
}
