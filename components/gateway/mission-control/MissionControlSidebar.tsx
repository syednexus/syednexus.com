"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { useSound } from "@/context/SoundContext";

import { MISSION_CONTROL_SIDEBAR } from "./navigation";

export default function MissionControlSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { playSound } = useSound();

  return (
    <aside className="flex h-full flex-col border-r border-cyan-500/15 bg-slate-950/80 backdrop-blur-md">
      <div className="border-b border-cyan-500/10 px-4 py-4">
        <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-500/80">Nexus Command</p>
        <p className="mt-1 text-xs font-semibold text-cyan-100">Mission Control</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          {MISSION_CONTROL_SIDEBAR.map((item, index) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li key={item.id}>
                <motion.button
                  type="button"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onMouseEnter={() => playSound("ui.hover")}
                  onClick={() => {
                    playSound("ui.click");
                    router.push(item.href);
                  }}
                  className={`group w-full rounded-lg px-3 py-2.5 text-left transition ${
                    active
                      ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-100"
                      : "border border-transparent text-slate-400 hover:border-cyan-500/20 hover:bg-white/5 hover:text-cyan-200"
                  }`}
                >
                  <span className="block text-[10px] font-medium tracking-widest">{item.label}</span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
