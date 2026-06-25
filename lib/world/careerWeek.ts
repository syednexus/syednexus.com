import type { CareerDayEvent, CareerWeekState } from "@/lib/world/types";
import { getDifficultyModifier } from "@/lib/world/organizations";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

export function currentWeekId(): string {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getUTCDay() + 1) / 7);
  return `${now.getUTCFullYear()}-W${week}`;
}

export function todayDayIndex(): number {
  const day = new Date().getDay();
  if (day === 0 || day === 6) return 4;
  return day - 1;
}

export function weekdayLabel(index: number): string {
  return WEEKDAYS[Math.max(0, Math.min(4, index))] ?? "Friday";
}

function baseEvents(dayIndex: number, modifier: ReturnType<typeof getDifficultyModifier>): CareerDayEvent[] {
  const critical = modifier === "critical";
  const templates: CareerDayEvent[][] = [
    [
      { id: "mon-email", type: "email", title: "Week kickoff from manager", body: "Prioritize phishing queue before noon.", priority: "medium", resolved: false },
      { id: "mon-ticket", type: "ticket", title: "INC-3301 — Suspicious login", body: "User reported impossible travel alert.", priority: "high", resolved: false },
      { id: "mon-alert", type: "alert", title: "SIEM: Brute force spike", body: "47 SSH failures on bastion host.", priority: critical ? "critical" : "high", resolved: false }
    ],
    [
      { id: "tue-meeting", type: "meeting", title: "Standup with SOC lead", body: "Share IOCs from yesterday's case.", priority: "low", resolved: false },
      { id: "tue-email", type: "email", title: "Compliance reminder", body: "Complete incident notes within 24h.", priority: "medium", resolved: false },
      { id: "tue-ticket", type: "ticket", title: "INC-3308 — Malware beacon", body: "DNS periodic callback detected.", priority: "critical", resolved: false }
    ],
    [
      { id: "wed-alert", type: "alert", title: "EDR: PowerShell abuse", body: "Encoded command on finance workstation.", priority: "high", resolved: false },
      { id: "wed-ticket", type: "ticket", title: "INC-3312 — Data exfil attempt", body: "Large outbound transfer to unknown IP.", priority: "critical", resolved: false },
      { id: "wed-deadline", type: "deadline", title: "Executive brief due 17:00", body: "Summarize open critical incidents.", priority: "high", resolved: false }
    ],
    [
      { id: "thu-email", type: "email", title: "Threat intel feed", body: "New APT IOC list published.", priority: "medium", resolved: false },
      { id: "thu-meeting", type: "meeting", title: "Purple team sync", body: "Review detection gaps from exercise.", priority: "low", resolved: false },
      { id: "thu-alert", type: "alert", title: "WAF: SQLi attempts", body: "Repeated injection on storefront API.", priority: "high", resolved: false }
    ],
    [
      { id: "fri-deadline", type: "deadline", title: "Weekly report due", body: "Close all P1/P2 tickets before EOD.", priority: "critical", resolved: false },
      { id: "fri-ticket", type: "ticket", title: "INC-3320 — Phishing campaign", body: "Finance users targeted with MFA bypass lure.", priority: "high", resolved: false },
      { id: "fri-email", type: "email", title: "Manager 1:1", body: "Prepare performance summary for review.", priority: "medium", resolved: false }
    ]
  ];
  return templates[dayIndex] ?? templates[0];
}

export function createCareerWeek(reputation: number): CareerWeekState {
  const modifier = getDifficultyModifier(reputation);
  const dayIndex = todayDayIndex();
  return {
    weekId: currentWeekId(),
    dayIndex,
    events: baseEvents(dayIndex, modifier),
    performanceScore: 0,
    managerReview: null
  };
}

export function advanceCareerDay(state: CareerWeekState, reputation: number): CareerWeekState {
  const nextDay = Math.min(4, state.dayIndex + 1);
  const modifier = getDifficultyModifier(reputation);
  return {
    ...state,
    dayIndex: nextDay,
    events: baseEvents(nextDay, modifier),
    managerReview: null
  };
}

export function resolveCareerEvent(
  state: CareerWeekState,
  eventId: string
): CareerWeekState {
  const events = state.events.map(event =>
    event.id === eventId ? { ...event, resolved: true } : event
  );
  const resolved = events.filter(event => event.resolved).length;
  const performanceScore = Math.round((resolved / events.length) * 100);
  return { ...state, events, performanceScore };
}

export function endWeekReview(score: number): string {
  if (score >= 90) {
    return "Outstanding week. You closed incidents fast and communicated clearly. Promotion track recommended.";
  }
  if (score >= 70) {
    return "Solid performance. Improve documentation speed on P1 cases.";
  }
  if (score >= 50) {
    return "Acceptable but inconsistent. Focus on alert queue discipline.";
  }
  return "Below expectations. Schedule remedial training on triage workflow.";
}

export function isFriday(state: CareerWeekState): boolean {
  return state.dayIndex >= 4;
}

export function isCurrentCareerWeek(week: CareerWeekState | null | undefined): boolean {
  if (!week) return false;
  return week.weekId === currentWeekId();
}

/** Start a new week when the stored weekId is from a prior ISO week. */
export function rolloverCareerWeekIfNeeded(
  stored: CareerWeekState | null,
  reputation: number
): { week: CareerWeekState | null; rolled: boolean; archived: CareerWeekState | null } {
  if (!stored) {
    return { week: null, rolled: false, archived: null };
  }

  if (isCurrentCareerWeek(stored)) {
    return { week: stored, rolled: false, archived: null };
  }

  return {
    week: createCareerWeek(reputation),
    rolled: true,
    archived: stored
  };
}
