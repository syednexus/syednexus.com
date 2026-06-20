import NexusModuleDashboard from "@/components/os/NexusModuleDashboard";
import { MODULE_MISSION_TYPES } from "@/types/mission";

export default function AILabPage() {
  return (
    <NexusModuleDashboard
      title="AI Security Lab"
      description="Train on prompt injection defense and AI-generated phishing detection in controlled scenarios."
      allowedTypes={MODULE_MISSION_TYPES.aiLab}
    />
  );
}
