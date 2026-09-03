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
      // Percentage of the content column's width; "100" reads as edge-to-edge.
      width: {
        default: "100",
        parseHTML: (element) => element.getAttribute("data-width") || "100",
        renderHTML: (attributes) => ({ "data-width": attributes.width }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div.content-carousel" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const images: string[] = node.attrs.images ?? [];
    const width: string = node.attrs.width ?? "100";
    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: "content-carousel", style: `--carousel-width: ${width}%` }),
      ...images.map((src) => ["img", { src, alt: "" }] as const),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CarouselNodeView);
  },
});
