import type { DifficultyFilter } from "@/components/cyber/MissionFilters";
import { normalizeDifficulty } from "@/lib/cyberRangeFilters";
import type { Mission } from "@/types/mission";

export function filterByAllowedTypes(missions: Mission[], allowedTypes: string[]): Mission[] {
  const allowed = new Set(allowedTypes);
  return missions.filter(mission => allowed.has(mission.type));
}

export function filterModuleMissions(
  missions: Mission[],
  allowedTypes: string[],
  options: {
    search?: string;
    difficulty?: DifficultyFilter;
    typeFilter?: string[];
    categoryKeywords?: string[];
  } = {}
): Mission[] {
  const allowed = new Set(allowedTypes);
  const keywords = options.categoryKeywords?.map(k => k.toLowerCase()) ?? [];

  let filtered = missions.filter(mission => {
    if (allowed.has(mission.type)) {
      return true;
    }

    if (keywords.length === 0) {
      return false;
    }

    const category = mission.category.toLowerCase();
    const title = mission.title.toLowerCase();

    return keywords.some(
      keyword => category.includes(keyword) || title.includes(keyword)
    );
  });

  if (options.typeFilter && options.typeFilter.length > 0) {
    const types = new Set(options.typeFilter);
    filtered = filtered.filter(mission => types.has(mission.type));
  }

  if (options.difficulty && options.difficulty !== "ALL") {
    filtered = filtered.filter(
      mission => normalizeDifficulty(mission.difficulty) === options.difficulty
    );
  }

  const query = options.search?.trim().toLowerCase() ?? "";

  if (query) {
    filtered = filtered.filter(
      mission =>
        mission.title.toLowerCase().includes(query) ||
        mission.category.toLowerCase().includes(query) ||
        mission.description.toLowerCase().includes(query) ||
        mission.type.toLowerCase().includes(query)
    );
  }

  return filtered;
}
