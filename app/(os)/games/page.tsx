import NexusModuleDashboard from "@/components/os/NexusModuleDashboard";
import { MODULE_MISSION_TYPES } from "@/types/mission";

export default function GamesPage() {
  return (
    <NexusModuleDashboard
      title="Cyber Games"
      description="Interactive challenges for Linux navigation, networking, command fluency, and security quizzes."
      allowedTypes={MODULE_MISSION_TYPES.games}
    />
  );
}
