"use client";

import { useEffect } from "react";

import { useNexus } from "@/context/NexusContext";
import { useMissionsOptional } from "@/context/MissionsProvider";
import { MissionType } from "@/types/mission";

type MissionRouteHandler = {
  achievementId: string;
  achievementTitle: string;
  achievementDescription: string;
  achievementIcon: string;
};

const MISSION_TYPE_ROUTER: Record<MissionType, MissionRouteHandler> = {
  LINUX_GAME: {
    achievementId: "linux_game_complete",
    achievementTitle: "Linux Operator",
    achievementDescription: "Completed a Linux game mission",
    achievementIcon: "🐧",
  },
  NETWORK_GAME: {
    achievementId: "network_game_complete",
    achievementTitle: "Network Runner",
    achievementDescription: "Completed a network game mission",
    achievementIcon: "🌐",
  },
  COMMAND_CHALLENGE: {
    achievementId: "command_challenge_complete",
    achievementTitle: "Shell Specialist",
    achievementDescription: "Completed a command challenge mission",
    achievementIcon: "⌨️",
  },
  QUIZ: {
    achievementId: "quiz_complete",
    achievementTitle: "Quiz Master",
    achievementDescription: "Completed a cybersecurity quiz mission",
    achievementIcon: "❓",
  },
  SOC_ALERT: {
    achievementId: "soc_alert_complete",
    achievementTitle: "Alert Responder",
    achievementDescription: "Completed a SOC alert mission",
    achievementIcon: "🚨",
  },
  SIEM: {
    achievementId: "siem_complete",
    achievementTitle: "SIEM Hunter",
    achievementDescription: "Completed a SIEM mission",
    achievementIcon: "📡",
  },
  PHISHING: {
    achievementId: "phishing_complete",
    achievementTitle: "Phish Defender",
    achievementDescription: "Completed a phishing analysis mission",
    achievementIcon: "🎣",
  },
  MALWARE: {
    achievementId: "malware_complete",
    achievementTitle: "Malware Analyst",
    achievementDescription: "Completed a malware analysis mission",
    achievementIcon: "🦠",
  },
  THREAT_HUNT: {
    achievementId: "threat_hunt_complete",
    achievementTitle: "Threat Hunter",
    achievementDescription: "Completed a threat hunt mission",
    achievementIcon: "🔍",
  },
  RECON: {
    achievementId: "recon_complete",
    achievementTitle: "Recon Operator",
    achievementDescription: "Completed a reconnaissance mission",
    achievementIcon: "🛰️",
  },
  WEB_ATTACK: {
    achievementId: "web_attack_complete",
    achievementTitle: "Web Attacker",
    achievementDescription: "Completed a web attack mission",
    achievementIcon: "🕸️",
  },
  EXPLOITATION: {
    achievementId: "exploitation_complete",
    achievementTitle: "Exploit Engineer",
    achievementDescription: "Completed an exploitation mission",
    achievementIcon: "💥",
  },
  PASSWORD_ATTACK: {
    achievementId: "password_attack_complete",
    achievementTitle: "Credential Analyst",
    achievementDescription: "Completed a password attack mission",
    achievementIcon: "🔐",
  },
  FORENSICS: {
    achievementId: "forensics_complete",
    achievementTitle: "Forensics Analyst",
    achievementDescription: "Completed a forensics mission",
    achievementIcon: "🧪",
  },
  MEMORY_ANALYSIS: {
    achievementId: "memory_analysis_complete",
    achievementTitle: "Memory Investigator",
    achievementDescription: "Completed a memory analysis mission",
    achievementIcon: "🧠",
  },
  FILE_RECOVERY: {
    achievementId: "file_recovery_complete",
    achievementTitle: "Recovery Specialist",
    achievementDescription: "Completed a file recovery mission",
    achievementIcon: "📁",
  },
  TOOL_SIMULATION: {
    achievementId: "tool_simulation_complete",
    achievementTitle: "Tool Operator",
    achievementDescription: "Completed a security tool simulation",
    achievementIcon: "🛠️",
  },
  CAREER_SCENARIO: {
    achievementId: "career_scenario_complete",
    achievementTitle: "Career Navigator",
    achievementDescription: "Completed a career scenario mission",
    achievementIcon: "🎯",
  },
  PROMPT_INJECTION: {
    achievementId: "prompt_injection_complete",
    achievementTitle: "Prompt Defender",
    achievementDescription: "Completed a prompt injection mission",
    achievementIcon: "🤖",
  },
  AI_PHISHING_DETECTION: {
    achievementId: "ai_phishing_complete",
    achievementTitle: "AI Threat Analyst",
    achievementDescription: "Completed an AI phishing detection mission",
    achievementIcon: "🛡️",
  },
};

export default function MissionEngine() {
  const {
    currentSystem,
    objectives,
    completeObjective,
    setMissionProgress,
    unlockAchievement,
    aiOpen,
  } = useNexus();

  const missions = useMissionsOptional();
  const activeMission = missions?.activeMission ?? null;
  const completedSlugs = missions?.completedSlugs ?? [];

  useEffect(() => {
    if (currentSystem === "defender") {
      completeObjective("sentinel");
      unlockAchievement({
        id: "sentinel_access",
        title: "Sentinel Access",
        description: "Entered cybersecurity intelligence system",
        icon: "🛡",
      });
    }

    if (currentSystem === "lab") {
      completeObjective("projects");
      unlockAchievement({
        id: "lab_operator",
        title: "Lab Operator",
        description: "Accessed Nexus security laboratory",
        icon: "⚔",
      });
    }

    if (currentSystem === "medcore") {
      unlockAchievement({
        id: "medcore_access",
        title: "MedCore Specialist",
        description: "Explored healthcare intelligence system",
        icon: "🧬",
      });
    }
  }, [completeObjective, currentSystem, unlockAchievement]);

  useEffect(() => {
    if (aiOpen) {
      completeObjective("ai");
      unlockAchievement({
        id: "ai_contact",
        title: "AI Interaction",
        description: "Activated Nexus AI assistant",
        icon: "🤖",
      });
    }
  }, [aiOpen, completeObjective, unlockAchievement]);

  useEffect(() => {
    const completed = objectives.filter((item) => item.completed).length;
    const progress = Math.round((completed / objectives.length) * 100);

    setMissionProgress(progress);

    if (progress === 100) {
      unlockAchievement({
        id: "nexus_master",
        title: "Nexus Master",
        description: "Completed the full Nexus exploration sequence",
        icon: "🏆",
      });
    }
  }, [objectives, setMissionProgress, unlockAchievement]);

  useEffect(() => {
    if (!activeMission) {
      return;
    }

    const route = MISSION_TYPE_ROUTER[activeMission.type];

    unlockAchievement({
      id: `${route.achievementId}_active`,
      title: `${route.achievementTitle} Engaged`,
      description: `Entered ${activeMission.title}`,
      icon: route.achievementIcon,
    });
  }, [activeMission, unlockAchievement]);

  useEffect(() => {
    if (!missions) {
      return;
    }

    completedSlugs.forEach((slug) => {
      const mission = missions.getMissionBySlug(slug);
      if (!mission) {
        return;
      }

      const route = MISSION_TYPE_ROUTER[mission.type];

      unlockAchievement({
        id: route.achievementId,
        title: route.achievementTitle,
        description: route.achievementDescription,
        icon: route.achievementIcon,
      });
    });
  }, [completedSlugs, missions, unlockAchievement]);

  return null;
}
