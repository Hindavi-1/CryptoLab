import CryptoJS from "crypto-js";

/**
 * Encrypts text using AES
 * @param {string} text 
 * @param {string} key 
 * @returns {string}
 */
export function encryptAES(text, key) {
  if (!key) return text;
  return CryptoJS.AES.encrypt(text, key).toString();
}

/**
 * Decrypts text using AES
 * @param {string} text 
 * @param {string} key 
 * @returns {string}
 */
export function decryptAES(text, key) {
  if (!key) return text;
  try {
    const bytes = CryptoJS.AES.decrypt(text, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || "⚠ Invalid Key or Corrupted Data";
  } catch (e) {
    return "⚠ Error Decrypting (Check Key)";
  }
}

/**
 * Returns a step-by-step breakdown of the AES transformation.
 */
export function getAESSteps(text, key, mode = "encrypt") {
  return [{
    index: 0,
    input: text,
    output: mode === "encrypt" ? encryptAES(text, key) : decryptAES(text, key),
    formula: "AES (Advanced Encryption Standard)"
  }];
}
