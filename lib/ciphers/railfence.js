/**
 * Encrypts text using Rail Fence cipher
 * @param {string} text
 * @param {number} rails - number of rails (min 2)
 * @returns {string}
 */
export function encryptRailFence(text, rails) {
  const r = Math.max(2, Math.floor(rails) || 2);
  if (r >= text.length) return text;
  const fence = Array.from({ length: r }, () => []);
  let rail = 0;
  let dir = 1;
  for (const ch of text) {
    fence[rail].push(ch);
    if (rail === 0) dir = 1;
    else if (rail === r - 1) dir = -1;
    rail += dir;
  }
  return fence.map((row) => row.join("")).join("");
}

/**
 * Decrypts text using Rail Fence cipher
 * @param {string} text
 * @param {number} rails - number of rails (min 2)
 * @returns {string}
 */
export function decryptRailFence(text, rails) {
  const r = Math.max(2, Math.floor(rails) || 2);
  const n = text.length;
  if (r >= n) return text;

  const pattern = [];
  let rail = 0;
  let dir = 1;
  for (let i = 0; i < n; i++) {
    pattern.push(rail);
    if (rail === 0) dir = 1;
    else if (rail === r - 1) dir = -1;
    rail += dir;
  }

  const counts = Array(r).fill(0);
  pattern.forEach((ri) => counts[ri]++);

  const rows = [];
  let pos = 0;
  for (let i = 0; i < r; i++) {
    rows.push(text.slice(pos, pos + counts[i]).split(""));
    pos += counts[i];
  }

  const indices = Array(r).fill(0);
  return pattern.map((ri) => rows[ri][indices[ri]++]).join("");
}
