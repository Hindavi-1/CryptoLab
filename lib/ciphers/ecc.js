import { modInverse } from "../math";

export function pointAdd(P, Q, a, p) {
  if (!P) return Q;
  if (!Q) return P;
  if (P.x === Q.x && P.y === (-Q.y + p) % p) return null; // Point at infinity
  
  let lambda;
  if (P.x === Q.x && P.y === Q.y) {
    if (P.y === 0n) return null;
    const num = (3n * P.x * P.x + a) % p;
    const den = (2n * P.y) % p;
    lambda = (num * modInverse(den, p)) % p;
  } else {
    let num = (Q.y - P.y) % p;
    if (num < 0n) num += p;
    let den = (Q.x - P.x) % p;
    if (den < 0n) den += p;
    lambda = (num * modInverse(den, p)) % p;
  }
  
  let xR = (lambda * lambda - P.x - Q.x) % p;
  if (xR < 0n) xR += p;
  
  let yR = (lambda * (P.x - xR) - P.y) % p;
  if (yR < 0n) yR += p;
  
  return { x: xR, y: yR };
}

export function scalarMult(k, P, a, p) {
  let R = null;
  let Q = { ...P };
  let kTemp = k;
  
  while (kTemp > 0n) {
    if (kTemp % 2n === 1n) {
      R = pointAdd(R, Q, a, p);
    }
    Q = pointAdd(Q, Q, a, p);
    kTemp /= 2n;
  }
  return R;
}

export function getECCSteps(pStr, aStr, bStr, Gx, Gy, privA, privB) {
  try {
    const p = BigInt(pStr);
    const a = BigInt(aStr);
    const b = BigInt(bStr);
    const G = { x: BigInt(Gx), y: BigInt(Gy) };
    const kA = BigInt(privA);
    const kB = BigInt(privB);
    
    // Validate curve: 4a^3 + 27b^2 != 0 mod p
    const det = (4n * a * a * a + 27n * b * b) % p;
    if (det === 0n) throw new Error("Invalid Curve (Singular)");
    
    const PubA = scalarMult(kA, G, a, p);
    const PubB = scalarMult(kB, G, a, p);
    
    const SharedA = scalarMult(kA, PubB, a, p);
    const SharedB = scalarMult(kB, PubA, a, p);
    
    return [{
      type: "ecc_data",
      data: {
        p: p.toString(), a: a.toString(), b: b.toString(),
        G: { x: G.x.toString(), y: G.y.toString() },
        kA: kA.toString(), kB: kB.toString(),
        PubA: PubA ? { x: PubA.x.toString(), y: PubA.y.toString() } : null,
        PubB: PubB ? { x: PubB.x.toString(), y: PubB.y.toString() } : null,
        SharedA: SharedA ? { x: SharedA.x.toString(), y: SharedA.y.toString() } : null,
        SharedB: SharedB ? { x: SharedB.x.toString(), y: SharedB.y.toString() } : null
      }
    }];
  } catch(e) {
    throw new Error(e.message || "Invalid ECC parameters");
  }
}
