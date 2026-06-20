import NexusModuleDashboard from "@/components/os/NexusModuleDashboard";
import { MODULE_MISSION_TYPES } from "@/types/mission";

export default function SOCPage() {
  return (
    <NexusModuleDashboard
      title="SOC Defender"
      description="Blue team simulations covering alert triage, SIEM hunting, phishing response, malware review, and threat hunts."
      allowedTypes={MODULE_MISSION_TYPES.soc}
    />
  );
}
