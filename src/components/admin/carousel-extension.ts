import { Node, mergeAttributes } from "@tiptap/react";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CarouselNodeView } from "@/components/admin/carousel-node-view";

function parseImages(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export const Carousel = Node.create({
  name: "carousel",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      images: {
        default: [] as string[],
        parseHTML: (element) => parseImages(element.getAttribute("data-images")),
        renderHTML: (attributes) => ({ "data-images": JSON.stringify(attributes.images ?? []) }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div.content-carousel" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const images: string[] = node.attrs.images ?? [];
    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: "content-carousel" }),
      ...images.map((src) => ["img", { src, alt: "" }] as const),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CarouselNodeView);
  },
});
