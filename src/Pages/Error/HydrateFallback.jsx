import React from "react";


export default function HydrateFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-200 px-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        BloodCare
      </p>
      <span className="loading loading-spinner loading-lg text-primary" aria-hidden />
      <p className="text-sm text-base-content/70">Loading BloodCare…</p>
      <span className="sr-only">Loading application</span>
    </div>
  );
}
