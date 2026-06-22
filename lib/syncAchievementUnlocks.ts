import { prisma } from "@/lib/prisma";

type UnlockedAchievement = {
  id: number;
  name: string;
  description: string;
  icon: string | null;
};

export async function syncAchievementUnlocks(userId: string): Promise<UnlockedAchievement[]> {
  const [achievements, user] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { id: "asc" } }),
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        missionProgress: true,
        achievementUnlocks: true
      }
    })
  ]);

  if (!user) {
    return [];
  }

  const xp = user.missionProgress.reduce((total, item) => total + item.score, 0);
  const alreadyUnlocked = new Set(user.achievementUnlocks.map(item => item.achievementId));

  const toUnlock = achievements.filter(achievement => {
    const required = Number(achievement.requirement.replace(/\D/g, "")) || 0;
    return !alreadyUnlocked.has(achievement.id) && xp >= required;
  });

  if (toUnlock.length === 0) {
    return [];
  }

  await prisma.achievementUnlock.createMany({
    data: toUnlock.map(achievement => ({
      achievementId: achievement.id,
      userId
    })),
    skipDuplicates: true
  });

  return toUnlock.map(achievement => ({
    id: achievement.id,
    name: achievement.name,
    description: achievement.description,
    icon: achievement.icon
  }));
}

export async function getAnalystSummary(userId: string) {
  const progress = await prisma.missionProgress.findMany({
    where: { userId, completed: true }
  });

  const xp = progress.reduce((total, item) => total + item.score, 0);
  const completed = progress.length;

  let rank = "TRAINEE ANALYST";
  let next = 500;

  if (xp >= 5000) {
    rank = "RED TEAM OPERATOR";
    next = 10000;
  } else if (xp >= 3000) {
    rank = "THREAT HUNTER";
    next = 5000;
  } else if (xp >= 1500) {
    rank = "INCIDENT RESPONDER";
    next = 3000;
  } else if (xp >= 500) {
    rank = "SOC TIER 1 ANALYST";
    next = 1500;
  }

  return {
    xp,
    rank,
    completed,
    next,
    progress: Math.min(Math.round((xp / next) * 100), 100)
  };
}
