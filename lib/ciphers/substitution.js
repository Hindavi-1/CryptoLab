/**
 * Encrypts text using Simple Substitution cipher
 * @param {string} text 
 * @param {string} key - A string of 26 characters representing the alphabet mapping
 * @returns {string}
 */
export function encryptSubstitution(text, key) {
  if (key.length !== 26) {
    throw new Error("Key must be a string of 26 unique characters.");
  }
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const map = {};
  for (let i = 0; i < 26; i++) {
    map[alphabet[i]] = key[i].toUpperCase();
    map[alphabet[i].toLowerCase()] = key[i].toLowerCase();
  }

  return text
    .split("")
    .map((char) => map[char] || char)
    .join("");
}

/**
 * Decrypts text using Simple Substitution cipher
 * @param {string} text 
 * @param {string} key - A string of 26 characters representing the alphabet mapping
 * @returns {string}
 */
export function decryptSubstitution(text, key) {
  if (key.length !== 26) {
    throw new Error("Key must be a string of 26 unique characters.");
  }
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const reverseMap = {};
  for (let i = 0; i < 26; i++) {
    reverseMap[key[i].toUpperCase()] = alphabet[i];
    reverseMap[key[i].toLowerCase()] = alphabet[i].toLowerCase();
  }

  return text
    .split("")
    .map((char) => reverseMap[char] || char)
    .join("");
}

/**
 * Returns a step-by-step breakdown of the Simple Substitution cipher transformation.
 */
export function getSubstitutionSteps(text, key, mode = "encrypt") {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const map = {};
  const reverseMap = {};
  for (let i = 0; i < 26; i++) {
    map[alphabet[i]] = key[i].toUpperCase();
    map[alphabet[i].toLowerCase()] = key[i].toLowerCase();
    reverseMap[key[i].toUpperCase()] = alphabet[i];
    reverseMap[key[i].toLowerCase()] = alphabet[i].toLowerCase();
  }

  return text.split("").map((char, index) => {
    const outputChar = mode === "encrypt" ? map[char] || char : reverseMap[char] || char;
    return {
      index,
      input: char,
      output: outputChar,
      type: char >= "a" && char <= "z" ? "lower" : char >= "A" && char <= "Z" ? "upper" : "passthrough",
      formula: `${char} → ${outputChar}`
    };
  });
}
