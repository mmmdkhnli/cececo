const WORDS_PER_MINUTE = 200;

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
