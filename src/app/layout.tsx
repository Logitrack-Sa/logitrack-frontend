import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { AppShell } from '@/components/AppShell';
import { ChatWidget } from '@/components/chat/ChatWidget';

export const metadata: Metadata = {
  title: 'LogiTrack — Plataforma de Gestión Logística',
  description: 'Cliente web Next.js integrado al ecosistema de microservicios LogiTrack',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <AuthProvider><Toaster position="top-right" /><AppShell>{children}</AppShell><ChatWidget /></AuthProvider>
      </body>
    </html>
  );
}
