"use client";

import Link from "next/link";

export default function NexusFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-green-900/40 bg-black font-mono">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
        <div>
          <p className="text-sm tracking-widest text-green-400">SYED NEXUS</p>
          <p className="mt-1 text-xs text-gray-500">© {year} Syed Nexus. All rights reserved.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 sm:justify-end sm:gap-5">
          <Link href="/nexus" className="hover:text-green-400">Nexus OS</Link>
          <Link href="/security" className="hover:text-green-400">Security</Link>
          <Link href="/privacy" className="hover:text-green-400">Privacy</Link>
          <Link href="/" className="hover:text-green-400">Gateway</Link>
        </div>
      </div>
    </footer>
  );
}
