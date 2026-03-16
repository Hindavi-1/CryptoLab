/**
 * Encrypts text using Caesar cipher
 * @param {string} text - The plaintext to encrypt
 * @param {number} shift - The number of positions to shift (0-25)
 * @returns {string} The encrypted ciphertext
 */
export function encryptCaesar(text, shift) {
  const s = ((shift % 26) + 26) % 26;
  return text
    .split("")
    .map((char) => {
      if (char >= "A" && char <= "Z") {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + s) % 26) + 65);
      }
      if (char >= "a" && char <= "z") {
        return String.fromCharCode(((char.charCodeAt(0) - 97 + s) % 26) + 97);
      }
      return char;
    })
    .join("");
}

/**
 * Decrypts text using Caesar cipher
 * @param {string} text - The ciphertext to decrypt
 * @param {number} shift - The number of positions to shift (0-25)
 * @returns {string} The decrypted plaintext
 */
export function decryptCaesar(text, shift) {
  return encryptCaesar(text, 26 - ((shift % 26 + 26) % 26));
}
