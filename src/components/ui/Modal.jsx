import React, { useEffect } from "react";
import Button from "./Button";

export default function Modal({ open, title, children, onClose, actions }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal modal-open z-50 p-4">
      <div className="modal-box w-full max-w-lg rounded-xl">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="py-3">{children}</div>
        <div className="modal-action">
          {actions || <Button variant="ghost" onClick={onClose}>Close</Button>}
        </div>
      </div>
      <button type="button" className="modal-backdrop bg-black/50" aria-label="Close" onClick={onClose} />
    </div>
  );
}
