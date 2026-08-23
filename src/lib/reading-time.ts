const WORDS_PER_MINUTE = 200; // widely-cited average silent-reading speed

// The rich text editor stores body HTML, which can embed <img> tags whose
// src is itself a long base64/path string — that must never be counted as
// "words". Strip tags (and any attribute values along with them) before
// counting, so only the actual visible text contributes to the estimate.
export function calculateReadingMinutes(html: string | null | undefined): number {
  if (!html) return 1;
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .trim();
  if (!text) return 1;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
