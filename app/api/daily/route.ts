import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  getOrCreateDailyChallenge,
  getUserStreak,
  isDailyMissionCompleteToday,
  isSameUtcDay,
  utcToday
} from "@/lib/dailyChallenge";

export async function GET() {
  try {
    const challenge = await getOrCreateDailyChallenge();

    if (!challenge) {
      return NextResponse.json({
        challenge: null,
        streak: {
          currentStreak: 0,
          longestStreak: 0,
          lastCompletedDate: null,
          dailyCompleted: false
        }
      });
    }

    const session = await getServerSession(authOptions);
    let userId: string | null = null;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
      userId = user?.id ?? null;
    }

    const streak = await getUserStreak(userId);
    const completedToday = await isDailyMissionCompleteToday(userId, challenge.missionId);
    const streakUpdatedToday = Boolean(
      streak.lastCompletedDate && isSameUtcDay(streak.lastCompletedDate, utcToday())
    );

    return NextResponse.json({
      challenge: {
        id: challenge.id,
        missionId: challenge.missionId,
        date: challenge.date.toISOString(),
        mission: challenge.mission
      },
      streak: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastCompletedDate: streak.lastCompletedDate?.toISOString() ?? null,
        dailyCompleted: completedToday || streakUpdatedToday
      }
    });
  } catch (error) {
    console.error("DAILY CHALLENGE API ERROR", error);

    return NextResponse.json(
      {
        challenge: null,
        streak: {
          currentStreak: 0,
          longestStreak: 0,
          lastCompletedDate: null,
          dailyCompleted: false
        }
      },
      { status: 500 }
    );
  }
}
