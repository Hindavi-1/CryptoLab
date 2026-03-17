/**
 * Finds the modular multiplicative inverse of a modulo 26
 * @param {number} a 
 * @returns {number}
 */
function modInverse(a) {
  a = ((a % 26) + 26) % 26;
  for (let x = 1; x < 26; x++) {
    if ((a * x) % 26 === 1) {
      return x;
    }
  }
  return 1;
}

/**
 * Encrypts text using Hill cipher
 * @param {string} text 
 * @param {number[][]} key - 2x2 matrix
 * @returns {string}
 */
export function encryptHill(text, key) {
  const letters = text.toUpperCase().replace(/[^A-Z]/g, "");
  let paddedLetters = letters;
  if (letters.length % 2 !== 0) {
    paddedLetters += "X";
  }

  let result = "";
  for (let i = 0; i < paddedLetters.length; i += 2) {
    const p1 = paddedLetters.charCodeAt(i) - 65;
    const p2 = paddedLetters.charCodeAt(i + 1) - 65;

    const c1 = (key[0][0] * p1 + key[0][1] * p2) % 26;
    const c2 = (key[1][0] * p1 + key[1][1] * p2) % 26;

    result += String.fromCharCode(c1 + 65);
    result += String.fromCharCode(c2 + 65);
  }

  return result;
}

/**
 * Decrypts text using Hill cipher
 * @param {string} text 
 * @param {number[][]} key - 2x2 matrix
 * @returns {string}
 */
export function decryptHill(text, key) {
  const det = (key[0][0] * key[1][1] - key[0][1] * key[1][0]) % 26;
  const detInv = modInverse(det);

  const adj = [
    [key[1][1], -key[0][1]],
    [-key[1][0], key[0][0]]
  ];

  const invKey = [
    [((adj[0][0] * detInv) % 26 + 26) % 26, ((adj[0][1] * detInv) % 26 + 26) % 26],
    [((adj[1][0] * detInv) % 26 + 26) % 26, ((adj[1][1] * detInv) % 26 + 26) % 26]
  ];

  return encryptHill(text, invKey);
}

/**
 * Returns a step-by-step breakdown of the Hill cipher transformation.
 */
export function getHillSteps(text, key, mode = "encrypt") {
  const letters = text.toUpperCase().replace(/[^A-Z]/g, "");
  let paddedLetters = letters;
  if (letters.length % 2 !== 0) {
    paddedLetters += "X";
  }

  let currentKey = key;
  if (mode === "decrypt") {
    const det = (key[0][0] * key[1][1] - key[0][1] * key[1][0]) % 26;
    const detInv = modInverse(det);
    const adj = [
      [key[1][1], -key[0][1]],
      [-key[1][0], key[0][0]]
    ];
    currentKey = [
      [((adj[0][0] * detInv) % 26 + 26) % 26, ((adj[0][1] * detInv) % 26 + 26) % 26],
      [((adj[1][0] * detInv) % 26 + 26) % 26, ((adj[1][1] * detInv) % 26 + 26) % 26]
    ];
  }

  const steps = [];
  for (let i = 0; i < paddedLetters.length; i += 2) {
    const p1 = paddedLetters.charCodeAt(i) - 65;
    const p2 = paddedLetters.charCodeAt(i + 1) - 65;

    const c1 = (currentKey[0][0] * p1 + currentKey[0][1] * p2) % 26;
    const c2 = (currentKey[1][0] * p1 + currentKey[1][1] * p2) % 26;

    steps.push({
      index: i,
      input: paddedLetters[i] + paddedLetters[i+1],
      output: String.fromCharCode(c1 + 65) + String.fromCharCode(c2 + 65),
      formula: `[${currentKey[0][0]} ${currentKey[0][1]}; ${currentKey[1][0]} ${currentKey[1][1]}] * [${p1}; ${p2}] = [${c1}; ${c2}]`
    });
  }

  return steps;
}
