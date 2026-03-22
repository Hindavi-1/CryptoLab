/**
 * Columnar transposition cipher (classical keyed columnar).
 * Plaintext is written in rows under the keyword, then read column-by-column
 * in order of increasing key symbol (ties: left-to-right).
 * Keywords may be letters A–Z and/or digits 0–9; digits sort before letters (0–9 then A–Z).
 */

/** Sort value for one key character: digits 0–9 by numeric order, then A–Z. */
function keySymbolRank(ch) {
  if (ch >= "0" && ch <= "9") return ch.charCodeAt(0) - 48;
  if (ch >= "A" && ch <= "Z") return 100 + (ch.charCodeAt(0) - 65);
  return 200;
}

export function normalizeKeyword(key) {
  const k = String(key ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  if (!k.length) {
    throw new Error("Keyword must contain at least one letter or digit (A–Z, 0–9).");
  }
  return k;
}

function normalizePad(padChar) {
  const p = String(padChar ?? "X").toUpperCase().replace(/[^A-Z]/g, "");
  return p[0] || "X";
}

export function normalizePlaintextForColumnar(text) {
  return String(text ?? "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

/**
 * Physical column indices in the order columns are read during encryption.
 */
export function getColumnReadOrder(keyword) {
  const k = normalizeKeyword(keyword);
  const indices = Array.from({ length: k.length }, (_, i) => i);
  indices.sort((a, b) => {
    const ra = keySymbolRank(k[a]);
    const rb = keySymbolRank(k[b]);
    if (ra !== rb) return ra - rb;
    return a - b;
  });
  return indices;
}

/**
 * Rank 1..n for each physical column (for header labels).
 */
export function getColumnRanks(keyword) {
  const k = normalizeKeyword(keyword);
  const order = getColumnReadOrder(k);
  const ranks = new Array(k.length);
  order.forEach((physCol, i) => {
    ranks[physCol] = i + 1;
  });
  return ranks;
}

/**
 * @param {string} key - "KEYWORD" or "KEYWORD|Z" for custom padding letter
 */
export function parseColumnarKey(key) {
  const raw = String(key ?? "").trim();
  if (!raw) {
    return { keyword: "KEYWORD", pad: "X" };
  }
  const pipe = raw.indexOf("|");
  if (pipe >= 0) {
    const keywordPart = raw.slice(0, pipe).trim();
    const padPart = raw.slice(pipe + 1).trim();
    return {
      keyword: keywordPart || "KEYWORD",
      pad: normalizePad(padPart),
    };
  }
  return { keyword: raw, pad: "X" };
}

export function encryptColumnar(text, keyword, padChar = "X") {
  const k = normalizeKeyword(keyword);
  const pad = normalizePad(padChar);
  const plain = normalizePlaintextForColumnar(text);
  if (!plain.length) {
    throw new Error("Plaintext must contain at least one letter (A–Z). Spaces and punctuation are ignored.");
  }
  const nCols = k.length;
  const nRows = Math.ceil(plain.length / nCols);
  const total = nRows * nCols;
  const padded = plain + pad.repeat(total - plain.length);
  const order = getColumnReadOrder(k);

  const grid = [];
  for (let r = 0; r < nRows; r++) {
    const row = [];
    for (let c = 0; c < nCols; c++) {
      row.push(padded[r * nCols + c]);
    }
    grid.push(row);
  }

  let cipher = "";
  for (const col of order) {
    for (let r = 0; r < nRows; r++) {
      cipher += grid[r][col];
    }
  }
  return cipher;
}

export function decryptColumnar(text, keyword, padChar = "X") {
  const k = normalizeKeyword(keyword);
  const pad = normalizePad(padChar);
  const ct = normalizePlaintextForColumnar(text);
  if (!ct.length) {
    throw new Error("Ciphertext must contain at least one letter (A–Z).");
  }
  const nCols = k.length;
  const nRows = Math.ceil(ct.length / nCols);
  if (nRows * nCols !== ct.length) {
    throw new Error(
      `Ciphertext length (${ct.length}) must be a multiple of keyword length (${nCols}) after removing non-letters.`
    );
  }
  const order = getColumnReadOrder(k);
  const grid = Array.from({ length: nRows }, () => new Array(nCols).fill(""));
  let pos = 0;
  for (const col of order) {
    for (let r = 0; r < nRows; r++) {
      grid[r][col] = ct[pos++];
    }
  }
  let plain = "";
  for (let r = 0; r < nRows; r++) {
    for (let c = 0; c < nCols; c++) {
      plain += grid[r][c];
    }
  }
  let end = plain.length;
  while (end > 0 && plain[end - 1] === pad) end--;
  return plain.slice(0, end);
}

/**
 * Full trace for UI: grid, read order, per-column strings, etc.
 */
export function buildColumnarTrace(input, keyword, padChar, mode) {
  const k = normalizeKeyword(keyword);
  const pad = normalizePad(padChar);
  const ranks = getColumnRanks(k);
  const order = getColumnReadOrder(k);

  if (mode === "encrypt") {
    const plain = normalizePlaintextForColumnar(input);
    if (!plain.length) {
      throw new Error("Plaintext must contain at least one letter (A–Z).");
    }
    const nCols = k.length;
    const nRows = Math.ceil(plain.length / nCols);
    const total = nRows * nCols;
    const padded = plain + pad.repeat(total - plain.length);
    const grid = [];
    for (let r = 0; r < nRows; r++) {
      const row = [];
      for (let c = 0; c < nCols; c++) {
        row.push(padded[r * nCols + c]);
      }
      grid.push(row);
    }
    const columnStrings = order.map((col) => {
      let s = "";
      for (let r = 0; r < nRows; r++) s += grid[r][col];
      return s;
    });
    const ciphertext = encryptColumnar(input, keyword, pad);
    return {
      mode: "encrypt",
      keyword: k,
      ranks,
      readOrder: order,
      grid,
      paddedPlain: padded,
      padChar: pad,
      ciphertext,
      columnStrings,
      nRows,
      nCols,
    };
  }

  const ct = normalizePlaintextForColumnar(input);
  if (!ct.length) {
    throw new Error("Ciphertext must contain at least one letter (A–Z).");
  }
  const nCols = k.length;
  const nRows = Math.ceil(ct.length / nCols);
  if (nRows * nCols !== ct.length) {
    throw new Error(
      `Ciphertext length (${ct.length}) must be a multiple of keyword length (${nCols}).`
    );
  }
  const grid = Array.from({ length: nRows }, () => new Array(nCols).fill(""));
  let pos = 0;
  for (const col of order) {
    for (let r = 0; r < nRows; r++) {
      grid[r][col] = ct[pos++];
    }
  }
  const columnStrings = order.map((col) => {
    let s = "";
    for (let r = 0; r < nRows; r++) s += grid[r][col];
    return s;
  });
  let rowMajor = "";
  for (let r = 0; r < nRows; r++) {
    for (let c = 0; c < nCols; c++) {
      rowMajor += grid[r][c];
    }
  }
  const plaintext = decryptColumnar(input, keyword, pad);
  return {
    mode: "decrypt",
    keyword: k,
    ranks,
    readOrder: order,
    grid,
    paddedPlain: rowMajor,
    padChar: pad,
    ciphertext: ct,
    plaintext,
    columnStrings,
    nRows,
    nCols,
  };
}
