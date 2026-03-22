import { modPow, modInverse, textToBigInts, bigIntsToText } from "../math";

/**
 * Generates RSA keys given primes p, q and public exponent e.
 */
export function generateRSAKeys(pStr, qStr, eStr = "17") {
  try {
    const p = BigInt(pStr);
    const q = BigInt(qStr);
    const e = BigInt(eStr);
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    const d = modInverse(e, phi);
    return { publicKey: { e, n }, privateKey: { d, n } };
  } catch (err) {
    throw new Error("Invalid RSA parameters. Ensure p, q are primes and e is coprime to phi(n).");
  }
}

/**
 * Encrypts text using RSA
 */
export function encryptRSA(text, publicKey) {
  const { e, n } = publicKey;
  return textToBigInts(text).map(m => modPow(m, e, n).toString()).join(" ");
}

/**
 * Decrypts text using RSA
 */
export function decryptRSA(ciphertext, privateKey) {
  const { d, n } = privateKey;
  const blocks = ciphertext.split(" ").filter(x=>x).map(c => modPow(BigInt(c), d, n));
  return bigIntsToText(blocks);
}

/**
 * Returns a step-by-step breakdown of the RSA transformation.
 */
export function getRSASteps(text, key, mode = "encrypt") {
  const { e, d, n } = key;
  if (mode === "encrypt") {
    return [{
      type: "rsa_data",
      data: {
        action: mode,
        input: text,
        n: n.toString(),
        e: e.toString(),
        blocks: text.split("").map(char => {
          const m = BigInt(char.charCodeAt(0));
          const c = modPow(m, e, n);
          return { m: m.toString(), c: c.toString(), char };
        })
      }
    }];
  } else {
    const inputBlocks = text.split(" ").filter(x=>x);
    return [{
      type: "rsa_data",
      data: {
        action: mode,
        input: text,
        n: n.toString(),
        d: d.toString(),
        blocks: inputBlocks.map(cStr => {
          const c = BigInt(cStr);
          const m = modPow(c, d, n);
          return { c: cStr, m: m.toString(), char: String.fromCharCode(Number(m)) };
        })
      }
    }];
  }
}
