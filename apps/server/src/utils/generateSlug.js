const generateSlug = (text = '') => {
  let str = String(text).trim();
  try {
    str = decodeURIComponent(str);
  } catch {
    // ignore malformed URI sequences
  }
  return str
    .toLowerCase()
    .trim()
    // \p{L} = any Unicode letter (keeps Devanagari/Hindi), \p{M} = combining
    // marks (Devanagari matras like े ी ं), \p{N} = any Unicode number
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

module.exports = generateSlug;
