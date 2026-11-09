import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "@fontsource-variable/inter";
import "./globals.css";
import "./workspace.css";
import "./auth.css";
import { AuthProvider } from "@/hooks/useAuth";
import { AppShell } from "@/components/AppShell";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { withBasePath } from "@/lib/deployment";

export const metadata: Metadata = {
  title: "LogiTrack — Plataforma de Gestión Logística",
  description:
    "Organizá tus envíos, consultá su recorrido y gestioná cada entrega desde un solo lugar.",
  icons: {
    icon: withBasePath("/LOGO_GENERAL.png"),
    shortcut: withBasePath("/LOGO_GENERAL.png"),
    apple: withBasePath("/LOGO_GENERAL.png"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <AuthProvider>
          <Toaster position="top-right" />
          <AppShell>{children}</AppShell>
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
