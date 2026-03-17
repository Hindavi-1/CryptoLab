/**
 * Simplified DES demo implementation
 * This is for demonstration purposes only and is not secure.
 */

const IP = [2, 6, 3, 1, 4, 8, 5, 7]; // Initial Permutation
const FP = [4, 1, 3, 5, 7, 2, 6, 8]; // Final Permutation

/**
 * Encrypts text using simplified DES demo
 * @param {string} text 
 * @param {string} key 
 * @returns {string}
 */
export function encryptDES(text, key) {
  // Simplified: treat each 8-bit block as a unit for demonstration
  return text
    .split("")
    .map((char) => {
      const charCode = char.charCodeAt(0);
      const permuted = permute(charCode, IP);
      const substituted = (permuted ^ key.charCodeAt(0)) % 256;
      const final = permute(substituted, FP);
      return String.fromCharCode(final);
    })
    .join("");
}

/**
 * Decrypts text using simplified DES demo
 * @param {string} text 
 * @param {string} key 
 * @returns {string}
 */
export function decryptDES(text, key) {
  const invFP = invertPermutation(FP);
  const invIP = invertPermutation(IP);

  return text
    .split("")
    .map((char) => {
      const charCode = char.charCodeAt(0);
      const permuted = permute(charCode, invFP);
      const substituted = (permuted ^ key.charCodeAt(0)) % 256;
      const final = permute(substituted, invIP);
      return String.fromCharCode(final);
    })
    .join("");
}

function permute(byte, table) {
  let result = 0;
  for (let i = 0; i < table.length; i++) {
    const bit = (byte >> (8 - table[i])) & 1;
    result |= (bit << (7 - i));
  }
  return result;
}

function invertPermutation(table) {
  const result = new Array(8);
  for (let i = 0; i < table.length; i++) {
    result[table[i] - 1] = i + 1;
  }
  return result;
}

/**
 * Returns a step-by-step breakdown of the DES demo transformation.
 */
export function getDESSteps(text, key, mode = "encrypt") {
  return text.split("").map((char, index) => {
    const charCode = char.charCodeAt(0);
    const outputChar = mode === "encrypt" ? encryptDES(char, key) : decryptDES(char, key);
    return {
      index,
      input: char,
      output: outputChar,
      formula: `${mode === "encrypt" ? "IP → XOR → FP" : "FP⁻¹ → XOR → IP⁻¹"}`
    };
  });
}
