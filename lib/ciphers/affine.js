/**
 * Checks if a number is coprime with 26
 * @param {number} a 
 * @returns {boolean}
 */
function isCoprime(a) {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  return gcd(a, 26) === 1;
}

/**
 * Finds the modular multiplicative inverse of a modulo 26
 * @param {number} a 
 * @returns {number}
 */
function modInverse(a) {
  a = ((a % 26) + 26) % 26;
  for (let x = 1; x < 26; x++) {
    if ((a * x) % 26 === 1) {
      return x;
    }
  }
  return 1;
}

/**
 * Encrypts text using Affine cipher
 * @param {string} text 
 * @param {Object} key - { a: number, b: number }
 * @returns {string}
 */
export function encryptAffine(text, key) {
  const { a, b } = key;
  if (!isCoprime(a)) {
    throw new Error("Key 'a' must be coprime with 26.");
  }

  return text
    .split("")
    .map((char) => {
      if (char >= "A" && char <= "Z") {
        const x = char.charCodeAt(0) - 65;
        return String.fromCharCode(((a * x + b) % 26 + 26) % 26 + 65);
      }
      if (char >= "a" && char <= "z") {
        const x = char.charCodeAt(0) - 97;
        return String.fromCharCode(((a * x + b) % 26 + 26) % 26 + 97);
      }
      return char;
    })
    .join("");
}

/**
 * Decrypts text using Affine cipher
 * @param {string} text 
 * @param {Object} key - { a: number, b: number }
 * @returns {string}
 */
export function decryptAffine(text, key) {
  const { a, b } = key;
  if (!isCoprime(a)) {
    throw new Error("Key 'a' must be coprime with 26.");
  }

  const aInv = modInverse(a);

  return text
    .split("")
    .map((char) => {
      if (char >= "A" && char <= "Z") {
        const y = char.charCodeAt(0) - 65;
        return String.fromCharCode(((aInv * (y - b)) % 26 + 26) % 26 + 65);
      }
      if (char >= "a" && char <= "z") {
        const y = char.charCodeAt(0) - 97;
        return String.fromCharCode(((aInv * (y - b)) % 26 + 26) % 26 + 97);
      }
      return char;
    })
    .join("");
}

/**
 * Returns a step-by-step breakdown of the Affine cipher transformation.
 */
export function getAffineSteps(text, key, mode = "encrypt") {
  const { a, b } = key;
  const aInv = modInverse(a);

  return text.split("").map((char, index) => {
    const isUpper = char >= "A" && char <= "Z";
    const isLower = char >= "a" && char <= "z";

    if (!isUpper && !isLower) {
      return {
        index,
        input: char,
        output: char,
        type: "passthrough",
        formula: "non-alpha → unchanged",
      };
    }

    const base = isUpper ? 65 : 97;
    const x = char.charCodeAt(0) - base;
    let outputCode, formula;

    if (mode === "encrypt") {
      outputCode = ((a * x + b) % 26 + 26) % 26;
      formula = `(${a} * ${x} + ${b}) mod 26 = ${outputCode}`;
    } else {
      outputCode = ((aInv * (x - b)) % 26 + 26) % 26;
      formula = `${aInv} * (${x} - ${b}) mod 26 = ${outputCode}`;
    }

    const outputChar = String.fromCharCode(outputCode + base);

    return {
      index,
      input: char,
      output: outputChar,
      type: isUpper ? "upper" : "lower",
      formula,
    };
  });
}
