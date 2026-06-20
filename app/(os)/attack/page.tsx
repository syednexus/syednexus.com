import NexusModuleDashboard from "@/components/os/NexusModuleDashboard";
import { MODULE_MISSION_TYPES } from "@/types/mission";

export default function AttackPage() {
  return (
    <NexusModuleDashboard
      title="Attack Lab"
      description="Offensive security missions for reconnaissance, web attacks, exploitation, and password attack scenarios."
      allowedTypes={MODULE_MISSION_TYPES.attack}
    />
  );
}
