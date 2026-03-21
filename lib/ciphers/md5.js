import CryptoJS from "crypto-js";

/**
 * Hashes text using MD5
 * @param {string} text 
 * @returns {string}
 */
export function hashMD5(text) {
  return CryptoJS.MD5(text).toString();
}

/**
 * Hashes cannot be decrypted
 * @param {string} text 
 * @returns {string}
 */
export function decryptMD5(text) {
  return "⚠ Hashes are one-way functions and cannot be decrypted.";
}

/**
 * Returns a step-by-step breakdown of the MD5 transformation.
 */
export function getMD5Steps(text) {
  return [{
    index: 0,
    input: text,
    output: hashMD5(text),
    formula: "MD5 Hashing Algorithm"
  }];
}
