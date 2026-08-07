const generateSlug = (text = '') => {
  return String(text)
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
