import React, { useEffect, useState, useMemo } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../hook/useAuth";
import { toastApiError, toastError, toastSuccess, toastWarning } from "../../../utils/toast";

const sameId = (a, b) => String(a) === String(b);

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const loadUsers = () => {
    setLoading(true);
    axiosSecure
      .get("/users")
      .then((res) => {
        setUsers(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        toastError("Failed to load users.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [axiosSecure]);

  const filteredUsers = useMemo(() => {
    if (statusFilter === "all") return users;
    return users.filter((u) => u.status === statusFilter);
  }, [users, statusFilter]);

  const handleMakeAdmin = async (id, userEmail) => {
    const ok = window.confirm(
      `Make admin: ${userEmail}? They will have full access.`
    );
    if (!ok) return;
    try {
      const res = await axiosSecure.patch(`/users/make-admin/${id}`);
      if (res.data?.modifiedCount > 0) {
        setUsers((prev) =>
          prev.map((u) => (sameId(u._id, id) ? { ...u, role: "admin" } : u))
        );
        toastSuccess(`${userEmail} is now admin.`);
      } else {
        toastWarning("No changes applied.");
      }
    } catch (e) {
      console.error(e);
      toastApiError(e, "Failed to make admin.");
    }
  };

  const handleMakeVolunteer = async (id, userEmail) => {
    const ok = window.confirm(`Give volunteer role to: ${userEmail}?`);
    if (!ok) return;
    try {
      const res = await axiosSecure.patch(`/users/make-volunteer/${id}`);
      if (res.data?.modifiedCount > 0) {
        setUsers((prev) =>
          prev.map((u) =>
            sameId(u._id, id) ? { ...u, role: "volunteer" } : u
          )
        );
        toastSuccess(`${userEmail} is now volunteer.`);
      } else {
        toastWarning("No changes applied.");
      }
    } catch (e) {
      console.error(e);
      toastApiError(e, "Failed to make volunteer.");
    }
  };

  const handleBlockUser = async (id, userEmail) => {
    if (currentUser?.email && userEmail === currentUser.email) {
      toastWarning("You cannot block yourself.");
      return;
    }
    const confirmBlock = window.confirm(
      `Are you sure you want to block user: ${userEmail}?`
    );
    if (!confirmBlock) return;
    try {
      const response = await axiosSecure.patch(`/users/block/${id}`);
      if (response.data.modifiedCount > 0) {
        setUsers((prev) =>
          prev.map((u) =>
            sameId(u._id, id) ? { ...u, status: "blocked" } : u
          )
        );
        toastSuccess(`User ${userEmail} has been blocked.`);
      } else {
        toastError("Failed to block user. Please try again.");
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      toastApiError(error, "Error blocking user. Please try again.");
    }
  };

  const handleUnblockUser = async (id, userEmail) => {
    const confirmUnblock = window.confirm(
      `Are you sure you want to unblock user: ${userEmail}?`
    );
    if (!confirmUnblock) return;
    try {
      const response = await axiosSecure.patch(`/users/unblock/${id}`);
      if (response.data.modifiedCount > 0) {
        setUsers((prev) =>
          prev.map((u) =>
            sameId(u._id, id) ? { ...u, status: "active" } : u
          )
        );
        toastSuccess(`User ${userEmail} has been unblocked.`);
      } else {
        toastError("Failed to unblock user. Please try again.");
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      toastApiError(error, "Error unblocking user. Please try again.");
    }
  };

  const roleBadgeClass = (role) => {
    if (role === "admin") return "bg-purple-100 text-purple-700";
    if (role === "volunteer") return "bg-amber-100 text-amber-800";
    return "bg-blue-100 text-blue-700";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          All Users ({filteredUsers.length})
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter:</span>
          <select
            className="select select-bordered select-sm w-full max-w-xs"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1 sm:mx-0">
        <table className="table table-sm sm:table-md w-full min-w-[600px]">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td>{index + 1}</td>
                <td className="flex items-center gap-3">
                  <img
                    src={
                      user.photoURL ||
                      "https://i.ibb.co/4pDNDk1/avatar.png"
                    }
                    alt="user"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium">
                    {user.displayName || user.name}
                  </span>
                </td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${roleBadgeClass(
                      user.role
                    )}`}
                  >
                    {user.role || "donor"}
                  </span>
                </td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="flex flex-wrap justify-center gap-2">
                    {user.role !== "admin" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleMakeAdmin(user._id, user.email)
                        }
                        className="btn btn-xs btn-outline btn-primary"
                      >
                        Make Admin
                      </button>
                    )}
                    {user.role === "donor" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleMakeVolunteer(user._id, user.email)
                        }
                        className="btn btn-xs btn-outline btn-warning"
                      >
                        Make Volunteer
                      </button>
                    )}
                    {user.status === "active" ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleBlockUser(user._id, user.email)
                        }
                        className="btn btn-xs btn-outline btn-error"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleUnblockUser(user._id, user.email)
                        }
                        className="btn btn-xs btn-outline btn-success"
                      >
                        Unblock
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;