import { MissionType } from "@/types/mission";

export type MissionSimulator = "NexusTerminal" | "NetworkSimulator";

export const MISSION_SIMULATOR_ROUTER: Partial<
  Record<MissionType, MissionSimulator>
> = {
  LINUX_GAME: "NexusTerminal",
  COMMAND_CHALLENGE: "NexusTerminal",
  NETWORK_GAME: "NetworkSimulator",
  PACKET_ANALYSIS: "NetworkSimulator",
};

export function getMissionSimulator(type: MissionType): MissionSimulator | null {
  return MISSION_SIMULATOR_ROUTER[type] ?? null;
}

export function getMissionSimulatorLabel(simulator: MissionSimulator): string {
  switch (simulator) {
    case "NexusTerminal":
      return "Nexus Terminal";
    case "NetworkSimulator":
      return "Network Simulator";
    default:
      return "Mission Engine";
  }
}
