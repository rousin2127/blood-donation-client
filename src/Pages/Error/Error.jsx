import React from "react";
import { Link, isRouteErrorResponse, useNavigate, useRouteError } from "react-router";


export function RouteErrorBoundary() {
  const error = useRouteError();
  const { title, message, statusCode } = normalizeError(error);
  return (
    <ErrorPageShell
      statusCode={statusCode}
      title={title}
      message={message}
      showHome
      showBack
    />
  );
}


export default function ErrorPage({
  statusCode = 404,
  title = "Page not found",
  message = "The page you are looking for does not exist or has been moved.",
}) {
  return (
    <ErrorPageShell
      statusCode={statusCode}
      title={title}
      message={message}
      showHome
      showBack
    />
  );
}

function normalizeError(error) {
  if (isRouteErrorResponse(error)) {
    const statusCode = error.status;
    const title =
      statusCode === 404
        ? "Page not found"
        : statusCode >= 500
          ? "Server error"
          : "Something went wrong";
    const message =
      typeof error.data === "string" && error.data
        ? error.data
        : error.statusText || "The request could not be completed.";
    return { title, message, statusCode };
  }
  if (error instanceof Error) {
    return {
      title: "Unexpected error",
      message: error.message || "Something went wrong.",
      statusCode: 500,
    };
  }
  return {
    title: "Something went wrong",
    message: "An unexpected error occurred.",
    statusCode: 500,
  };
}

function ErrorPageShell({ statusCode, title, message, showHome, showBack }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          BloodCare
        </p>
        <div className="inline-flex items-baseline justify-center gap-1 text-primary">
          <span className="text-7xl sm:text-8xl font-black tabular-nums leading-none tracking-tight">
            {statusCode}
          </span>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
            {title}
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base leading-relaxed">
            {message}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {showHome && (
            <Link to="/" className="btn btn-primary">
              Go home
            </Link>
          )}
          {showBack && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(-1)}
            >
              Go back
            </button>
          )}
          <Link to="/search" className="btn btn-ghost">
            Find donors
          </Link>
        </div>
      </div>
    </div>
  );
}
