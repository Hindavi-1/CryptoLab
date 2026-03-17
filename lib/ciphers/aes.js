/**
 * Simplified AES demo implementation
 * This is for demonstration purposes only and is not secure.
 */

const SBOX = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76];
const INV_SBOX = [0x09, 0x01, 0x0b, 0x07, 0x08, 0x0d, 0x0f, 0x0e, 0x04, 0x00, 0x0a, 0x02, 0x0c, 0x03, 0x05, 0x06];

/**
 * Encrypts text using simplified AES demo
 * @param {string} text 
 * @param {string} key 
 * @returns {string}
 */
export function encryptAES(text, key) {
  return text
    .split("")
    .map((char) => {
      const charCode = char.charCodeAt(0);
      const substituted = SBOX[charCode % 16];
      const mixed = (substituted ^ key.charCodeAt(0)) % 256;
      return String.fromCharCode(mixed);
    })
    .join("");
}

/**
 * Decrypts text using simplified AES demo
 * @param {string} text 
 * @param {string} key 
 * @returns {string}
 */
export function decryptAES(text, key) {
  return text
    .split("")
    .map((char) => {
      const charCode = char.charCodeAt(0);
      const mixed = (charCode ^ key.charCodeAt(0)) % 256;
      const substituted = INV_SBOX[mixed % 16];
      return String.fromCharCode(substituted);
    })
    .join("");
}

/**
 * Returns a step-by-step breakdown of the AES demo transformation.
 */
export function getAESSteps(text, key, mode = "encrypt") {
  return text.split("").map((char, index) => {
    const outputChar = mode === "encrypt" ? encryptAES(char, key) : decryptAES(char, key);
    return {
      index,
      input: char,
      output: outputChar,
      formula: `${mode === "encrypt" ? "S-Box → AddRoundKey" : "InvAddRoundKey → InvS-Box"}`
    };
  });
}
