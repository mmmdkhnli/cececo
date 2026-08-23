import { HeroSlideForm } from "@/components/admin/hero-slide-form";
import { createHeroSlide } from "../actions";

export default function NewHeroSlidePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">New hero slide</h1>
      <div className="mt-8">
        <HeroSlideForm action={createHeroSlide} />
      </div>
    </div>
  );
}
