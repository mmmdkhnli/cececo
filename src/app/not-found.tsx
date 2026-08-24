import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { NotFoundContent } from "@/components/shared/not-found-content";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <NotFoundContent />
      <Footer />
    </>
  );
}
