import { modPow } from "../math";

export function getDHSteps(pStr, gStr, aStr, bStr) {
  try {
    const p = BigInt(pStr);
    const g = BigInt(gStr);
    const a = BigInt(aStr);
    const b = BigInt(bStr);

    const A = modPow(g, a, p);
    const B = modPow(g, b, p);
    
    const Sa = modPow(B, a, p);
    const Sb = modPow(A, b, p);

    return [{
      type: "dh_data",
      data: {
        p: p.toString(),
        g: g.toString(),
        a: a.toString(),
        b: b.toString(),
        A: A.toString(),
        B: B.toString(),
        Sa: Sa.toString(),
        Sb: Sb.toString()
      }
    }];
  } catch(e) {
    throw new Error("Invalid DH parameters. Ensure they are valid integers.");
  }
}
