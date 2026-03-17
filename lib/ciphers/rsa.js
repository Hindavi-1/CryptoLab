/**
 * RSA demo implementation
 * This is for demonstration purposes only and is not secure.
 */

/**
 * Calculates (base^exp) % mod
 * @param {bigint} base 
 * @param {bigint} exp 
 * @param {bigint} mod 
 * @returns {bigint}
 */
function power(base, exp, mod) {
  let res = BigInt(1);
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) res = (res * base) % mod;
    base = (base * base) % mod;
    exp = exp / 2n;
  }
  return res;
}

/**
 * Encrypts text using RSA demo
 * @param {string} text 
 * @param {Object} publicKey - { e: bigint, n: bigint }
 * @returns {string}
 */
export function encryptRSA(text, publicKey) {
  const { e, n } = publicKey;
  return text
    .split("")
    .map((char) => {
      const m = BigInt(char.charCodeAt(0));
      const c = power(m, e, n);
      return c.toString();
    })
    .join(" ");
}

/**
 * Decrypts text using RSA demo
 * @param {string} text 
 * @param {Object} privateKey - { d: bigint, n: bigint }
 * @returns {string}
 */
export function decryptRSA(text, privateKey) {
  const { d, n } = privateKey;
  return text
    .split(" ")
    .map((cStr) => {
      const c = BigInt(cStr);
      const m = power(c, d, n);
      return String.fromCharCode(Number(m));
    })
    .join("");
}

/**
 * Generates RSA keys
 * @returns {Object} { publicKey: { e: bigint, n: bigint }, privateKey: { d: bigint, n: bigint } }
 */
export function generateRSAKeys() {
  const p = 61n;
  const q = 53n;
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  const e = 17n;
  const d = 2753n; // modInverse(e, phi)
  return { publicKey: { e, n }, privateKey: { d, n } };
}

/**
 * Returns a step-by-step breakdown of the RSA demo transformation.
 */
export function getRSASteps(text, key, mode = "encrypt") {
  const { e, d, n } = key;
  if (mode === "encrypt") {
    return text.split("").map((char, index) => {
      const m = BigInt(char.charCodeAt(0));
      const c = power(m, e, n);
      return {
        index,
        input: char,
        output: c.toString(),
        formula: `${m}^${e} mod ${n} = ${c}`
      };
    });
  } else {
    return text.split(" ").map((cStr, index) => {
      const c = BigInt(cStr);
      const m = power(c, d, n);
      return {
        index,
        input: cStr,
        output: String.fromCharCode(Number(m)),
        formula: `${c}^${d} mod ${n} = ${m}`
      };
    });
  }
}
