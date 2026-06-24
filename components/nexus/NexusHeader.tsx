"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import NexusFeedback from "./NexusFeedback";
import { useNexusSound } from "./NexusSound";
import {
  HEADER_NAV,
  HEADER_NAV_FLAT,
  isNavGroup,
  type HeaderNavGroup
} from "@/lib/nexusNavigation";

function LabsDropdown({
  group,
  onNavigate
}: {
  group: HeaderNavGroup;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        className="flex items-center gap-1 text-gray-400 transition hover:text-green-400"
        aria-expanded={open}
      >
        {group.label}
        <span className="text-[10px] text-gray-600">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-[10rem] rounded-lg border border-green-900/60 bg-black/95 py-1 shadow-lg">
          {group.items.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-400 hover:bg-green-950/50 hover:text-green-300"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NexusHeader() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { enabled, toggleSound, volume, setVolume, play } = useNexusSound();

  const click = (fn: () => void) => {
    play("click");
    fn();
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-green-900/40 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-sm font-bold tracking-widest text-green-400 transition hover:text-green-300 sm:text-base"
          onClick={() => play("click")}
        >
          SYED NEXUS
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-gray-400 lg:flex">
          {HEADER_NAV.map(entry => {
            if (isNavGroup(entry)) {
              return <LabsDropdown key={entry.label} group={entry} />;
            }
            return (
              <Link
                key={entry.href}
                href={entry.href}
                className="whitespace-nowrap transition hover:text-green-400"
                onClick={() => play("click")}
              >
                {entry.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            className="rounded border border-green-800 px-2.5 py-1.5 text-green-400 lg:hidden"
            onClick={() => click(() => setMobileOpen(current => !current))}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <NexusFeedback className="hidden sm:inline-flex" />

          <div className="hidden items-center gap-1.5 md:flex">
            <button
              type="button"
              onClick={() => click(toggleSound)}
              className="rounded border border-green-800 px-2 py-1 text-xs hover:bg-green-950"
              aria-label={enabled ? "Mute sound" : "Enable sound"}
            >
              {enabled ? "🔊" : "🔇"}
            </button>
            {enabled && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={event => setVolume(parseFloat(event.target.value))}
                className="w-14 accent-green-500"
                aria-label="Volume"
              />
            )}
          </div>

          {status === "loading" ? (
            <span className="text-xs text-gray-600">…</span>
          ) : !session ? (
            <button
              type="button"
              onClick={() => click(() => signIn("google"))}
              className="rounded border border-green-700 px-2.5 py-1 text-xs text-green-400 hover:bg-green-950"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="hidden max-w-[7rem] truncate text-xs text-green-500 xl:inline">
                {session.user?.name?.split(" ")[0] ?? "User"}
              </span>
              <button
                type="button"
                onClick={() => click(() => signOut())}
                className="rounded border border-red-900/60 px-2 py-1 text-xs text-red-400 hover:bg-red-950/30"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-green-900/40 bg-black/95 px-4 py-4 lg:hidden">
          <div className="mb-4 sm:hidden">
            <NexusFeedback onOpen={() => setMobileOpen(false)} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {HEADER_NAV_FLAT.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 text-gray-400 hover:text-green-400"
                onClick={() => {
                  play("click");
                  setMobileOpen(false);
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
