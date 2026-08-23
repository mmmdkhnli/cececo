import type { SchemeKey } from "@/db/schema";

// Human-readable description of each `.scheme-N` utility (see globals.css)
// so the admin can pick a look by what it actually renders as, instead of
// a bare "scheme-3" string.
export const SCHEME_META: Record<
  SchemeKey,
  { label: string; hint: string; background: string; foreground: string; text: string }
> = {
  "scheme-1": {
    label: "Green",
    hint: "Dark green background, white text",
    background: "#119c65",
    foreground: "#16c47f",
    text: "#ffffff",
  },
  "scheme-2": {
    label: "White",
    hint: "White background, dark text",
    background: "#ffffff",
    foreground: "#f2f2f2",
    text: "#0a0107",
  },
  "scheme-3": {
    label: "Blue",
    hint: "Blue background, white text",
    background: "#4c849d",
    foreground: "#005073",
    text: "#ffffff",
  },
  "scheme-4": {
    label: "Dark green",
    hint: "Very dark green background, white text",
    background: "#084e32",
    foreground: "#063a26",
    text: "#ffffff",
  },
  "scheme-5": {
    label: "Light gray",
    hint: "Light gray background, dark text",
    background: "#f2f2f2",
    foreground: "#ffffff",
    text: "#0a0107",
  },
  "scheme-6": {
    label: "Black",
    hint: "Black background, white text",
    background: "#0a0107",
    foreground: "#221a1f",
    text: "#ffffff",
  },
  "scheme-7": {
    label: "Dark gray",
    hint: "Dark gray background, white text",
    background: "#221a1f",
    foreground: "#0a0107",
    text: "#ffffff",
  },
};
