import type { PublicMission } from "@/types/PublicMission";

/** Prisma select for public mission reads — excludes answer, explanation, hints. */
export const PUBLIC_MISSION_SELECT = {
  id: true,
  title: true,
  slug: true,
  type: true,
  category: true,
  difficulty: true,
  description: true,
  scenario: true,
  content: true,
  xp: true,
  active: true,
  createdAt: true,
  updatedAt: true
} as const;

type MissionRow = {
  id: number;
  title: string;
  slug: string;
  type: string;
  category: string;
  difficulty: string;
  description: string;
  scenario: string | null;
  content: string | null;
  xp: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function toPublicMission(row: MissionRow): PublicMission {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    type: row.type,
    category: row.category,
    difficulty: row.difficulty,
    description: row.description,
    scenario: row.scenario,
    content: row.content,
    xp: row.xp,
    active: row.active,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  };
}

export function toPublicMissions(rows: MissionRow[]): PublicMission[] {
  return rows.map(toPublicMission);
}
