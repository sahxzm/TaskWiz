import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProjectSchema } from "@/lib/validations/project";

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id,
      OR: [
        { ownerId: session.user.id },
        { members: { some: { userId: session.user.id } } },
      ],
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      },
      tasks: {
        include: {
          assignee: { select: { id: true, name: true, avatar: true } },
          createdBy: { select: { id: true, name: true } },
          _count: { select: { comments: true } },
        },
        orderBy: { position: "asc" },
      },
      activity: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      _count: { select: { tasks: true } },
    },
  });

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  return NextResponse.json({ project });
}

// PUT /api/projects/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { 
      id, 
      ...(session.user.role !== "ADMIN" ? { ownerId: session.user.id } : {}) 
    },
  });
  if (!project) return NextResponse.json({ error: "Project not found or forbidden" }, { status: 404 });

  const body = await req.json();
  const parsed = updateProjectSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { memberIds, ...projectData } = parsed.data;

  const updated = await prisma.project.update({
    where: { id },
    data: {
      ...projectData,
      ...(memberIds ? {
        members: {
          deleteMany: {},
          create: Array.from(new Set([...memberIds, project.ownerId])).map(uid => ({
            userId: uid,
            role: uid === project.ownerId ? "OWNER" : "MEMBER"
          }))
        }
      } : {})
    },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
      _count: { select: { tasks: true } },
    },
  });

  return NextResponse.json({ project: updated });
}

// DELETE /api/projects/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { 
      id, 
      ...(session.user.role !== "ADMIN" ? { ownerId: session.user.id } : {}) 
    },
  });
  if (!project) return NextResponse.json({ error: "Project not found or forbidden" }, { status: 404 });

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ message: "Project deleted" });
}
