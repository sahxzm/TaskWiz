import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/validations/task";

type Params = { params: Promise<{ id: string }> };

// GET /api/tasks/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const task = await prisma.task.findFirst({
    where: {
      id,
      OR: [
        { project: { ownerId: session.user.id } },
        { project: { members: { some: { userId: session.user.id } } } },
        { assigneeId: session.user.id },
        { createdById: session.user.id },
      ],
    },
    include: {
      project: { 
        include: { 
          members: { 
            include: { user: { select: { id: true, name: true, avatar: true } } } 
          } 
        } 
      },
      assignee: { select: { id: true, name: true, avatar: true } },
      createdBy: { select: { id: true, name: true } },
      comments: {
        include: { author: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  return NextResponse.json({ task });
}

// PATCH /api/tasks/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const task = await prisma.task.findFirst({
    where: {
      id,
      OR: [
        { project: { ownerId: session.user.id } },
        { project: { members: { some: { userId: session.user.id } } } },
        { assigneeId: session.user.id },
        { createdById: session.user.id },
      ],
    },
  });
  if (!task) return NextResponse.json({ error: "Task not found or forbidden" }, { status: 404 });

  const body = await req.json();
  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const updated = await prisma.task.update({
    where: { id },
    data: {
      ...parsed.data,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : parsed.data.dueDate,
      assigneeId: parsed.data.assigneeId ?? task.assigneeId,
    },
    include: {
      project: { select: { id: true, name: true, color: true } },
      assignee: { select: { id: true, name: true, avatar: true } },
      createdBy: { select: { id: true, name: true } },
      _count: { select: { comments: true } },
    },
  });

  // Log status change
  if (parsed.data.status && parsed.data.status !== task.status) {
    await prisma.activityLog.create({
      data: {
        type: "STATUS_CHANGED",
        message: `moved "${updated.title}" to ${parsed.data.status.replace("_", " ")}`,
        userId: session.user.id,
        projectId: updated.projectId,
        taskId: updated.id,
      },
    });
  }

  return NextResponse.json({ task: updated });
}

// DELETE /api/tasks/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const task = await prisma.task.findFirst({
    where: {
      id,
      OR: [
        { project: { ownerId: session.user.id } },
        { project: { members: { some: { userId: session.user.id } } } },
        { assigneeId: session.user.id },
        { createdById: session.user.id },
      ],
    },
  });
  if (!task) return NextResponse.json({ error: "Task not found or forbidden" }, { status: 404 });

  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ message: "Task deleted" });
}
