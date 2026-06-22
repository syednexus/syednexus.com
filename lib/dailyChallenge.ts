import { prisma } from "@/lib/prisma";
import { PUBLIC_MISSION_SELECT } from "@/lib/publicMission";

export function utcToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function utcYesterday(from: Date = utcToday()): Date {
  const date = new Date(from);
  date.setUTCDate(date.getUTCDate() - 1);
  return date;
}

export function isSameUtcDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

export async function getOrCreateDailyChallenge() {
  const today = utcToday();

  const existing = await prisma.dailyChallenge.findUnique({
    where: { date: today },
    include: {
      mission: {
        select: PUBLIC_MISSION_SELECT
      }
    }
  });

  if (existing) {
    return existing;
  }

  const activeMissions = await prisma.mission.findMany({
    where: { active: true },
    select: { id: true }
  });

  if (activeMissions.length === 0) {
    return null;
  }

  const pick = activeMissions[Math.floor(Math.random() * activeMissions.length)];

  try {
    return await prisma.dailyChallenge.create({
      data: {
        missionId: pick.id,
        date: today
      },
      include: {
        mission: {
          select: PUBLIC_MISSION_SELECT
        }
      }
    });
  } catch {
    return prisma.dailyChallenge.findUnique({
      where: { date: today },
      include: {
        mission: {
          select: PUBLIC_MISSION_SELECT
        }
      }
    });
  }
}

export async function getUserStreak(userId: string | null) {
  if (!userId) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null as Date | null
    };
  }

  const streak = await prisma.userStreak.findUnique({
    where: { userId }
  });

  return {
    currentStreak: streak?.currentStreak ?? 0,
    longestStreak: streak?.longestStreak ?? 0,
    lastCompletedDate: streak?.lastCompletedDate ?? null
  };
}

export async function updateUserStreakOnDailyComplete(userId: string) {
  const today = utcToday();
  const yesterday = utcYesterday(today);

  const existing = await prisma.userStreak.findUnique({
    where: { userId }
  });

  if (existing?.lastCompletedDate && isSameUtcDay(existing.lastCompletedDate, today)) {
    return existing;
  }

  let currentStreak = 1;

  if (existing?.lastCompletedDate && isSameUtcDay(existing.lastCompletedDate, yesterday)) {
    currentStreak = existing.currentStreak + 1;
  }

  const longestStreak = Math.max(currentStreak, existing?.longestStreak ?? 0);

  return prisma.userStreak.upsert({
    where: { userId },
    create: {
      userId,
      currentStreak,
      longestStreak,
      lastCompletedDate: today
    },
    update: {
      currentStreak,
      longestStreak,
      lastCompletedDate: today
    }
  });
}

export async function isDailyMissionCompleteToday(
  userId: string | null,
  missionId: number
) {
  if (!userId) {
    return false;
  }

  const progress = await prisma.missionProgress.findUnique({
    where: {
      missionId_userId: {
        missionId,
        userId
      }
    }
  });

  if (!progress?.completed || !progress.completedAt) {
    return false;
  }

  return isSameUtcDay(progress.completedAt, utcToday());
}

export async function isDailyMissionComplete(userId: string | null, missionId: number) {
  if (!userId) {
    return false;
  }

  const progress = await prisma.missionProgress.findUnique({
    where: {
      missionId_userId: {
        missionId,
        userId
      }
    }
  });

  return progress?.completed ?? false;
}
