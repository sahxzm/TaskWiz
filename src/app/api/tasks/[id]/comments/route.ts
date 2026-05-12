import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCommentSchema } from "@/lib/validations/task";

type Params = { params: Promise<{ id: string }> };

// POST /api/tasks/[id]/comments
export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: taskId } = await params;

  const body = await req.json();
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        OR: [
          { ownerId: session.user.id },
          { members: { some: { userId: session.user.id } } },
        ],
      },
    },
  });
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  const comment = await prisma.comment.create({
    data: {
      content: parsed.data.content,
      taskId,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
    },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      type: "COMMENT_ADDED",
      message: `commented on "${task.title}"`,
      userId: session.user.id,
      projectId: task.projectId,
      taskId: task.id,
    },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
