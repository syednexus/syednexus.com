import type { NexusProfile } from "@/lib/nexusData";
import type { TimelineEvent } from "./types";

/** Build timeline from existing CMS education + experience — no hardcoded events. */
export function deriveTimeline(profile: NexusProfile): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  const pharmacy = [...profile.education]
    .reverse()
    .find(edu => /pharmacy/i.test(edu.degree) || /pharmaceutical/i.test(edu.field));

  if (pharmacy) {
    events.push({ id: "edu-pharmacy", label: pharmacy.degree, period: pharmacy.period });
    events.push({ id: "healthcare", label: "Healthcare Professional" });
  }

  const hasAustralia =
    /australia|melbourne|vic/i.test(profile.identity.location || "") ||
    profile.experience.some(job => /australia|melbourne/i.test(job.company));

  if (hasAustralia) {
    events.push({ id: "australia", label: "Australia" });
  }

  const amazonJobs = profile.experience.filter(job => /amazon/i.test(job.company));
  if (amazonJobs.length > 0) {
    events.push({ id: "amazon", label: "Amazon", period: amazonJobs[amazonJobs.length - 1]?.period });
  }

  const supervisor = profile.experience.find(job =>
    /supervisor|operations/i.test(job.role)
  );
  if (supervisor) {
    events.push({ id: "supervisor", label: supervisor.role, period: supervisor.period });
  }

  const cyberEdu = profile.education.find(edu =>
    /cyber/i.test(edu.degree) || /cyber/i.test(edu.field)
  );
  if (cyberEdu) {
    events.push({ id: "cyber-edu", label: cyberEdu.degree, period: cyberEdu.period });
  }

  if (profile.projects.some(p => /nexus/i.test(p.name))) {
    events.push({ id: "nexus", label: "Building Syed Nexus" });
  }

  const objective =
    profile.identity.headline?.split("|").map(s => s.trim()).find(s => /soc|analyst|engineer/i.test(s)) ||
    profile.identity.headline;

  if (objective) {
    events.push({ id: "objective", label: objective });
  }

  return events;
}
