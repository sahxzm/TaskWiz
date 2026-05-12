import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard/stats
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const now = new Date();

  const [totalTasks, completedTasks, overdueTasks, activeProjects, inProgressTasks, recentActivity] =
    await Promise.all([
      prisma.task.count({
        where: {
          project: {
            OR: [{ ownerId: userId }, { members: { some: { userId } } }],
          },
        },
      }),
      prisma.task.count({
        where: {
          status: "COMPLETED",
          project: {
            OR: [{ ownerId: userId }, { members: { some: { userId } } }],
          },
        },
      }),
      prisma.task.count({
        where: {
          status: { not: "COMPLETED" },
          dueDate: { lt: now },
          project: {
            OR: [{ ownerId: userId }, { members: { some: { userId } } }],
          },
        },
      }),
      prisma.project.count({
        where: {
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
      }),
      prisma.task.count({
        where: {
          status: "IN_PROGRESS",
          project: {
            OR: [{ ownerId: userId }, { members: { some: { userId } } }],
          },
        },
      }),
      prisma.activityLog.findMany({
        where: {
          project: {
            OR: [{ ownerId: userId }, { members: { some: { userId } } }],
          },
        },
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

  return NextResponse.json({
    stats: { totalTasks, completedTasks, overdueTasks, activeProjects, inProgressTasks },
    recentActivity,
  });
}
