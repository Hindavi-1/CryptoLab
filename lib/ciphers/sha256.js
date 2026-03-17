/**
 * Simplified SHA-256 demo implementation
 * This is for demonstration purposes only and is not secure.
 */

/**
 * Calculates a simplified SHA-256 hash
 * @param {string} text 
 * @returns {string}
 */
export function hashSHA256(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 7) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

/**
 * SHA-256 is a hash function, it doesn't have decryption.
 */
export function decryptSHA256(text) {
  return "Decryption not possible for hash functions.";
}

/**
 * Returns a step-by-step breakdown of the SHA-256 hash process.
 */
export function getSHA256Steps(text) {
  return text.split("").map((char, index) => {
    return {
      index,
      input: char,
      output: hashSHA256(text.substring(0, index + 1)),
      formula: `Updating hash with ${char}`
    };
  });
}
