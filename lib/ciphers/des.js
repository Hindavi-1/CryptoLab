import CryptoJS from "crypto-js";

/**
 * Encrypts text using DES
 * @param {string} text 
 * @param {string} key 
 * @returns {string}
 */
export function encryptDES(text, key) {
  if (!key) return text;
  return CryptoJS.DES.encrypt(text, key).toString();
}

/**
 * Decrypts text using DES
 * @param {string} text 
 * @param {string} key 
 * @returns {string}
 */
export function decryptDES(text, key) {
  if (!key) return text;
  try {
    const bytes = CryptoJS.DES.decrypt(text, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || "⚠ Invalid Key or Corrupted Data";
  } catch (e) {
    return "⚠ Error Decrypting (Check Key)";
  }
}

/**
 * Returns a step-by-step breakdown of the DES transformation.
 */
export function getDESSteps(text, key, mode = "encrypt") {
  return [{
    index: 0,
    input: text,
    output: mode === "encrypt" ? encryptDES(text, key) : decryptDES(text, key),
    formula: "DES (Data Encryption Standard)"
  }];
}
