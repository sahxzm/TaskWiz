<div align="center">
  <img src="public/screenshot/logo.png" alt="TaskWiz Logo" width="120" />
</div>

# ✨ TaskWiz

> Manage your team's tasks like a wizard. A modern, collaborative Kanban-style task management platform built with Next.js.

TaskWiz is a full-stack SaaS application designed for seamless team collaboration. It features drag-and-drop Kanban boards, role-based access control, real-time analytics dashboards, and strict data validation, all wrapped in a premium, glassmorphic UI.

---

## 📸 Screenshots

### Dashboard
![Dashboard](public/screenshot/dashboard.png)

### Kanban Board
![Kanban Board](public/screenshot/landing-page.png)

### Login Page
![Login Page](public/screenshot/login-page.png)

---

## 🚀 Features

- **Drag-and-Drop Kanban Boards:** Visually track work across "To Do", "In Progress", and "Completed" stages using `@dnd-kit`.
- **Role-Based Access Control (RBAC):** `ADMIN` users can create projects and invite members, while `USER` members can collaborate on assigned tasks.
- **Dynamic Task Assignment:** Assign tasks to any user across the platform. Tasks automatically sync to their personal dashboard.
- **Interactive Dashboards:** Real-time analytics showing completion rates, overdue tasks, and recent team activity.
- **Secure Authentication:** Managed by Auth.js (NextAuth v5) with JWT sessions and Bcrypt password hashing.
- **Responsive & Beautiful UI:** Built with Tailwind CSS, featuring subtle micro-animations, glassmorphism, and a sleek dark mode.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [TanStack React Query](https://tanstack.com/query/latest)
- **Drag & Drop:** [@dnd-kit](https://dndkit.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Toasts:** [Sonner](https://sonner.emilkowal.ski/)

### Backend
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Hosted on [Supabase](https://supabase.com/))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Auth.js](https://authjs.dev/) (NextAuth v5)
- **Validation:** [Zod](https://zod.dev/)

---

## 📦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and npm installed. You will also need a PostgreSQL database URL.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/taskwiz.git
   cd taskwiz
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the following keys:
   ```env
   DATABASE_URL="postgresql://username:password@host:port/dbname?schema=public"
   AUTH_SECRET="generate-a-strong-secret-key-here"
   ```

4. **Initialize the Database:**
   Run Prisma to push the schema to your database and generate the client.
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema Overview

The database relies on highly relational architecture:
- **`User`**: Core accounts, stores `ADMIN` or `USER` roles.
- **`Project`**: High-level containers for tasks. Only created by Admins.
- **`ProjectMember`**: A join-table managing team access to specific projects.
- **`Task`**: The core entity, linking to a specific `Project`, `Assignee`, and `Creator`.
- **`Comment`**: Threaded discussion attached to tasks.
- **`ActivityLog`**: System-wide logging for dashboard analytics.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve TaskWiz:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---
*Built with ❤️ by Sahil Singh.*
