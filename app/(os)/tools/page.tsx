import NexusModuleDashboard from "@/components/os/NexusModuleDashboard";
import { MODULE_MISSION_TYPES } from "@/types/mission";

export default function ToolsPage() {
  return (
    <NexusModuleDashboard
      title="Security Tools"
      description="Guided tool simulations to practice scanning, enumeration, and analyst workflows in a safe environment."
      allowedTypes={MODULE_MISSION_TYPES.tools}
    />
  );
}
