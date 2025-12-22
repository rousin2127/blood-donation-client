import { NavLink } from "react-router";
import { Home, PlusCircle, ClipboardList } from "lucide-react";

const Aside = () => {
  return (
    <aside className="h-screen w-64 bg-gray-900 text-gray-100 flex flex-col">
      
      {/* Logo */}
      <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-800">
        Blood Donation
      </div>

      <h1>Addmin Panel</h1>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <MenuItem to="/dashboard" icon={<Home size={20} />} label="Dashboard" />
        <MenuItem
          to="/dashboard/add-request"
          icon={<PlusCircle size={20} />}
          label="Add Request"
        />
        <MenuItem
          to="/dashboard/manage-request"
          icon={<ClipboardList size={20} />}
          label="Manage Request"
        />
        <MenuItem to="/" icon={<Home size={20} />} label="Home" />
      </nav>
    </aside>
  );
};

const MenuItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
      ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default Aside;
