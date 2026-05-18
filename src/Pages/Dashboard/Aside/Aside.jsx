import { NavLink } from "react-router";
import {
  Home,
  PlusCircle,
  ClipboardList,
  Wallet,
  ListChecks,
  X,
} from "lucide-react";
import useAuth from "../../../hook/useAuth";
import { RxPerson } from "react-icons/rx";

const Aside = ({ mobileOpen = false, onClose }) => {
  const { role } = useAuth();

  const roleLabel =
    role === "admin"
      ? "Admin"
      : role === "volunteer"
        ? "Volunteer"
        : role === "donor"
          ? "Donor"
          : null;

  const navContent = (
  <>
      <div className="h-14 sm:h-16 flex items-center justify-between lg:justify-center gap-2 px-4 lg:px-3 border-b border-white/10 text-lg sm:text-xl font-bold text-primary-content shrink-0">
        <span className="truncate lg:text-center">Blood Donation</span>
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-square shrink-0 lg:hidden text-primary-content"
          aria-label="Close menu"
          onClick={onClose}
        >
          <X size={22} />
        </button>
      </div>

      {roleLabel && (
        <p className="text-center font-bold text-base sm:text-lg pt-2 text-primary-content/90 shrink-0">
          {roleLabel}
        </p>
      )}

      <nav className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2">
        <MenuItem to="/dashboard" icon={<Home size={20} />} label="Dashboard" onNavigate={onClose} />
        <MenuItem to="/dashboard/profile" icon={<RxPerson size={20} />} label="Profile" onNavigate={onClose} />
        <MenuItem to="/dashboard/funding" icon={<Wallet size={20} />} label="Funding" onNavigate={onClose} />

        {(role === "admin" || role === "volunteer") && (
          <MenuItem
            to="/dashboard/all-blood-donation-request"
            icon={<ListChecks size={20} />}
            label="All donation requests"
            onNavigate={onClose}
          />
        )}

        {role === "donor" && (
          <MenuItem
            to="/dashboard/add-request"
            icon={<PlusCircle size={20} />}
            label="Add request"
            onNavigate={onClose}
          />
        )}

        {role === "admin" && (
          <MenuItem
            to="/dashboard/all-users"
            icon={<PlusCircle size={20} />}
            label="All users"
            onNavigate={onClose}
          />
        )}

        <MenuItem
          to="/dashboard/my-donation-requests"
          icon={<ClipboardList size={20} />}
          label="My donation requests"
          onNavigate={onClose}
        />

        {role === "admin" && (
          <MenuItem
            to="/dashboard/add-volunteer"
            icon={<RxPerson size={20} />}
            label="Add volunteer"
            onNavigate={onClose}
          />
        )}

        <MenuItem to="/" icon={<Home size={20} />} label="Home" onNavigate={onClose} />
      </nav>
  </>
  );

  return (
    <>
      {/* Mobile overlay */}
      <button
        type="button"
        aria-label="Close menu"
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[min(100vw-3rem,18rem)] bg-neutral text-neutral-content flex flex-col shadow-xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-auto lg:h-[calc(100vh-10rem)] lg:sticky lg:top-4 w-64 shrink-0 bg-neutral text-neutral-content flex-col rounded-xl border border-base-300 shadow-sm">
        {navContent}
      </aside>
    </>
  );
};

const MenuItem = ({ to, icon, label, onNavigate }) => (
  <NavLink
    to={to}
    end={to === "/dashboard"}
    onClick={onNavigate}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-sm font-medium transition
      ${isActive
        ? "bg-primary text-primary-content shadow-md"
        : "text-neutral-content/80 hover:bg-white/10 hover:text-primary-content"
      }`
    }
  >
    <span className="shrink-0">{icon}</span>
    <span className="truncate">{label}</span>
  </NavLink>
);

export default Aside;
