"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { useSound } from "@/context/SoundContext";
import { INFRASTRUCTURE_STACK } from "./navigation";

type Props = {
  onClose: () => void;
};

export default function InfrastructurePanel({ onClose }: Props) {
  const { playSound } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-2xl rounded-2xl border border-purple-500/25 bg-slate-900/95 p-6 sm:p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-purple-400">Cloud Infrastructure</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Platform Stack</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound("ui.panel.close");
              onClose();
            }}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-400 hover:text-purple-200"
          >
            ← Back
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Production technologies powering the Syed Nexus ecosystem.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {INFRASTRUCTURE_STACK.map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-xl border border-purple-500/20 bg-purple-950/20 px-3 py-4 text-center"
            >
              <p className="text-xs font-medium tracking-wide text-purple-100">{tech}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/vault"
            onClick={() => playSound("vault.unlock")}
            className="rounded-lg border border-purple-400/30 px-4 py-2 text-xs text-purple-200 hover:bg-purple-400/10"
          >
            Vault Security Center
          </Link>
          <Link
            href="/security"
            onClick={() => playSound("ui.click")}
            className="rounded-lg border border-slate-600 px-4 py-2 text-xs text-slate-300 hover:bg-white/5"
          >
            Security Transparency
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
