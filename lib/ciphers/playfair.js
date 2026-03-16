/**
 * Builds a 5x5 Playfair key square from a keyword.
 * I and J are treated as the same letter.
 */
function buildKeySquare(keyword) {
  const seen = new Set();
  const square = [];
  const clean = (keyword.toUpperCase() + "ABCDEFGHIKLMNOPQRSTUVWXYZ")
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
  for (const ch of clean) {
    if (!seen.has(ch)) {
      seen.add(ch);
      square.push(ch);
    }
  }
  return square;
}

function getPos(square, ch) {
  const idx = square.indexOf(ch === "J" ? "I" : ch);
  return { row: Math.floor(idx / 5), col: idx % 5 };
}

function prepareText(text) {
  const clean = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  const pairs = [];
  let i = 0;
  while (i < clean.length) {
    const a = clean[i];
    const b = i + 1 < clean.length ? clean[i + 1] : "X";
    if (a === b) {
      pairs.push([a, "X"]);
      i++;
    } else {
      pairs.push([a, b]);
      i += 2;
    }
  }
  return pairs;
}

/**
 * Encrypts text using Playfair cipher
 * @param {string} text
 * @param {string} keyword
 * @returns {string}
 */
export function encryptPlayfair(text, keyword) {
  const square = buildKeySquare(keyword || "KEYWORD");
  return prepareText(text)
    .map(([a, b]) => {
      const pa = getPos(square, a);
      const pb = getPos(square, b);
      if (pa.row === pb.row) {
        return square[pa.row * 5 + ((pa.col + 1) % 5)] + square[pb.row * 5 + ((pb.col + 1) % 5)];
      } else if (pa.col === pb.col) {
        return square[((pa.row + 1) % 5) * 5 + pa.col] + square[((pb.row + 1) % 5) * 5 + pb.col];
      } else {
        return square[pa.row * 5 + pb.col] + square[pb.row * 5 + pa.col];
      }
    })
    .join("");
}

/**
 * Decrypts text using Playfair cipher
 * @param {string} text
 * @param {string} keyword
 * @returns {string}
 */
export function decryptPlayfair(text, keyword) {
  const square = buildKeySquare(keyword || "KEYWORD");
  const clean = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  const pairs = [];
  for (let i = 0; i < clean.length; i += 2) {
    pairs.push([clean[i], clean[i + 1] || "X"]);
  }
  return pairs
    .map(([a, b]) => {
      const pa = getPos(square, a);
      const pb = getPos(square, b);
      if (pa.row === pb.row) {
        return square[pa.row * 5 + ((pa.col + 4) % 5)] + square[pb.row * 5 + ((pb.col + 4) % 5)];
      } else if (pa.col === pb.col) {
        return square[((pa.row + 4) % 5) * 5 + pa.col] + square[((pb.row + 4) % 5) * 5 + pb.col];
      } else {
        return square[pa.row * 5 + pb.col] + square[pb.row * 5 + pa.col];
      }
    })
    .join("");
}
