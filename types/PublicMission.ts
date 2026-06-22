import type { MissionType } from "@/types/mission";

/** Fields exposed by GET /api/missions — never includes answer or explanation. */
export type PublicMission = {
  id: number;
  title: string;
  slug: string;
  type: MissionType | string;
  category: string;
  difficulty: string;
  description: string;
  scenario?: string | null;
  content?: string | null;
  xp: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
