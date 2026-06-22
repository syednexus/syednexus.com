import { profile as fallbackProfile } from "@/data/profile";

export type NexusProfile = typeof fallbackProfile;

const STORAGE_KEY = "nexus_data_cache_v1";
const CACHE_TTL_MS = 5 * 60 * 1000;

type CacheEntry = {
  data: NexusProfile;
  savedAt: number;
};

let memoryCache: CacheEntry | null = null;
let inflight: Promise<NexusProfile> | null = null;

function readSessionCache(): CacheEntry | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CacheEntry;
    if (!parsed?.data || !parsed.savedAt) {
      return null;
    }

    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeSessionCache(data: NexusProfile) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const entry: CacheEntry = {
      data,
      savedAt: Date.now()
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    memoryCache = entry;
  } catch {
    memoryCache = { data, savedAt: Date.now() };
  }
}

function normalizeNexusResponse(json: Record<string, unknown>): NexusProfile {
  const identitySource = json.identity as Record<string, unknown> | undefined;

  const identity = identitySource
    ? {
        ...fallbackProfile.identity,
        ...identitySource,
        email: identitySource.email
          ? [identitySource.email as string]
          : fallbackProfile.identity.email,
        linkedin: (identitySource.linkedin as string) || "",
        github: (identitySource.github as string) || "",
        resume: (identitySource.resume as string) || ""
      }
    : fallbackProfile.identity;

  const education = ((json.education as Record<string, unknown>[]) || []).map(edu => ({
    ...edu,
    focus:
      typeof edu.focus === "string"
        ? edu.focus.split(",").map(x => x.trim())
        : edu.focus
  }));

  const experience = ((json.experience as Record<string, unknown>[]) || []).map(job => ({
    ...job,
    details:
      typeof job.details === "string"
        ? job.details.split(",").map(x => x.trim())
        : job.details
  }));

  const certifications = ((json.certifications as Record<string, unknown>[]) || []).map(cert => ({
    ...cert,
    skills:
      typeof cert.skills === "string"
        ? cert.skills.split(",").map(x => x.trim())
        : cert.skills
  }));

  const projects = ((json.projects as Record<string, unknown>[]) || []).map(project => ({
    ...project,
    technologies:
      typeof project.technologies === "string"
        ? project.technologies.split(",").map(x => x.trim())
        : project.technologies
  }));

  const skillGroups: Record<string, string[]> = {
    cybersecurity: [],
    tools: [],
    networking: [],
    programming: [],
    pharmacy: []
  };

  const skills = json.skills;
  if (Array.isArray(skills)) {
    skills.forEach((skill: { category?: string; name?: string }) => {
      if (skill.category && skillGroups[skill.category]) {
        skillGroups[skill.category].push(String(skill.name));
      }
    });
  } else if (skills && typeof skills === "object") {
    Object.entries(skills as Record<string, string[]>).forEach(([category, names]) => {
      skillGroups[category] = Array.isArray(names) ? names.map(String) : [];
    });
  }

  const blogs = json.blogs as { posts?: unknown[] } | undefined;

  return {
    ...fallbackProfile,
    ...json,
    identity,
    education,
    experience,
    certifications,
    projects,
    skills: skillGroups,
    blogs: blogs?.posts
      ? { posts: blogs.posts, categories: fallbackProfile.blogs.categories }
      : { posts: [], categories: fallbackProfile.blogs.categories }
  } as NexusProfile;
}

export function getInitialNexusData(): NexusProfile {
  const cached = memoryCache || readSessionCache();
  if (cached) {
    return cached.data;
  }

  return {
    ...fallbackProfile,
    identity: {
      ...fallbackProfile.identity,
      name: "Loading profile...",
      headline: "Syncing Nexus database...",
      summary: ""
    },
    education: [],
    experience: [],
    certifications: [],
    projects: [],
    skills: {
      cybersecurity: [],
      tools: [],
      networking: [],
      programming: [],
      pharmacy: []
    },
    blogs: { posts: [], categories: fallbackProfile.blogs.categories }
  };
}

export async function loadNexusData(options?: { force?: boolean }): Promise<NexusProfile> {
  const force = options?.force ?? false;

  if (!force) {
    const cached = memoryCache || readSessionCache();
    if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS) {
      memoryCache = cached;
      return cached.data;
    }
  }

  if (inflight) {
    return inflight;
  }

  inflight = (async () => {
    const res = await fetch("/api/nexus", {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error("Nexus API offline");
    }

    const json = await res.json();
    const data = normalizeNexusResponse(json);
    writeSessionCache(data);
    return data;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export function invalidateNexusDataCache() {
  memoryCache = null;
  inflight = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
