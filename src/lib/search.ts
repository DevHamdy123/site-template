/** Makes Arabic/English text comparable: no tashkeel/tatweel, unified alef/yaa/taa-marbuta, lowercase. */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when `text` contains the (normalized) query. An empty query matches everything. */
export function matchesQuery(text: string, query: string): boolean {
  const q = normalizeText(query);
  return q === "" || normalizeText(text).includes(q);
}
