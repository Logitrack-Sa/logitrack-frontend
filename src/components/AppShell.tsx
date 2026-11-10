"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { VerificationBanner } from "@/components/auth/VerificationBanner";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (
    [
      "/login",
      "/register",
      "/verify-email",
      "/forgot-password",
      "/reset-password",
      "/unauthorized",
    ].includes(pathname)
  )
    return <div className="public-page">{children}</div>;
  if (
    ["/", "/servicios", "/ayuda", "/nosotros", "/seguimiento"].includes(
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
    <div className="ops-shell">
      <Sidebar />
      <div className="ops-workspace">
        <DashboardHeader />
        <main className="ops-main">
          <VerificationBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
