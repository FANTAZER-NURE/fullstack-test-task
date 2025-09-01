
export function normalizeTitle(raw: string): string {
  const asciiOnly = raw.replace(/[^A-Za-z0-9\s]/g, " ");
  return asciiOnly
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}
