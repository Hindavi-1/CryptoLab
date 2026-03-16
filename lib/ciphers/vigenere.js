/**
 * Encrypts text using Vigenère cipher
 * @param {string} text - The plaintext to encrypt
 * @param {string} key - The keyword (letters only)
 * @returns {string} The encrypted ciphertext
 */
export function encryptVigenere(text, key) {
  if (!key || key.length === 0) return text;
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (cleanKey.length === 0) return text;
  let keyIndex = 0;
  return text
    .split("")
    .map((char) => {
      if (char >= "A" && char <= "Z") {
        const shift = cleanKey[keyIndex % cleanKey.length].charCodeAt(0) - 65;
        keyIndex++;
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      if (char >= "a" && char <= "z") {
        const shift = cleanKey[keyIndex % cleanKey.length].charCodeAt(0) - 65;
        keyIndex++;
        return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
      }
      return char;
    })
    .join("");
}

/**
 * Decrypts text using Vigenère cipher
 * @param {string} text - The ciphertext to decrypt
 * @param {string} key - The keyword (letters only)
 * @returns {string} The decrypted plaintext
 */
export function decryptVigenere(text, key) {
  if (!key || key.length === 0) return text;
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (cleanKey.length === 0) return text;
  let keyIndex = 0;
  return text
    .split("")
    .map((char) => {
      if (char >= "A" && char <= "Z") {
        const shift = cleanKey[keyIndex % cleanKey.length].charCodeAt(0) - 65;
        keyIndex++;
        return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
      }
      if (char >= "a" && char <= "z") {
        const shift = cleanKey[keyIndex % cleanKey.length].charCodeAt(0) - 65;
        keyIndex++;
        return String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
      }
      return char;
    })
    .join("");
}
