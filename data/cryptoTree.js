export const cryptoTree = {
  id: "root",
  label: "Cryptography",
  children: [
    {
      id: "keyless",
      label: "Keyless Cryptography",
      children: [
        {
          id: "hash",
          label: "Hash Functions",
          children: [
            {
              id: "md5",
              label: "MD5",
              description: "Message Digest 5 produces a 128-bit hash value. Widely used but considered cryptographically broken.",
              slug: "md5",
            },
            {
              id: "sha256",
              label: "SHA-256",
              description: "Secure Hash Algorithm producing a 256-bit hash. Used in Bitcoin and TLS certificates.",
              slug: "sha256",
            },
          ],
        },
      ],
    },
    {
      id: "keybased",
      label: "Key-Based Cryptography",
      children: [
        {
          id: "symmetric",
          label: "Symmetric Cryptography",
          children: [
            {
              id: "classical",
              label: "Classical Ciphers",
              children: [
                {
                  id: "caesar",
                  label: "Caesar Cipher",
                  description: "A substitution cipher that shifts each letter by a fixed number of positions in the alphabet. Used by Julius Caesar.",
                  slug: "caesar",
                },
                {
                  id: "vigenere",
                  label: "Vigenère Cipher",
                  description: "A polyalphabetic substitution cipher using a keyword to determine multiple shift values.",
                  slug: "vigenere",
                },
                {
                  id: "playfair",
                  label: "Playfair Cipher",
                  description: "Encrypts pairs of letters (digraphs) using a 5×5 key matrix. First practical digraph substitution cipher.",
                  slug: "playfair",
                },
                {
                  id: "railfence",
                  label: "Rail Fence Cipher",
                  description: "A transposition cipher that writes plaintext in a zigzag pattern across multiple rails.",
                  slug: "railfence",
                },
                {
                  id: "affine",
                  label: "Affine Cipher",
                  description: "A substitution cipher where each letter is mapped to its numeric equivalent, encrypted using a linear function.",
                  slug: "affine",
                },
                {
                  id: "hill",
                  label: "Hill Cipher",
                  description: "A polygraphic substitution cipher based on linear algebra, using a matrix as a key.",
                  slug: "hill",
                },
                {
                  id: "substitution",
                  label: "Simple Substitution",
                  description: "A cipher where each letter of the alphabet is replaced with another letter.",
                  slug: "substitution",
                },
              ],
            },
            {
              id: "modern-sym",
              label: "Modern Symmetric",
              children: [
                {
                  id: "des",
                  label: "DES",
                  description: "Data Encryption Standard uses 56-bit keys and Feistel network. Now considered insecure due to key size.",
                  slug: "des",
                },
                {
                  id: "aes",
                  label: "AES",
                  description: "Advanced Encryption Standard supports 128/192/256-bit keys. The current gold standard for symmetric encryption.",
                  slug: "aes",
                },
              ],
            },
          ],
        },
        {
          id: "asymmetric",
          label: "Asymmetric Cryptography",
          children: [
            {
              id: "rsa",
              label: "RSA",
              description: "Rivest–Shamir–Adleman uses public/private key pairs based on the difficulty of factoring large primes.",
              slug: "rsa",
            },
            {
              id: "dh",
              label: "Diffie-Hellman",
              description: "A key exchange protocol that allows two parties to establish a shared secret over an insecure channel.",
              slug: "diffie-hellman",
            },
          ],
        },
      ],
    },
  ],
};
