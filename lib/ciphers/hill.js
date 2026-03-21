/**
 * Finds the modular multiplicative inverse of a modulo 26
 * @param {number} a 
 * @returns {number}
 */
function modInverse(a) {
  a = ((a % 26) + 26) % 26;
  for (let x = 1; x < 26; x++) {
    if ((a * x) % 26 === 1) return x;
  }
  return -1; // -1 indicates no inverse exists
}

/**
 * Calculates determinant of an NxN matrix mod 26
 */
function getDeterminant(matrix) {
  const n = matrix.length;
  if (n === 2) {
    return (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % 26;
  }
  if (n === 3) {
    return (
      matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
      matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
      matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
    ) % 26;
  }
  return 0; // Fallback
}

/**
 * Calculates the adjugate matrix and returns inverse matrix mod 26
 */
function getInverseMatrix(key) {
  const n = key.length;
  let det = getDeterminant(key);
  det = ((det % 26) + 26) % 26;
  const detInv = modInverse(det);
  if (detInv === -1) return null; // Uninvertible

  if (n === 2) {
    return [
      [((key[1][1] * detInv) % 26 + 26) % 26, ((-key[0][1] * detInv) % 26 + 26) % 26],
      [((-key[1][0] * detInv) % 26 + 26) % 26, ((key[0][0] * detInv) % 26 + 26) % 26]
    ];
  }
  if (n === 3) {
    // Cofactors for 3x3
    const c00 = (key[1][1] * key[2][2] - key[1][2] * key[2][1]) % 26;
    const c01 = -(key[1][0] * key[2][2] - key[1][2] * key[2][0]) % 26;
    const c02 = (key[1][0] * key[2][1] - key[1][1] * key[2][0]) % 26;
    
    const c10 = -(key[0][1] * key[2][2] - key[0][2] * key[2][1]) % 26;
    const c11 = (key[0][0] * key[2][2] - key[0][2] * key[2][0]) % 26;
    const c12 = -(key[0][0] * key[2][1] - key[0][1] * key[2][0]) % 26;
    
    const c20 = (key[0][1] * key[1][2] - key[0][2] * key[1][1]) % 26;
    const c21 = -(key[0][0] * key[1][2] - key[0][2] * key[1][0]) % 26;
    const c22 = (key[0][0] * key[1][1] - key[0][1] * key[1][0]) % 26;

    // Adjugate is transpose of cofactor matrix, multiplied by detInv
    return [
      [ ((c00 * detInv) % 26 + 26) % 26, ((c10 * detInv) % 26 + 26) % 26, ((c20 * detInv) % 26 + 26) % 26 ],
      [ ((c01 * detInv) % 26 + 26) % 26, ((c11 * detInv) % 26 + 26) % 26, ((c21 * detInv) % 26 + 26) % 26 ],
      [ ((c02 * detInv) % 26 + 26) % 26, ((c12 * detInv) % 26 + 26) % 26, ((c22 * detInv) % 26 + 26) % 26 ]
    ];
  }
  return null;
}

/**
 * Parses numeric key input into N x N matrix (e.g. "9 4 5 7" -> [[9,4],[5,7]])
 */
export function parseHillKey(keyString) {
  if (Array.isArray(keyString)) return keyString; 

  const nums = String(keyString).split(/[\s,]+/).map(n => parseInt(n, 10)).filter(n => !isNaN(n));
  if (nums.length === 9) {
    return [
      [nums[0], nums[1], nums[2]],
      [nums[3], nums[4], nums[5]],
      [nums[6], nums[7], nums[8]]
    ];
  }
  // Default fallback 2x2
  if (nums.length >= 4) {
    return [[nums[0], nums[1]], [nums[2], nums[3]]];
  }
  return [[9, 4], [5, 7]];
}

/**
 * Encrypts text using Hill cipher
 * @param {string} text 
 * @param {string|number[][]} rawKey
 * @returns {string}
 */
export function encryptHill(text, rawKey) {
  let key = parseHillKey(rawKey);
  const n = key.length;

  const letters = text.toUpperCase().replace(/[^A-Z]/g, "");
  let paddedLetters = letters;
  while (paddedLetters.length % n !== 0) {
    paddedLetters += "X"; // Pad uniformly with X to ensure vector bounds
  }

  let result = "";
  for (let i = 0; i < paddedLetters.length; i += n) {
    const vector = [];
    for (let j = 0; j < n; j++) {
      vector.push(paddedLetters.charCodeAt(i + j) - 65);
    }

    for (let row = 0; row < n; row++) {
      let sum = 0;
      for (let col = 0; col < n; col++) {
        sum += key[row][col] * vector[col];
      }
      result += String.fromCharCode(((sum % 26) + 26) % 26 + 65);
    }
  }

  return result;
}

/**
 * Decrypts text using Hill cipher
 * @param {string} text 
 * @param {string|number[][]} rawKey
 * @returns {string}
 */
export function decryptHill(text, rawKey) {
  let key = parseHillKey(rawKey);
  const invKey = getInverseMatrix(key);
  if (!invKey) return "INVALID KEY MATRIX (Det must be coprime to 26)";

  return encryptHill(text, invKey);
}

/**
 * Returns a step-by-step breakdown of the Hill cipher transformation.
 */
export function getHillSteps(text, rawKey, mode = "encrypt") {
  let key = parseHillKey(rawKey);
  if (!text) return { error: "No text provided" };

  const n = key.length;
  let det = getDeterminant(key);
  det = ((det % 26) + 26) % 26;
  const detInv = modInverse(det);

  let currentKey = key;
  if (mode === "decrypt") {
    currentKey = getInverseMatrix(key);
    if (!currentKey) return { 
      error: "Matrix Determinant is not coprime to 26. Inversion is mathematically impossible.",
      matrixSize: n, originalKey: key
    };
  }

  const letters = text.toUpperCase().replace(/[^A-Z]/g, "");
  let paddedLetters = letters;
  while (paddedLetters.length % n !== 0) {
    paddedLetters += "X";
  }

  const steps = [];
  for (let i = 0; i < paddedLetters.length; i += n) {
    const pVec = [];
    for (let j = 0; j < n; j++) pVec.push(paddedLetters.charCodeAt(i + j) - 65);

    const cVec = [];
    const charPairIn = [];
    const charPairOut = [];
    const formulas = [];

    for (let row = 0; row < n; row++) {
      let sum = 0;
      let formulaParts = [];
      for (let col = 0; col < n; col++) {
        sum += currentKey[row][col] * pVec[col];
        formulaParts.push(`${currentKey[row][col]}*${Math.abs(pVec[col])}`);
      }
      const val = ((sum % 26) + 26) % 26;
      cVec.push(val);
      charPairIn.push(paddedLetters[i + row]);
      charPairOut.push(String.fromCharCode(val + 65));
      formulas.push(formulaParts.join(" + "));
    }

    steps.push({
      index: i,
      inputChars: charPairIn,
      inputVec: pVec,
      outputChars: charPairOut,
      outputVec: cVec,
      formulas: formulas
    });
  }

  return {
    matrixSize: n,
    originalKey: key,
    operatingKey: currentKey,
    mode,
    determinant: det,
    determinantInverse: detInv,
    steps,
  };
}
