"use client";

import {
  useEffect,
  useRef,
  useState
} from "react";
import { motion } from "framer-motion";

import { useNexus } from "@/context/NexusContext";
import { getAchievementTier } from "@/lib/achievementTier";

type ApiAchievement = {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

const listContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 }
  }
};

const listItem = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 280, damping: 22 }
  }
};

export default function Achievements() {
  const [items, setItems] = useState<ApiAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const knownUnlocked = useRef<Set<number>>(new Set());
  const initialLoad = useRef(true);
  const { celebrateAchievement } = useNexus();

  useEffect(() => {
    function loadAchievements() {
      fetch("/api/achievements")
        .then(res => res.json())
        .then((data: ApiAchievement[]) => {
          setItems(data);

          const newlyUnlocked = data.filter(achievement => {
            if (!achievement.unlocked) {
              return false;
            }

            if (initialLoad.current) {
              knownUnlocked.current.add(achievement.id);
              return false;
            }

            return !knownUnlocked.current.has(achievement.id);
          });

          newlyUnlocked.forEach(achievement => {
            knownUnlocked.current.add(achievement.id);
            celebrateAchievement({
              id: String(achievement.id),
              title: achievement.name,
              description: achievement.description,
              icon: achievement.icon
            });
          });

          initialLoad.current = false;
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }

    loadAchievements();

    window.addEventListener("nexus-achievements-refresh", loadAchievements);
    return () => window.removeEventListener("nexus-achievements-refresh", loadAchievements);
  }, [celebrateAchievement]);

  const unlockedCount = items.filter(item => item.unlocked).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ boxShadow: "0 0 28px rgba(34,197,94,0.08)" }}
      transition={{ duration: 0.3 }}
      className="
        group/registry
        mt-8
        border
        border-green-900/60
        bg-black/60
        p-6
        font-mono
        transition-colors
        duration-300
        hover:border-green-800/80
      "
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-xs tracking-[0.3em] text-green-700"
          >
            BADGE REGISTRY
          </motion.p>
          <h2 className="mt-1 text-xl text-green-400 transition-colors group-hover/registry:text-green-300">
            analyst_clearances.log
          </h2>
        </div>

        <motion.p
          key={unlockedCount}
          initial={{ scale: 1.2, color: "#86efac" }}
          animate={{ scale: 1, color: "#4b5563" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-xs"
        >
          {unlockedCount}/{items.length} active
        </motion.p>
      </div>

      {loading && (
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="mt-5 text-gray-600"
        >
          scanning registry...
        </motion.p>
      )}

      {!loading && items.length === 0 && (
        <p className="mt-5 text-gray-600">
          no clearances on record.
        </p>
      )}

      <motion.div
        variants={listContainer}
        initial="hidden"
        animate="show"
        className="mt-5 grid gap-4 md:grid-cols-3"
      >
        {items.map(achievement => {
          const tier = getAchievementTier({
            id: String(achievement.id),
            title: achievement.name,
            description: achievement.description,
            icon: achievement.icon
          });
          const isSpecialist = tier === "specialist";
          const unlocked = achievement.unlocked;

          return (
            <motion.div
              key={achievement.id}
              variants={listItem}
              whileHover={unlocked ? {
                y: -8,
                scale: 1.03,
                boxShadow: isSpecialist
                  ? "0 12px 32px rgba(245,158,11,0.18)"
                  : "0 12px 32px rgba(34,197,94,0.15)"
              } : {
                scale: 1.01,
                opacity: 0.65
              }}
              whileTap={unlocked ? { scale: 0.98 } : undefined}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              className={`
                group/card
                relative
                overflow-hidden
                border
                p-4
                cursor-default
                transition-colors
                duration-300
                ${unlocked
                  ? isSpecialist
                    ? "border-amber-900/80 bg-amber-950/10 hover:border-amber-700/90"
                    : "border-green-900/70 bg-green-950/10 hover:border-green-700/90"
                  : "border-gray-900 bg-black/30 opacity-50 hover:border-gray-800"
                }
              `}
            >
              {unlocked && (
                <motion.div
                  aria-hidden
                  className={`
                    pointer-events-none
                    absolute
                    inset-0
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover/card:opacity-100
                    ${isSpecialist
                      ? "bg-[linear-gradient(120deg,transparent,rgba(245,158,11,0.08),transparent)]"
                      : "bg-[linear-gradient(120deg,transparent,rgba(34,197,94,0.08),transparent)]"
                    }
                  `}
                  animate={{ x: ["-120%", "120%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.5 }}
                />
              )}

              {unlocked && (
                <motion.div
                  aria-hidden
                  className={`
                    pointer-events-none
                    absolute
                    inset-0
                    opacity-0
                    group-hover/card:opacity-100
                    ${isSpecialist
                      ? "bg-[linear-gradient(transparent_50%,rgba(245,158,11,0.04)_50%)]"
                      : "bg-[linear-gradient(transparent_50%,rgba(34,197,94,0.04)_50%)]"
                    }
                    bg-[length:100%_3px]
                  `}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                />
              )}

              <p className={`relative text-[10px] tracking-[0.25em] ${isSpecialist ? "text-amber-700" : "text-green-800"}`}>
                {unlocked
                  ? isSpecialist
                    ? "SPECIALIST CLEARANCE"
                    : "CLEARANCE GRANTED"
                  : "LOCKED"}
              </p>

              <motion.div
                className="relative mt-3 text-3xl"
                whileHover={unlocked ? {
                  scale: 1.2,
                  rotate: [0, -8, 8, 0],
                  transition: { duration: 0.45 }
                } : undefined}
                animate={unlocked ? {
                  y: [0, -3, 0]
                } : undefined}
                transition={unlocked ? {
                  y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                } : undefined}
              >
                {achievement.icon}
              </motion.div>

              <h3 className={`relative mt-2 transition-colors duration-300 ${isSpecialist ? "text-amber-300 group-hover/card:text-amber-200" : "text-green-300 group-hover/card:text-green-200"}`}>
                {achievement.name}
              </h3>

              <p className="relative mt-2 text-xs leading-relaxed text-gray-500 transition-colors duration-300 group-hover/card:text-gray-400">
                {achievement.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
