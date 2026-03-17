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

/**
 * Returns a step-by-step breakdown of the Caesar cipher transformation.
 * Each step describes what happens to one character.
 *
 * @param {string} text  - Input text
 * @param {number} shift - Shift value (0–25)
 * @param {"encrypt"|"decrypt"} mode
 * @returns {Array<{
 *   index: number,
 *   input: string,
 *   output: string,
 *   type: "upper"|"lower"|"passthrough",
 *   inputCode: number|null,
 *   outputCode: number|null,
 *   base: number|null,
 *   effectiveShift: number,
 *   formula: string,
 * }>}
 */
export function getCaesarSteps(text, shift, mode = "encrypt") {
  const s = ((shift % 26) + 26) % 26;
  const effectiveShift = mode === "encrypt" ? s : ((26 - s) % 26);

  return text.split("").map((char, index) => {
    const isUpper = char >= "A" && char <= "Z";
    const isLower = char >= "a" && char <= "z";

    if (!isUpper && !isLower) {
      return {
        index,
        input: char,
        output: char,
        type: "passthrough",
        inputCode: null,
        outputCode: null,
        base: null,
        effectiveShift,
        formula: "non-alpha → unchanged",
      };
    }

    const base = isUpper ? 65 : 97;
    const inputCode = char.charCodeAt(0) - base;
    const outputCode = (inputCode + effectiveShift) % 26;
    const outputChar = String.fromCharCode(outputCode + base);
    const type = isUpper ? "upper" : "lower";
    const inputLabel = isUpper ? char : char.toUpperCase();
    const outputLabel = isUpper ? outputChar : outputChar.toUpperCase();

    const formula =
      mode === "encrypt"
        ? `(${inputLabel}[${inputCode}] + ${effectiveShift}) mod 26 = ${outputLabel}[${outputCode}]`
        : `(${inputLabel}[${inputCode}] − ${s} + 26) mod 26 = ${outputLabel}[${outputCode}]`;

    return {
      index,
      input: char,
      output: outputChar,
      type,
      inputCode,
      outputCode,
      base,
      effectiveShift,
      formula,
    };
  });
}
