import { modPow, modInverse, textToBigInts, bigIntsToText } from "../math";

export function generateElGamalKeys(pStr, gStr, xStr) {
  try {
    const p = BigInt(pStr);
    const g = BigInt(gStr);
    const x = BigInt(xStr); // Private key
    const y = modPow(g, x, p); // Public key
    return { publicKey: { p, g, y }, privateKey: { x, p } };
  } catch (err) {
    throw new Error("Invalid ElGamal parameters");
  }
}

export function encryptElGamal(text, publicKey, kStr) {
  const { p, g, y } = publicKey;
  const k = BigInt(kStr);
  const blocks = textToBigInts(text);
  
  const c1 = modPow(g, k, p);
  const c2s = blocks.map(m => {
    const s = modPow(y, k, p);
    return (m * s) % p;
  });

  return `${c1.toString()} ${c2s.map(x=>x.toString()).join(",")}`;
}

export function decryptElGamal(ciphertext, privateKey) {
  const { x, p } = privateKey;
  const parts = ciphertext.split(" ");
  if (parts.length < 2) return "⚠ Invalid Ciphertext";
  
  const c1 = BigInt(parts[0]);
  const c2s = parts[1].split(",").map(n => BigInt(n));
  
  const s = modPow(c1, x, p);
  const sInv = modInverse(s, p);
  
  const blocks = c2s.map(c2 => (c2 * sInv) % p);
  return bigIntsToText(blocks);
}

export function getElGamalSteps(text, key, mode = "encrypt") {
  if (mode === "encrypt") {
    const { p, g, y, k } = key; 
    const blocks = text.split("").map(char => {
      const m = BigInt(char.charCodeAt(0));
      const s = modPow(y, k, p);
      const c2 = (m * s) % p;
      return { char, m: m.toString(), c2: c2.toString() };
    });
    const c1 = modPow(g, k, p);
    
    return [{
      type: "elgamal_data",
      data: {
        action: mode,
        input: text,
        p: p.toString(), g: g.toString(), y: y.toString(), k: k.toString(),
        c1: c1.toString(),
        blocks
      }
    }];
  } else {
    try {
      const { p, x } = key;
      const parts = text.split(" ");
      if (parts.length < 2) throw new Error("Format: C1 C2,C2...");
      const c1 = BigInt(parts[0]);
      const c2s = parts[1].split(",");
      const s = modPow(c1, x, p);
      const sInv = modInverse(s, p);
      
      const blocks = c2s.map(c2Str => {
        const c2 = BigInt(c2Str);
        const m = (c2 * sInv) % p;
        return { c2: c2Str, m: m.toString(), char: String.fromCharCode(Number(m)) };
      });

      return [{
        type: "elgamal_data",
        data: {
          action: mode,
          input: text,
          p: p.toString(), x: x.toString(), c1: c1.toString(), s: s.toString(), sInv: sInv.toString(),
          blocks
        }
      }];
    } catch(e) {
       return [{ type: "elgamal_data", data: { action: mode, error: "Invalid ciphertext format for decryption. Expects 'C1 C2,C2...'" } }];
    }
  }
}
