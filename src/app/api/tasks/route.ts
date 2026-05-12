import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validations/task";

// GET /api/tasks — list tasks (with optional filters)
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const assigneeId = searchParams.get("assigneeId");

  const tasks = await prisma.task.findMany({
    where: {
      OR: [
        { project: { ownerId: session.user.id } },
        { project: { members: { some: { userId: session.user.id } } } },
        { assigneeId: session.user.id },
        { createdById: session.user.id },
      ],
      ...(projectId ? { projectId } : {}),
      ...(status ? { status: status as any } : {}),
      ...(priority ? { priority: priority as any } : {}),
      ...(assigneeId ? { assigneeId } : {}),
    },
    include: {
      project: { select: { id: true, name: true, color: true } },
      assignee: { select: { id: true, name: true, avatar: true } },
      createdBy: { select: { id: true, name: true } },
      _count: { select: { comments: true } },
    },
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ tasks });
}

// POST /api/tasks — create task
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  // Verify user is a member of the project
  const projectAccess = await prisma.project.findFirst({
    where: {
      id: parsed.data.projectId,
      OR: [
        { ownerId: session.user.id },
        { members: { some: { userId: session.user.id } } },
      ],
    },
  });

  if (!projectAccess) {
    return NextResponse.json({ error: "Forbidden: Not a member of this project" }, { status: 403 });
  }

  // Get position (last in column)
  const lastTask = await prisma.task.findFirst({
    where: { projectId: parsed.data.projectId, status: parsed.data.status },
    orderBy: { position: "desc" },
  });

  const task = await prisma.task.create({
    data: {
      ...parsed.data,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      assigneeId: parsed.data.assigneeId || null,
      createdById: session.user.id,
      position: (lastTask?.position ?? -1) + 1,
    },
    include: {
      project: { select: { id: true, name: true, color: true } },
      assignee: { select: { id: true, name: true, avatar: true } },
      createdBy: { select: { id: true, name: true } },
      _count: { select: { comments: true } },
    },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      type: "TASK_CREATED",
      message: `created task "${task.title}"`,
      userId: session.user.id,
      projectId: task.projectId,
      taskId: task.id,
    },
  });

  return NextResponse.json({ task }, { status: 201 });
}
