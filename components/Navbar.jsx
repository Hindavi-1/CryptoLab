"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import styles from "./Navbar.module.css";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/simulation", label: "Simulation Lab" },
  { href: "/challenges", label: "Challenges" },
  { href: "/compare", label: "Compare" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>CryptoLab</span>
        </Link>

        <ul className={`${styles.links} ${open ? styles.open : ""}`}>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.link} ${pathname === href ? styles.active : ""}`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.right}>
          <ThemeToggle />
          <button
            className={styles.hamburger}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.bar} ${open ? styles.barTop : ""}`} />
            <span className={`${styles.bar} ${open ? styles.barMid : ""}`} />
            <span className={`${styles.bar} ${open ? styles.barBot : ""}`} />
          </button>
        </div>
      </nav>
    </header>
  );
}
