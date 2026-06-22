import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateMissionAnswer } from "@/lib/security/validateMissionAnswer";
import { getAnalystSummary, syncAchievementUnlocks } from "@/lib/syncAchievementUnlocks";
import {
  getOrCreateDailyChallenge,
  updateUserStreakOnDailyComplete
} from "@/lib/dailyChallenge";

type CompleteBody = {
  missionId?: unknown;
  answer?: unknown;
  score?: unknown;
  worldContext?: {
    completedTasks?: unknown;
    evidence?: unknown;
  };
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as CompleteBody;

    if (typeof body.missionId !== "number") {
      return NextResponse.json(
        { success: false, error: "Invalid missionId" },
        { status: 400 }
      );
    }

    if (typeof body.answer !== "string" || !body.answer.trim()) {
      return NextResponse.json(
        { success: false, error: "Answer required" },
        { status: 400 }
      );
    }

    // Reject legacy client-trusted score payloads
    if (typeof body.score === "number") {
      return NextResponse.json(
        { success: false, error: "Score is server-assigned" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User missing" }, { status: 404 });
    }

    const mission = await prisma.mission.findUnique({
      where: { id: body.missionId },
      select: { id: true, answer: true, xp: true, active: true, explanation: true }
    });

    if (!mission || !mission.active) {
      return NextResponse.json({ success: false, error: "Mission not found" }, { status: 404 });
    }

    const existing = await prisma.missionProgress.findUnique({
      where: {
        missionId_userId: {
          missionId: body.missionId,
          userId: user.id
        }
      }
    });

    if (existing?.completed) {
      const analyst = await getAnalystSummary(user.id);
      return NextResponse.json({
        success: true,
        xpAwarded: 0,
        alreadyCompleted: true,
        progress: existing,
        analyst,
        newlyUnlocked: [],
        streak: null,
        explanation: mission.explanation ?? null
      });
    }

    if (!validateMissionAnswer(mission.answer, body.answer)) {
      await prisma.missionProgress.upsert({
        where: {
          missionId_userId: {
            missionId: body.missionId,
            userId: user.id
          }
        },
        update: {
          attempts: { increment: 1 }
        },
        create: {
          missionId: body.missionId,
          userId: user.id,
          completed: false,
          score: 0,
          attempts: 1
        }
      });

      return NextResponse.json(
        { success: false, error: "Incorrect answer" },
        { status: 403 }
      );
    }

    const xpAwarded = mission.xp;

    const progress = await prisma.missionProgress.upsert({
      where: {
        missionId_userId: {
          missionId: body.missionId,
          userId: user.id
        }
      },
      update: {
        completed: true,
        score: xpAwarded,
        attempts: { increment: 1 },
        completedAt: new Date()
      },
      create: {
        missionId: body.missionId,
        userId: user.id,
        completed: true,
        score: xpAwarded,
        attempts: 1,
        completedAt: new Date()
      }
    });

    const newlyUnlocked = await syncAchievementUnlocks(user.id);
    const analyst = await getAnalystSummary(user.id);

    const dailyChallenge = await getOrCreateDailyChallenge();
    let streak = null;

    if (dailyChallenge?.missionId === body.missionId) {
      streak = await updateUserStreakOnDailyComplete(user.id);
    }

    return NextResponse.json({
      success: true,
      xpAwarded,
      progress,
      analyst,
      newlyUnlocked,
      streak,
      explanation: mission.explanation ?? null,
      worldContext: body.worldContext ?? null
    });
  } catch (error) {
    console.error("MISSION COMPLETE ERROR", error);

    return NextResponse.json({ success: false, error: "failed" }, { status: 500 });
  }
}
