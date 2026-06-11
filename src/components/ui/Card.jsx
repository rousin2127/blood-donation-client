import React from "react";

export default function Card({ children, className = "", padding = "p-4 sm:p-6" }) {
  return (
    <div
      className={`rounded-xl border border-base-300 bg-base-100 shadow-sm ${padding} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardSkeleton({ className = "" }) {
  return (
    <div className={`rounded-xl border border-base-300 bg-base-100 p-4 sm:p-6 animate-pulse ${className}`}>
      <div className="h-4 bg-base-300 rounded w-3/4 mb-3" />
      <div className="h-3 bg-base-300 rounded w-1/2 mb-4" />
      <div className="h-3 bg-base-300 rounded w-full mb-2" />
      <div className="h-3 bg-base-300 rounded w-5/6 mb-4" />
      <div className="h-8 bg-base-300 rounded-xl w-28" />
    </div>
  );
}
