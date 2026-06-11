import React from "react";

const tones = {
  default: "badge-ghost",
  primary: "badge-primary",
  secondary: "badge-secondary",
  accent: "badge-accent",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  outline: "badge-outline",
};

export default function Badge({ children, tone = "default", className = "" }) {
  return (
    <span className={`badge rounded-lg ${tones[tone] || tones.default} ${className}`}>
      {children}
    </span>
  );
}
