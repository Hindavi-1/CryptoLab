"use client";
import CipherTool from "../../../components/CipherTool";
import styles from "./tool.module.css";
import Link from "next/link";

const CIPHER_META = {
    caesar: { name: "Caesar Cipher", description: "A simple shift cipher." },
    vigenere: { name: "Vigenère Cipher", description: "A polyalphabetic substitution cipher." },
    playfair: { name: "Playfair Cipher", description: "A digraph substitution cipher." },
    railfence: { name: "Rail Fence Cipher", description: "A transposition cipher." },
    columnar: { name: "Columnar Transposition", description: "Keyed columnar transposition cipher." },
    affine: { name: "Affine Cipher", description: "A substitution cipher using a linear function." },
    hill: { name: "Hill Cipher", description: "A polygraphic substitution cipher using linear algebra." },
    substitution: { name: "Simple Substitution", description: "A substitution cipher with a fixed key." },
    des: { name: "DES (Demo)", description: "Data Encryption Standard, a block cipher." },
    aes: { name: "AES (Demo)", description: "Advanced Encryption Standard, a block cipher." },
    rsa: { name: "RSA (Demo)", description: "A public-key cryptosystem." },
    md5: { name: "MD5 (Demo)", description: "A cryptographic hash function." },
    sha256: { name: "SHA-256 (Demo)", description: "A cryptographic hash function." },
};

export default function ToolPage({ params }) {
    const { cipher } = params;
    const meta = CIPHER_META[cipher];

    if (!meta) {
        return (
            <div className={styles.container}>
                <div className={styles.toolCard}>
                    <h1>Cipher not found</h1>
                    <p>The tool for "{cipher}" does not exist.</p>
                    <Link href="/tools">Back to Tools</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <CipherTool initialCipher={cipher} />
        </div>
    );
}
