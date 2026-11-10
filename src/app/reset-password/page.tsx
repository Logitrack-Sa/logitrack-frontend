import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { PasswordRecoveryForm } from "@/components/auth/PasswordRecoveryForm";

export const metadata: Metadata = {
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout
      title="Elegí una nueva contraseña"
      subtitle="Confirmá tu nueva contraseña para volver a ingresar."
      badgeText="Mi cuenta"
    >
      <PasswordRecoveryForm reset />
    </AuthSplitLayout>
  );
}
