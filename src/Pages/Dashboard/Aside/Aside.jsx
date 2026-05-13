import { NavLink } from "react-router";
import { Home, PlusCircle, ClipboardList } from "lucide-react";
import useAuth from "../../../hook/useAuth";
import { RxPerson } from "react-icons/rx";

const Aside = () => {

  const { role } = useAuth()

  return (
    <aside className="h-screen w-64 shrink-0 bg-neutral text-neutral-content flex flex-col rounded-xl border border-base-300 shadow-sm">

      {/* Logo */}
      <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-white/10 text-primary-content">
        Blood Donation
      </div>

      {
        role == 'admin' && (
          <h1 className="text-center font-bold text-lg pt-2 text-primary-content/90">Admin</h1>
        )
      }
      {
        role == 'donor' && (
          <h1 className="text-center font-bold text-lg pt-2 text-primary-content/90">Donor</h1>
        )
      }
      {
        role == 'volunteer' && (
          <h1 className="text-center font-bold text-lg pt-2 text-primary-content/90">Volunteer</h1>
        )
      }


      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <MenuItem to="/dashboard" icon={<Home size={20} />} label="Dashboard" />
        <MenuItem to="/dashboard/profile" icon={<RxPerson size={20}/>} label="Profile" />

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

        {
          role == 'admin' && (
            <MenuItem to="/dashboard/add-volunteer" icon={<RxPerson size={20}/>} label="Add Volunteer" />
          )

        }
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
        ? "bg-primary text-primary-content shadow-md"
        : "text-neutral-content/80 hover:bg-white/10 hover:text-primary-content"
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default Aside;
