import CryptoJS from "crypto-js";

/**
 * Hashes text using SHA-256
 * @param {string} text 
 * @returns {string}
 */
export function hashSHA256(text) {
  return CryptoJS.SHA256(text).toString();
}

/**
 * Hashes cannot be decrypted
 * @param {string} text 
 * @returns {string}
 */
export function decryptSHA256(text) {
  return "⚠ Hashes are one-way functions and cannot be decrypted.";
}

/**
 * Returns a step-by-step breakdown of the SHA-256 transformation.
 */
export function getSHA256Steps(text) {
  return [{
    index: 0,
    input: text,
    output: hashSHA256(text),
    formula: "SHA-256 Hashing Algorithm"
  }];
}
