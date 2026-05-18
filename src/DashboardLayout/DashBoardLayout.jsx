import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Menu } from "lucide-react";
import Aside from "../Pages/Dashboard/Aside/Aside";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/dashboard/profile": "Profile",
  "/dashboard/funding": "Funding",
  "/dashboard/add-request": "Add request",
  "/dashboard/all-users": "All users",
  "/dashboard/add-volunteer": "Add volunteer",
  "/dashboard/all-blood-donation-request": "All requests",
  "/dashboard/my-donation-requests": "My requests",
};

function getDashboardTitle(pathname) {
  if (pathname.startsWith("/dashboard/edit-donation-request")) {
    return "Edit request";
  }
  return PAGE_TITLES[pathname] || "Dashboard";
}

const DashBoardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageTitle = getDashboardTitle(location.pathname);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-10rem)] bg-base-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 sm:py-4 gap-3 lg:gap-4">
      <Aside
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col gap-3 lg:gap-0">
        <header className="lg:hidden flex items-center justify-between gap-3 rounded-xl bg-base-100 border border-base-300 shadow-sm px-4 py-3 shrink-0">
          <button
            type="button"
            className="btn btn-square btn-ghost btn-sm"
            aria-label="Open dashboard menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-base-content truncate">
            {pageTitle}
          </span>
          <span className="w-9" aria-hidden />
        </header>

        <main className="flex-1 min-w-0 rounded-xl bg-base-100 border border-base-300 shadow-sm p-3 sm:p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashBoardLayout;
