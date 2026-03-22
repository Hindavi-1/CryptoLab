/**
 * Fast Modular Exponentiation: (base^exp) % mod
 * @param {bigint} base 
 * @param {bigint} exp 
 * @param {bigint} mod 
 * @returns {bigint}
 */
export function modPow(base, exp, mod) {
  if (mod === 1n) return 0n;
  let res = 1n;
  base = base % mod;
  if (base < 0n) base = (base % mod + mod) % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) res = (res * base) % mod;
    base = (base * base) % mod;
    exp /= 2n;
  }
  return res;
}

/**
 * Extended Euclidean Algorithm
 * Returns [gcd(a,b), x, y] such that a*x + b*y = gcd(a,b)
 */
export function extendedEuclid(a, b) {
  let old_r = a, r = b;
  let old_s = 1n, s = 0n;
  let old_t = 0n, t = 1n;
  
  while (r !== 0n) {
    let quotient = old_r / r;
    let temp_r = r;
    r = old_r - quotient * r;
    old_r = temp_r;
    
    let temp_s = s;
    s = old_s - quotient * s;
    old_s = temp_s;
    
    let temp_t = t;
    t = old_t - quotient * t;
    old_t = temp_t;
  }
  
  return [old_r, old_s, old_t];
}

/**
 * Modular Inverse: returns x such that (a * x) % m === 1
 */
export function modInverse(a, m) {
  if (a < 0n) a = (a % m + m) % m;
  const [g, x, y] = extendedEuclid(a, m);
  if (g !== 1n) {
    throw new Error("Modular inverse doesn't exist");
  }
  return (x % m + m) % m;
}

/**
 * Converts a string to an array of BigInt blocks.
 * Simple mapping for educational purposes: each char represents a block.
 */
export function textToBigInts(text) {
  return text.split("").map((char) => BigInt(char.charCodeAt(0)));
}

/**
 * Converts BigInt array back to a string.
 */
export function bigIntsToText(bigIntArr) {
  return bigIntArr.map(b => String.fromCharCode(Number(b))).join("");
}

/**
 * String to single BigInt (Chunking tool)
 * Treats the whole string as a base-256 integer.
 */
export function stringToBigInt(str) {
  let res = 0n;
  for (let i = 0; i < str.length; i++) {
    res = res * 256n + BigInt(str.charCodeAt(i));
  }
  return res;
}

/**
 * Single BigInt back to String
 */
export function bigIntToString(b) {
  if (b === 0n) return "";
  let str = "";
  while (b > 0n) {
    str = String.fromCharCode(Number(b % 256n)) + str;
    b /= 256n;
  }
  return str;
}
