"use client";
import { useEffect, useRef } from "react";
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog ref={ref} className="modal" aria-label={title} onCancel={onClose}>
      <header className="section-heading">
        <h2>{title}</h2>
        <button
          type="button"
          className="text-button"
          aria-label="Cerrar diálogo"
          onClick={onClose}
        >
          ✕
        </button>
      </header>
      {children}
    </dialog>
  );
}
