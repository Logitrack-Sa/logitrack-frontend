import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { PasswordRecoveryForm } from "@/components/auth/PasswordRecoveryForm";

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout
      title="Recuperá tu acceso"
      subtitle="Ingresá el correo registrado en tu cuenta."
      badgeText="Mi cuenta"
    >
      <PasswordRecoveryForm />
    </AuthSplitLayout>
  );
}
