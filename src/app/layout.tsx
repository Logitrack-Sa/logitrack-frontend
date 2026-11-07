import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

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
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
