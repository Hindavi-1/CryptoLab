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

/**
 * Returns step-by-step data for each character in the Vigenère process.
 * @param {string} text
 * @param {string} key
 * @param {"encrypt"|"decrypt"} mode
 * @returns {Array<Object>}
 */
export function getVigenereSteps(text, key, mode = "encrypt") {
  const cleanKey = (key || "KEY").toUpperCase().replace(/[^A-Z]/g, "") || "KEY";
  const steps = [];
  let keyIndex = 0;

  text.split("").forEach((char, i) => {
    const upper = char.toUpperCase();
    if (upper >= "A" && upper <= "Z") {
      const keyLetter = cleanKey[keyIndex % cleanKey.length];
      const shift = keyLetter.charCodeAt(0) - 65;
      const plainCode = upper.charCodeAt(0) - 65;
      let cipherCode;
      let output;

      if (mode === "encrypt") {
        cipherCode = (plainCode + shift) % 26;
        output = String.fromCharCode(cipherCode + 65);
        steps.push({
          index: i,
          type: "alpha",
          input: upper,
          output,
          keyLetter,
          plainRow: plainCode,   // row index in vigenere table (key letter)
          keyCol: shift,         // column index in vigenere table (plain letter)
          inputCode: plainCode,
          outputCode: cipherCode,
          shift,
          formula: `(${plainCode} + ${shift}) mod 26 = ${cipherCode}`,
        });
      } else {
        // For decrypt: input is ciphertext letter
        cipherCode = plainCode; // re-use variable: the "plain" var holds ciphertext code
        const decCode = ((cipherCode - shift) + 26) % 26;
        output = String.fromCharCode(decCode + 65);
        steps.push({
          index: i,
          type: "alpha",
          input: upper,
          output,
          keyLetter,
          plainRow: shift,      // key letter row
          keyCol: cipherCode,   // cipher letter column
          inputCode: cipherCode,
          outputCode: decCode,
          shift,
          formula: `(${cipherCode} - ${shift} + 26) mod 26 = ${decCode}`,
        });
      }
      keyIndex++;
    } else {
      steps.push({
        index: i,
        type: "passthrough",
        input: char,
        output: char,
      });
    }
  });

  return steps;
}
