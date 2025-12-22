import { NavLink } from "react-router";
import { Home, PlusCircle, ClipboardList } from "lucide-react";
import useAuth from "../../../hook/useAuth";

const Aside = () => {

  const { role } = useAuth()

  return (
    <aside className="h-screen w-64 bg-gray-900 text-gray-100 flex flex-col">

      {/* Logo */}
      <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-800">
        Blood Donation
      </div>


      {
        role == 'admin' && (
          <h1 className="text-center font-bold text-lg">Admin</h1>
        )
      }
      {
        role == 'dooner' && (
          <h1 className="text-center font-bold text-lg">Dooner</h1>
        )
      }


      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <MenuItem to="/dashboard" icon={<Home size={20} />} label="Dashboard" />

        {
          role == 'donor' && (
            <MenuItem
              to="/dashboard/add-request"
              icon={<PlusCircle size={20} />}
              label="Add Request"
            />
          )
        }

        {
          role == 'admin' && (

            <MenuItem
              to="/dashboard/all-users"
              icon={<PlusCircle size={20} />}
              label="All Users"
            />
          )
        }

        <MenuItem
          to="/dashboard/my-donation-requests"
          icon={<ClipboardList size={20} />}
          label="My Donation Request"
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
      ${isActive
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
