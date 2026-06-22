import {
  CATEGORY_TYPE_MAP,
  type CategoryFilter,
  type DifficultyFilter
} from "@/components/cyber/MissionFilters";
import type { Mission } from "@/types/mission";

export function normalizeDifficulty(value: string): DifficultyFilter {
  const normalized = value.trim().toLowerCase();

  if (normalized.includes("beginner") || normalized === "easy") {
    return "Beginner";
  }

  if (normalized.includes("intermediate") || normalized === "medium") {
    return "Intermediate";
  }

  if (normalized.includes("advanced") || normalized === "hard") {
    return "Advanced";
  }

  return "ALL";
}

export function filterMissions(
  missions: Mission[],
  options: {
    category: CategoryFilter;
    difficulty: DifficultyFilter;
    search: string;
  }
): Mission[] {
  let filtered = missions;

  if (options.category !== "ALL") {
    const types = CATEGORY_TYPE_MAP[options.category];
    filtered = filtered.filter(mission => types.includes(mission.type));
  }

  if (options.difficulty !== "ALL") {
    filtered = filtered.filter(
      mission => normalizeDifficulty(mission.difficulty) === options.difficulty
    );
  }

  const query = options.search.trim().toLowerCase();

  if (query) {
    filtered = filtered.filter(mission =>
      mission.title.toLowerCase().includes(query) ||
      mission.category.toLowerCase().includes(query) ||
      mission.description.toLowerCase().includes(query)
    );
  }

  return filtered;
}
