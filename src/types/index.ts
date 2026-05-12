import { TaskStatus, TaskPriority, Role } from "@prisma/client";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface ProjectWithMembers {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  icon: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  members: ProjectMemberWithUser[];
  _count?: { tasks: number };
}

export interface ProjectMemberWithUser {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
}

export interface TaskWithRelations {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
  position: number;
  projectId: string;
  assigneeId?: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  project?: { id: string; name: string; color: string };
  assignee?: { id: string; name: string; avatar?: string | null } | null;
  createdBy?: { id: string; name: string };
  comments?: CommentWithAuthor[];
  _count?: { comments: number };
}

export interface CommentWithAuthor {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface ActivityLogEntry {
  id: string;
  type: string;
  message: string;
  userId: string;
  projectId?: string | null;
  taskId?: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  activeProjects: number;
  inProgressTasks: number;
}

// Extend next-auth types
declare module "next-auth" {
  interface User {
    role?: string;
    avatar?: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatar?: string;
    };
  }
}
