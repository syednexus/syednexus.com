import NexusModuleDashboard from "@/components/os/NexusModuleDashboard";
import { MODULE_MISSION_TYPES } from "@/types/mission";

export default function ForensicsPage() {
  return (
    <NexusModuleDashboard
      title="Forensics Lab"
      description="Digital forensics exercises for disk artifacts, memory analysis, and file recovery workflows."
      allowedTypes={MODULE_MISSION_TYPES.forensics}
    />
  );
}
