import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function clean() {
  console.log("Cleaning database...");
  await prisma.activityLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  console.log("Database cleaned!");
}

clean().catch(console.error).finally(() => prisma.$disconnect());
