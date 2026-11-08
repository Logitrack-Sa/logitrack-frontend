"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { VerificationBanner } from "@/components/auth/VerificationBanner";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (
    ["/", "/login", "/register", "/verify-email", "/unauthorized"].includes(
      pathname,
    )
  )
    return (
      <div className="public-page">
        <Navbar />
        {children}
      </div>
    );
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="workspace">
        <DashboardHeader />
        <main className="main-content">
          <VerificationBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
