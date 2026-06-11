import React from "react";

export default function Input({
  label,
  id,
  error,
  hint,
  className = "",
  wrapperClassName = "",
  ...props
}) {
  const inputId = id || props.name;
  return (
    <label className={`form-control w-full gap-1 ${wrapperClassName}`} htmlFor={inputId}>
      {label && <span className="label-text font-medium">{label}</span>}
      <input
        id={inputId}
        className={`input input-bordered w-full rounded-xl ${error ? "input-error" : ""} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className="text-error text-xs">
          {error}
        </span>
      )}
      {hint && !error && <span className="text-xs text-base-content/60">{hint}</span>}
    </label>
  );
}
