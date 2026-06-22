"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import CyberStats from "@/components/cyber/CyberStats";
import MissionCard from "@/components/cyber/MissionCard";
import MissionFilters, {
  type CategoryFilter,
  type DifficultyFilter
} from "@/components/cyber/MissionFilters";
import { useAnalyst } from "@/hooks/useAnalyst";
import { formatDynamicStat, useMounted } from "@/hooks/useMounted";
import { useMissions, useMissionsStatus } from "@/hooks/useMissions";
import { filterMissions } from "@/lib/cyberRangeFilters";
import { filterModuleMissions } from "@/lib/moduleMissionFilters";
import type { Mission } from "@/types/mission";

export type NexusModuleDashboardProps = {
  title: string;
  description: string;
  allowedTypes: string[];
  categoryKeywords?: readonly string[];
  modulePath?: string;
  showStats?: boolean;
  showSearch?: boolean;
  showDifficultyFilter?: boolean;
  showCategoryFilters?: boolean;
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
  customFilter?: (missions: Mission[]) => Mission[];
};

export default function NexusModuleDashboard({
  title,
  description,
  allowedTypes,
  categoryKeywords,
  modulePath = "module",
  showStats = false,
  showSearch = true,
  showDifficultyFilter = true,
  showCategoryFilters = false,
  headerSlot,
  footerSlot,
  customFilter
}: NexusModuleDashboardProps) {
  const mounted = useMounted();
  const allMissions = useMissions();
  const analyst = useAnalyst();
  const { loading, error } = useMissionsStatus();

  const [category, setCategory] = useState<CategoryFilter>("ALL");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("ALL");
  const [search, setSearch] = useState("");

  const moduleMissions = useMemo(
    () =>
      filterModuleMissions(allMissions, allowedTypes, {
        categoryKeywords: categoryKeywords ? [...categoryKeywords] : undefined
      }),
    [allMissions, allowedTypes, categoryKeywords]
  );

  const completedIds = useMemo(
    () => new Set(analyst.completedMissionIds),
    [analyst.completedMissionIds]
  );

  const filteredMissions = useMemo(() => {
    let filtered = moduleMissions;

    if (showCategoryFilters) {
      filtered = filterMissions(filtered, { category, difficulty, search });
    } else {
      filtered = filterModuleMissions(filtered, allowedTypes, {
        search,
        difficulty: showDifficultyFilter ? difficulty : "ALL",
        categoryKeywords: categoryKeywords ? [...categoryKeywords] : undefined
      });
    }

    if (customFilter) {
      filtered = customFilter(filtered);
    }

    return filtered;
  }, [
    moduleMissions,
    allowedTypes,
    showCategoryFilters,
    category,
    difficulty,
    search,
    showDifficultyFilter,
    categoryKeywords,
    customFilter
  ]);

  return (
    <main className="min-h-screen bg-black p-5 font-mono text-green-400 sm:p-8 lg:p-10">
      <p className="text-gray-500">root@nexus:{modulePath}#</p>

      <h1 className="mt-5 text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h1>

      <p className="mt-5 max-w-3xl text-sm text-gray-400 sm:text-base">{description}</p>

      {headerSlot}

      {showStats && <CyberStats missions={moduleMissions} />}

      {(showSearch || showDifficultyFilter || showCategoryFilters) && (
        <MissionFilters
          category={category}
          onCategoryChange={setCategory}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          search={search}
          onSearchChange={setSearch}
          showCategoryTabs={showCategoryFilters}
          showDifficulty={showDifficultyFilter}
          showSearch={showSearch}
        />
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl sm:text-3xl">MISSION QUEUE</h2>
        <p className="text-sm text-gray-500">
          {formatDynamicStat(
            mounted,
            `${filteredMissions.length} of ${moduleMissions.length} missions`
          )}
        </p>
      </div>

      {loading && <p className="mt-8 text-gray-500">Loading missions...</p>}

      {error && (
        <p className="mt-8 text-red-400">Failed to load missions: {error}</p>
      )}

      {mounted && !loading && !error && filteredMissions.length === 0 && (
        <div className="mt-8 rounded-xl border border-green-900 p-10 text-center">
          <p className="text-xl text-gray-500">No missions found</p>
          <p className="mt-3 text-sm text-gray-600">
            {moduleMissions.length === 0
              ? "No missions are tagged for this module yet."
              : "Try clearing filters or adjusting your search query."}
          </p>
        </div>
      )}

      {mounted && !loading && !error && filteredMissions.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMissions.map(mission => (
            <MissionCard
              key={mission.id}
              mission={mission}
              completed={completedIds.has(mission.id)}
            />
          ))}
        </div>
      )}

      {footerSlot && <div className="mt-16">{footerSlot}</div>}
    </main>
  );
}
