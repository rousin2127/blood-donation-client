import React from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { ChevronDown, Menu } from "lucide-react";
import useAuth from "../../hook/useAuth";
import ThemeToggle from "../../components/ThemeToggle";
import { toastSuccess } from "../../utils/toast";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive ? "bg-primary text-primary-content" : "hover:bg-base-200"
  }`;

const Navbar = () => {
  const { user, logOut, authRevision, role } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut()
      .then(() => {
        toastSuccess("Logged out successfully.");
        navigate("/login", { replace: true });
      })
      .catch(console.error);
  };

  const publicLinks = (
    <>
      <li><NavLink to="/" className={linkClass} end>Home</NavLink></li>
      <li><NavLink to="/explore" className={linkClass}>Explore</NavLink></li>
      <li><NavLink to="/donation-requests" className={linkClass}>Requests</NavLink></li>
      <li><NavLink to="/search" className={linkClass}>Find donors</NavLink></li>
      <li><NavLink to="/about" className={linkClass}>About</NavLink></li>
      <li><NavLink to="/contact" className={linkClass}>Contact</NavLink></li>
    </>
  );

  const authExtraLinks = user ? (
    <>
      <li><NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink></li>
      <li><NavLink to="/dashboard/my-donation-requests" className={linkClass}>My requests</NavLink></li>
      <li><NavLink to="/dashboard/funding" className={linkClass}>Funding</NavLink></li>
      {role === "donor" && (
        <li><NavLink to="/dashboard/add-request" className={linkClass}>Add request</NavLink></li>
      )}
    </>
  ) : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-base-300 bg-base-100/95 backdrop-blur-md shadow-sm">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16">
        <div className="navbar-start gap-2">
          <div className="dropdown lg:hidden">
            <button type="button" tabIndex={0} className="btn btn-ghost btn-square" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-xl z-50 mt-3 w-64 p-2 shadow-lg border border-base-300 max-h-[80vh] overflow-y-auto">
              {publicLinks}
              {authExtraLinks}
              {!user && (
                <li className="mt-2 border-t border-base-300 pt-2">
                  <NavLink to="/login" className="text-primary font-semibold">Login</NavLink>
                </li>
              )}
            </ul>
          </div>
          <Link to="/" className="text-xl font-bold tracking-tight">
            <span className="text-primary">Blood</span>
            <span className="text-base-content">Care</span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            {publicLinks}
            {authExtraLinks}
          </ul>
        </div>

        <div className="navbar-end gap-1 sm:gap-2">
          <ThemeToggle />
          {!user ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex rounded-xl">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm rounded-xl">Register</Link>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <button type="button" tabIndex={0} className="btn btn-ghost gap-2 rounded-xl pr-2">
                <div className="avatar">
                  <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                    <img
                      alt=""
                      key={`${user?.photoURL || ""}-${authRevision}`}
                      src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                    />
                  </div>
                </div>
                <span className="hidden md:inline max-w-[8rem] truncate text-sm font-medium" key={authRevision}>
                  {user?.displayName || "Account"}
                </span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-xl z-50 w-56 p-2 shadow-lg border border-base-300 mt-2">
                <li className="menu-title px-2 text-xs">{role || "donor"}</li>
                <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                <li><NavLink to="/dashboard/profile">Profile</NavLink></li>
                <li><NavLink to="/dashboard/my-donation-requests">My requests</NavLink></li>
                <li><NavLink to="/dashboard/funding">Funding</NavLink></li>
                <li className="border-t border-base-300 mt-1 pt-1">
                  <button type="button" onClick={handleLogOut}>Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
