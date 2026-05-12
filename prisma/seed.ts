import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.activityLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash("Admin1234", 12);
  const memberPassword = await bcrypt.hash("Member1234", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Alex Johnson",
      email: "admin@taskwiz.app",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const sarah = await prisma.user.create({
    data: {
      name: "Sarah Chen",
      email: "sarah@taskwiz.app",
      password: memberPassword,
      role: "MEMBER",
    },
  });

  const marcus = await prisma.user.create({
    data: {
      name: "Marcus Rivera",
      email: "marcus@taskwiz.app",
      password: memberPassword,
      role: "MEMBER",
    },
  });

  const priya = await prisma.user.create({
    data: {
      name: "Priya Patel",
      email: "priya@taskwiz.app",
      password: memberPassword,
      role: "MEMBER",
    },
  });

  console.log("✅ Created 4 users");

  // Create projects
  const websiteProject = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Complete overhaul of the company website with new design system",
      color: "#8b5cf6",
      icon: "🚀",
      ownerId: admin.id,
      members: {
        create: [
          { userId: admin.id, role: "OWNER" },
          { userId: sarah.id, role: "ADMIN" },
          { userId: marcus.id, role: "MEMBER" },
        ],
      },
    },
  });

  const mobileProject = await prisma.project.create({
    data: {
      name: "Mobile App v2",
      description: "Next generation mobile app with new features and improved UX",
      color: "#f43f5e",
      icon: "📱",
      ownerId: admin.id,
      members: {
        create: [
          { userId: admin.id, role: "OWNER" },
          { userId: priya.id, role: "ADMIN" },
          { userId: sarah.id, role: "MEMBER" },
        ],
      },
    },
  });

  const analyticsProject = await prisma.project.create({
    data: {
      name: "Analytics Dashboard",
      description: "Real-time analytics and reporting system for business insights",
      color: "#10b981",
      icon: "📊",
      ownerId: marcus.id,
      members: {
        create: [
          { userId: marcus.id, role: "OWNER" },
          { userId: admin.id, role: "MEMBER" },
          { userId: priya.id, role: "MEMBER" },
        ],
      },
    },
  });

  console.log("✅ Created 3 projects");

  // Create tasks for Website Redesign
  const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  const farFutureDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const tasks = await Promise.all([
    // Website tasks
    prisma.task.create({
      data: {
        title: "Design new landing page hero section",
        description: "Create a modern, conversion-optimized hero section with animated elements",
        status: "COMPLETED",
        priority: "HIGH",
        dueDate: pastDate,
        position: 0,
        projectId: websiteProject.id,
        assigneeId: sarah.id,
        createdById: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Implement design system tokens",
        description: "Set up CSS custom properties for colors, typography, and spacing",
        status: "COMPLETED",
        priority: "HIGH",
        dueDate: pastDate,
        position: 1,
        projectId: websiteProject.id,
        assigneeId: marcus.id,
        createdById: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Build responsive navigation component",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: futureDate,
        position: 0,
        projectId: websiteProject.id,
        assigneeId: marcus.id,
        createdById: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Write homepage copy and content",
        description: "Work with marketing team to create compelling copy",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        dueDate: futureDate,
        position: 1,
        projectId: websiteProject.id,
        assigneeId: sarah.id,
        createdById: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "SEO optimization and meta tags",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: farFutureDate,
        position: 0,
        projectId: websiteProject.id,
        assigneeId: admin.id,
        createdById: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Performance audit and optimization",
        description: "Achieve 95+ Lighthouse score across all pages",
        status: "TODO",
        priority: "HIGH",
        dueDate: farFutureDate,
        position: 1,
        projectId: websiteProject.id,
        createdById: admin.id,
      },
    }),
    // Mobile app tasks
    prisma.task.create({
      data: {
        title: "User authentication flow redesign",
        status: "COMPLETED",
        priority: "HIGH",
        position: 0,
        projectId: mobileProject.id,
        assigneeId: priya.id,
        createdById: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Push notifications implementation",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: futureDate,
        position: 0,
        projectId: mobileProject.id,
        assigneeId: sarah.id,
        createdById: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Offline mode support",
        description: "Implement local caching so app works without internet",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: farFutureDate,
        position: 0,
        projectId: mobileProject.id,
        assigneeId: priya.id,
        createdById: admin.id,
      },
    }),
    // Analytics tasks
    prisma.task.create({
      data: {
        title: "Set up data pipeline",
        status: "COMPLETED",
        priority: "HIGH",
        position: 0,
        projectId: analyticsProject.id,
        assigneeId: marcus.id,
        createdById: marcus.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Build revenue tracking charts",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        dueDate: futureDate,
        position: 0,
        projectId: analyticsProject.id,
        assigneeId: admin.id,
        createdById: marcus.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Export to CSV/PDF feature",
        status: "TODO",
        priority: "LOW",
        dueDate: farFutureDate,
        position: 0,
        projectId: analyticsProject.id,
        createdById: marcus.id,
      },
    }),
  ]);

  console.log(`✅ Created ${tasks.length} tasks`);

  // Add comments
  await prisma.comment.create({
    data: {
      content: "Great work on this! The hero section looks amazing. Let's ship it! 🚀",
      taskId: tasks[0].id,
      authorId: admin.id,
    },
  });
  await prisma.comment.create({
    data: {
      content: "I added some extra micro-animations too, hope you like them.",
      taskId: tasks[0].id,
      authorId: sarah.id,
    },
  });
  await prisma.comment.create({
    data: {
      content: "Working on the mobile breakpoints right now, should be done by EOD.",
      taskId: tasks[2].id,
      authorId: marcus.id,
    },
  });

  console.log("✅ Created sample comments");

  // Add activity logs
  await Promise.all([
    prisma.activityLog.create({ data: { type: "PROJECT_CREATED", message: 'created project "Website Redesign"', userId: admin.id, projectId: websiteProject.id } }),
    prisma.activityLog.create({ data: { type: "TASK_CREATED", message: 'created task "Design new landing page hero section"', userId: admin.id, projectId: websiteProject.id, taskId: tasks[0].id } }),
    prisma.activityLog.create({ data: { type: "STATUS_CHANGED", message: 'moved "Design new landing page hero section" to COMPLETED', userId: sarah.id, projectId: websiteProject.id, taskId: tasks[0].id } }),
    prisma.activityLog.create({ data: { type: "COMMENT_ADDED", message: 'commented on "Design new landing page hero section"', userId: admin.id, projectId: websiteProject.id, taskId: tasks[0].id } }),
    prisma.activityLog.create({ data: { type: "PROJECT_CREATED", message: 'created project "Mobile App v2"', userId: admin.id, projectId: mobileProject.id } }),
    prisma.activityLog.create({ data: { type: "STATUS_CHANGED", message: 'moved "Push notifications implementation" to IN PROGRESS', userId: sarah.id, projectId: mobileProject.id, taskId: tasks[7].id } }),
  ]);

  console.log("✅ Created activity logs");
  console.log("\n✨ Seed complete! Login with:");
  console.log("   Admin:  admin@taskwiz.app / Admin1234");
  console.log("   Member: sarah@taskwiz.app / Member1234");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
