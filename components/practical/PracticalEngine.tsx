"use client";

import type { PracticalMissionProps } from "@/components/engine/PracticalMissionProps";
import NexusRoom from "@/components/room/NexusRoom";

export type PracticalEngineProps = PracticalMissionProps;

export default function PracticalEngine(props: PracticalEngineProps) {
  return <NexusRoom {...props} variant="practical" />;
}
