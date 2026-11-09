"use client";
import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
  hint?: string;
  passwordField?: boolean;
}
export function AuthInput({
  label,
  icon: Icon,
  error,
  hint,
  passwordField,
  id,
  type,
  ...props
}: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="auth-field">
      <label htmlFor={id}>
        {label}
        {!props.required && <span>Opcional</span>}
      </label>
      <div className={"auth-input-wrap" + (error ? " has-error" : "")}>
        <Icon size={17} strokeWidth={1.6} />
        <input
          {...props}
          id={id}
          type={passwordField ? (visible ? "text" : "password") : type}
          aria-invalid={!!error}
          aria-describedby={error || hint ? id + "-help" : undefined}
        />
        {passwordField && (
          <button
            type="button"
            aria-label={
              (visible ? "Ocultar " : "Mostrar ") + label.toLowerCase()
            }
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {(error || hint) && (
        <p
          id={id + "-help"}
          className={error ? "auth-field-error" : "auth-field-hint"}
          role={error ? "alert" : undefined}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
