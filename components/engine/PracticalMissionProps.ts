import type { PublicMission } from "@/types/PublicMission";

export type PracticalMissionProps = {
  mission: PublicMission;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  completed: boolean;
  submitting: boolean;
  result: string;
  debrief?: string | null;
};

/** @deprecated Use PracticalMissionProps — kept for labengine imports */
export type LabEngineProps = PracticalMissionProps;

/** @deprecated Use PracticalMissionProps — kept for games/engine imports */
export type GameEngineProps = PracticalMissionProps;
