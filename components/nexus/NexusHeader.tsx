"use client";

import Link from "next/link";

import { useNexusSound } from "./NexusSound";
import NexusFeedback from "./NexusFeedback";
import { signIn, signOut, useSession } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/nexus", label: "Nexus OS" },
  { href: "/soc", label: "SOC" },
  { href: "/attack", label: "Attack" },
  { href: "/forensics", label: "Forensics" },
  { href: "/lab", label: "Lab" },
  { href: "/games", label: "Games" },
  { href: "/tools", label: "Tools" },
  { href: "/career", label: "Career" },
  { href: "/blogs", label: "Blog" },
];

export default function NexusHeader() {
  const { data: session, status } = useSession();
  const { enabled, toggleSound } = useNexusSound();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-green-900/40 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-bold tracking-widest text-green-400">
          SYED NEXUS
        </Link>

        <nav className="hidden gap-6 text-sm text-gray-400 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-green-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <NexusFeedback />

          <button
            onClick={toggleSound}
            className="rounded border border-green-700 px-3 py-1 text-xs text-green-400 transition hover:bg-green-950"
          >
            {enabled ? "SOUND ON" : "SOUND OFF"}
          </button>

          {status === "loading" ? (
            <span className="text-xs text-green-400">...</span>
          ) : !session ? (
            <button
              onClick={() => signIn("google")}
              className="rounded border border-green-700 px-4 py-1 text-green-400 transition hover:bg-green-950"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center gap-3 text-green-400">
              <span className="text-sm">{session.user?.name ?? "User"}</span>

              {session.user?.role === "OWNER" && (
                <Link
                  href="/vault"
                  className="rounded border border-yellow-500 px-3 py-1 text-yellow-400"
                >
                  Control
                </Link>
              )}

              <button
                onClick={() => signOut()}
                className="rounded border border-red-700 px-3 py-1 text-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
