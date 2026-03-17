/**
 * Simplified MD5 demo implementation
 * This is for demonstration purposes only and is not secure.
 */

/**
 * Calculates a simplified MD5 hash
 * @param {string} text 
 * @returns {string}
 */
export function hashMD5(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

/**
 * MD5 is a hash function, it doesn't have decryption.
 */
export function decryptMD5(text) {
  return "Decryption not possible for hash functions.";
}

/**
 * Returns a step-by-step breakdown of the MD5 hash process.
 */
export function getMD5Steps(text) {
  return text.split("").map((char, index) => {
    return {
      index,
      input: char,
      output: hashMD5(text.substring(0, index + 1)),
      formula: `Updating hash with ${char}`
    };
  });
}
