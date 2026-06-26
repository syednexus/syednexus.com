"use client";

import { useEffect, useMemo, useState } from "react";

import { useNexusData } from "@/hooks/useNexusData";
import { useMissions } from "@/hooks/useMissions";
import { useAnalyst } from "@/hooks/useAnalyst";

import { deriveTimeline } from "./deriveTimeline";
import type { FeedItem, MissionControlStats } from "./types";

type HealthResponse = { status: string; database: boolean; timestamp: string };

export function useMissionControlData() {
  const profile = useNexusData();
  const missions = useMissions();
  const analyst = useAnalyst();
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    let active = true;
    void fetch("/api/health")
      .then(res => res.json())
      .then((json: HealthResponse) => {
        if (active) setHealth(json);
      })
      .catch(() => {
        if (active) setHealth(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const stats: MissionControlStats = useMemo(() => {
    const skillGroups = profile.skills || {};
    const skillCount = Object.values(skillGroups).reduce(
      (sum, group) => sum + (Array.isArray(group) ? group.length : 0),
      0
    );

    return {
      missions: missions.length,
      projects: profile.projects?.length ?? 0,
      blogs: profile.blogs?.posts?.length ?? 0,
      certifications: profile.certifications?.length ?? 0,
      skills: skillCount,
      xp: analyst.xp,
      completedMissions: analyst.completed,
      databaseHealthy: health ? health.database : null
    };
  }, [profile, missions.length, analyst.xp, analyst.completed, health]);

  const timeline = useMemo(() => deriveTimeline(profile), [profile]);

  const focusAreas = useMemo(() => {
    const fromSkills = profile.skills?.cybersecurity?.slice(0, 4) ?? [];
    if (fromSkills.length >= 3) return fromSkills;
    const fromHeadline =
      profile.identity.headline
        ?.split("|")
        .map(s => s.trim())
        .filter(Boolean)
        .slice(0, 4) ?? [];
    return fromHeadline.length > 0 ? fromHeadline : fromSkills;
  }, [profile]);

  const staticFeed = useMemo<FeedItem[]>(
    () => [
      {
        id: "platform",
        timestamp: "",
        severity: "info",
        message: "Mission Control online · Syed Nexus ecosystem active"
      }
    ],
    []
  );

  const [feed, setFeed] = useState<FeedItem[]>(staticFeed);

  useEffect(() => {
    const items: FeedItem[] = [];
    const now = new Date().toISOString();

    if (health?.database) {
      items.push({
        id: "db-ok",
        timestamp: health.timestamp || now,
        severity: "success",
        message: "Database healthy"
      });
    } else if (health && !health.database) {
      items.push({
        id: "db-degraded",
        timestamp: health.timestamp || now,
        severity: "warning",
        message: "Database degraded"
      });
    }

    if (analyst.completed > 0) {
      items.push({
        id: "missions",
        timestamp: now,
        severity: "info",
        message: `${analyst.completed} mission${analyst.completed === 1 ? "" : "s"} completed · ${analyst.xp} XP`
      });
    }

    if (stats.projects > 0) {
      items.push({
        id: "projects",
        timestamp: now,
        severity: "info",
        message: `${stats.projects} project${stats.projects === 1 ? "" : "s"} indexed`
      });
    }

    if (stats.blogs > 0) {
      items.push({
        id: "blogs",
        timestamp: now,
        severity: "info",
        message: `${stats.blogs} blog post${stats.blogs === 1 ? "" : "s"} published`
      });
    }

    if (stats.certifications > 0) {
      items.push({
        id: "certs",
        timestamp: now,
        severity: "success",
        message: `${stats.certifications} certification${stats.certifications === 1 ? "" : "s"} tracked`
      });
    }

    items.push({
      id: "platform",
      timestamp: now,
      severity: "info",
      message: "Mission Control online · Syed Nexus ecosystem active"
    });

    setFeed(items.slice(0, 8));
  }, [
    health,
    analyst.completed,
    analyst.xp,
    stats.projects,
    stats.blogs,
    stats.certifications
  ]);

  const feedItems = feed;

  return {
    profile,
    stats,
    timeline,
    focusAreas,
    feed: feedItems,
    analyst
  };
}
