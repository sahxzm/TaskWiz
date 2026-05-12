import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createProjectSchema } from "@/lib/validations/project";

// GET /api/projects — list all projects for current user
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: session.user.id },
        { members: { some: { userId: session.user.id } } },
      ],
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      },
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ projects });
}

// POST /api/projects — create new project
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Only admins can create projects" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { memberIds, ...projectData } = parsed.data;

  const project = await prisma.project.create({
    data: {
      ...projectData,
      ownerId: session.user.id,
      members: {
        create: Array.from(new Set([...(memberIds || []), session.user.id])).map((uid) => ({
          userId: uid,
          role: uid === session.user.id ? "OWNER" : "MEMBER",
        })),
      },
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      },
      _count: { select: { tasks: true } },
    },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      type: "PROJECT_CREATED",
      message: `created project "${project.name}"`,
      userId: session.user.id,
      projectId: project.id,
    },
  });

  return NextResponse.json({ project }, { status: 201 });
}
