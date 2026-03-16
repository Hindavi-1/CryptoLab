# CryptoLab — Interactive Cryptography Platform

An open, interactive web platform for learning cryptography through exploration, visualization, and hands-on experimentation.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## Project Structure

```
cryptolab/
│
├── app/                         # Next.js App Router pages
│   ├── layout.js                # Root layout (Navbar + Footer + ThemeProvider)
│   ├── page.js                  # Homepage (Hero + CryptoTree)
│   ├── loading.js               # Global loading skeleton
│   ├── not-found.js             # 404 page (with Caesar cipher easter egg)
│   ├── error.js                 # Global error boundary
│   │
│   ├── tools/
│   │   ├── page.js              # Cipher card grid
│   │   └── [cipher]/
│   │       └── page.js          # Dedicated tool per cipher (Caesar, Vigenère, Playfair, Rail Fence)
│   │
│   ├── cipher/
│   │   └── [name]/
│   │       └── page.js          # Theory page per cipher (all 8 ciphers documented)
│   │
│   ├── simulation/
│   │   └── page.js              # Step-by-step simulation lab
│   │
│   ├── challenges/
│   │   └── page.js              # 5 graded cryptography challenges
│   │
│   └── compare/
│       └── page.js              # Algorithm comparison table
│
├── components/                  # React components (each with CSS Module)
│   ├── Navbar.jsx / .module.css
│   ├── Footer.jsx / .module.css
│   ├── Hero.jsx / .module.css           # Animated HELLO→KHOOR encryption demo
│   ├── CryptoTree.jsx / .module.css     # Expandable classification tree
│   ├── CipherCard.jsx / .module.css     # Tool grid cards
│   ├── CipherTool.jsx / .module.css     # Encrypt/decrypt UI (Caesar + Vigenère)
│   ├── SimulationPanel.jsx / .module.css
│   ├── FrequencyAnalysis.jsx / .module.css  # Letter frequency bar chart
│   ├── PlayfairKeyGrid.jsx / .module.css    # 5×5 key square visualizer
│   ├── RailFenceVisualizer.jsx / .module.css # Zigzag pattern visualizer
│   ├── ThemeProvider.jsx                # Context + localStorage theme state
│   └── ThemeToggle.jsx / .module.css
│
├── lib/
│   └── ciphers/
│       ├── index.js             # Barrel export for all ciphers
│       ├── caesar.js            # encryptCaesar / decryptCaesar
│       ├── vigenere.js          # encryptVigenere / decryptVigenere
│       ├── playfair.js          # encryptPlayfair / decryptPlayfair + buildKeySquare
│       └── railfence.js         # encryptRailFence / decryptRailFence
│
├── data/
│   └── cryptoTree.js            # Full cryptography classification tree data
│
├── styles/
│   └── globals.css              # CSS variables (dark/light), fonts, base reset
│
├── package.json
├── next.config.js
├── jsconfig.json                # Path aliases (@/components, @/lib, etc.)
└── .eslintrc.json
```

---

## Features

### Pages
| Route | Description |
|-------|-------------|
| `/` | Homepage with animated Hero and interactive CryptoTree |
| `/tools` | Grid of all cipher cards |
| `/tools/[cipher]` | Dedicated tool for Caesar, Vigenère, Playfair, Rail Fence |
| `/cipher/[name]` | Theory pages for all 8 ciphers |
| `/simulation` | Step-by-step animation of cipher operations |
| `/challenges` | 5 graded challenges (Easy → Expert) |
| `/compare` | Algorithm comparison table |

### Implemented Cipher Logic
| Cipher | Encrypt | Decrypt |
|--------|---------|---------|
| Caesar | ✓ | ✓ |
| Vigenère | ✓ | ✓ |
| Playfair | ✓ | ✓ |
| Rail Fence | ✓ | ✓ |

### Components
- **Hero** — animated encryption loop (HELLO ↔ KHOOR) with JS state machine
- **CryptoTree** — fully expandable/collapsible cipher classification tree
- **CipherTool** — live encrypt/decrypt with swap, copy, mode toggle
- **SimulationPanel** — step-by-step animated simulation with color-coded stages
- **FrequencyAnalysis** — letter frequency bar chart vs English average
- **PlayfairKeyGrid** — live 5×5 key square visualizer
- **RailFenceVisualizer** — zigzag rail pattern visualization

### Design System
- **Fonts**: Syne (display) · Instrument Sans (body) · IBM Plex Mono (code)
- **Dark mode**: `#080C14` background, `#3B82F6` accent, `#22C55E` cipher highlight
- **Light mode**: `#F8FAFC` background, `#2563EB` accent
- **CSS variables** throughout — theme toggle via `data-theme` attribute on `<html>`
- Fully responsive with mobile Navbar

---

## Tech Stack

- **Next.js 14** — App Router, Server Components
- **React 18** — functional components, hooks
- **CSS Modules** — scoped styles per component, no Tailwind
- **Google Fonts** — Syne, Instrument Sans, IBM Plex Mono

---

## Extending the Project

### Adding a new cipher

1. Create `lib/ciphers/yourcipher.js` with `encrypt` and `decrypt` functions
2. Export from `lib/ciphers/index.js`
3. Add to `CIPHER_META` in `app/tools/[cipher]/page.js`
4. Add theory data to `CIPHER_DATA` in `app/cipher/[name]/page.js`
5. Add a card to `app/tools/page.js`
6. Add a node to `data/cryptoTree.js`

### Deploying to Vercel

```bash
npx vercel
```

No environment variables required — all cipher logic runs client-side.
