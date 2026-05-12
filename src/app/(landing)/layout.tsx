import type { Metadata } from "next";

export const metadata: Metadata = { title: "TaskWiz" };

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
