"use client";

export const CATEGORY_TABS = [
  "ALL",
  "SOC",
  "SIEM",
  "TERMINAL",
  "PHISHING",
  "MALWARE",
  "NETWORK",
  "WEB_ATTACK",
  "FORENSICS"
] as const;

export type CategoryFilter = (typeof CATEGORY_TABS)[number];

export const DIFFICULTY_OPTIONS = [
  "Beginner",
  "Intermediate",
  "Advanced"
] as const;

export type DifficultyFilter = "ALL" | (typeof DIFFICULTY_OPTIONS)[number];

export const CATEGORY_TYPE_MAP: Record<Exclude<CategoryFilter, "ALL">, string[]> = {
  SOC: ["SOC_ALERT", "INCIDENT_RESPONSE"],
  SIEM: ["SIEM"],
  TERMINAL: ["TERMINAL", "THREAT_HUNT"],
  PHISHING: ["PHISHING"],
  MALWARE: ["MALWARE"],
  NETWORK: ["NETWORK"],
  WEB_ATTACK: ["WEB_ATTACK"],
  FORENSICS: ["FORENSICS"]
};

type MissionFiltersProps = {
  category: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  difficulty: DifficultyFilter;
  onDifficultyChange: (value: DifficultyFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
  showCategoryTabs?: boolean;
  showDifficulty?: boolean;
  showSearch?: boolean;
};

export default function MissionFilters({
  category,
  onCategoryChange,
  difficulty,
  onDifficultyChange,
  search,
  onSearchChange,
  showCategoryTabs = true,
  showDifficulty = true,
  showSearch = true
}: MissionFiltersProps) {
  return (
    <section className="mt-10 space-y-6">
      {showSearch && (
        <div>
          <label htmlFor="mission-search" className="text-sm text-gray-500">
            SEARCH MISSIONS
          </label>
          <input
            id="mission-search"
            type="search"
            value={search}
            onChange={event => onSearchChange(event.target.value)}
            placeholder="Search by title, category, or description..."
            className="
              mt-2
              w-full
              rounded-lg
              border
              border-green-900
              bg-black
              px-4
              py-3
              text-green-400
              outline-none
              transition
              placeholder:text-gray-600
              focus:border-green-600
            "
          />
        </div>
      )}

      {showCategoryTabs && (
        <div>
          <p className="text-sm text-gray-500">CATEGORY</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CATEGORY_TABS.map(tab => {
              const active = category === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onCategoryChange(tab)}
                  className={`
                    rounded-lg
                    border
                    px-3
                    py-2
                    text-sm
                    transition
                    ${active
                      ? "border-green-500 bg-green-950/40 text-green-300"
                      : "border-green-900 text-gray-400 hover:border-green-700 hover:text-green-400"}
                  `}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showDifficulty && (
        <div>
          <p className="text-sm text-gray-500">DIFFICULTY</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onDifficultyChange("ALL")}
              className={`
                rounded-lg
                border
                px-3
                py-2
                text-sm
                transition
                ${difficulty === "ALL"
                  ? "border-green-500 bg-green-950/40 text-green-300"
                  : "border-green-900 text-gray-400 hover:border-green-700 hover:text-green-400"}
              `}
            >
              ALL
            </button>
            {DIFFICULTY_OPTIONS.map(option => {
              const active = difficulty === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onDifficultyChange(active ? "ALL" : option)}
                  className={`
                    rounded-lg
                    border
                    px-3
                    py-2
                    text-sm
                    transition
                    ${active
                      ? "border-green-500 bg-green-950/40 text-green-300"
                      : "border-green-900 text-gray-400 hover:border-green-700 hover:text-green-400"}
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
