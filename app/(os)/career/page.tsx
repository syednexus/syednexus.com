import NexusModuleDashboard from "@/components/os/NexusModuleDashboard";
import { MODULE_MISSION_TYPES } from "@/types/mission";

export default function CareerPage() {
  return (
    <NexusModuleDashboard
      title="Career Scenarios"
      description="Role-based cybersecurity scenarios that mirror interviews, incident response, and professional decision making."
      allowedTypes={MODULE_MISSION_TYPES.career}
    />
  );
}
