import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../hook/useAuth";

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [users, setUsers] = useState([]);
    //const {user}=useAuth()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //  if (!user) return; // wait for user to exist

        axiosSecure.get("/users").then(res => {
            setUsers(res.data);
            setLoading(false);
        });
    }, [axiosSecure]); // add user




    // Handle Block User
    const handleBlockUser = async (id, userEmail) => {
        const confirmBlock = window.confirm(`Are you sure you want to block user: ${userEmail}?`);

        if (!confirmBlock) return;

        try {
            const response = await axiosSecure.patch(`/users/block/${id}`);

            if (response.data.modifiedCount > 0) {
                // Update local state immediately
                setUsers(users.map(user =>
                    user._id === id ? { ...user, status: 'blocked' } : user
                ));
                alert(`User ${userEmail} has been blocked successfully.`);
            } else {
                alert('Failed to block user. Please try again.');
            }
        } catch (error) {
            console.error("Error blocking user:", error);
            alert('Error blocking user. Please try again.');
        }
    };

    // Handle Unblock User
    const handleUnblockUser = async (id, userEmail) => {
        const confirmUnblock = window.confirm(`Are you sure you want to unblock user: ${userEmail}?`);

        if (!confirmUnblock) return;

        try {
            const response = await axiosSecure.patch(`/users/unblock/${id}`);

            if (response.data.modifiedCount > 0) {
                // Update local state immediately
                setUsers(users.map(user =>
                    user._id === id ? { ...user, status: 'active' } : user
                ));
                alert(`User ${userEmail} has been unblocked successfully.`);
            } else {
                alert('Failed to unblock user. Please try again.');
            }
        } catch (error) {
            console.error("Error unblocking user:", error);
            alert('Error unblocking user. Please try again.');
        }
    };


    // if (!user || loading) {
    //     return <p className="text-center mt-10">Loading users...</p>;
    // }

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                All Users ({users.length})
            </h2>

            <div className="overflow-x-auto">
                <table className="table w-full">
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
                        {users.map((user, index) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td>{index + 1}</td>

                                <td className="flex items-center gap-3">
                                    <img
                                        src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                                        alt="user"
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <span className="font-medium">{user.displayName || user.name}</span>
                                </td>

                                <td>{user.email}</td>

                                <td>
                                    <span className={`px-3 py-1 rounded-full text-xs ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>

                                <td>
                                    <span className={`px-3 py-1 rounded-full text-xs ${user.status === "active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>

                                <td className="text-center space-x-2">
                                    {/* Make Admin Button (only for non-admin users) */}
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() => handleMakeAdmin(user._id, user.email)}
                                            className="btn btn-xs btn-outline btn-primary"
                                        >
                                            Make Admin
                                        </button>
                                    )}

                                    {/* Block/Unblock Buttons */}
                                    {user.status === "active" ? (
                                        <button
                                            onClick={() => handleBlockUser(user._id, user.email)}
                                            className="btn btn-xs btn-outline btn-error"
                                        >
                                            Block
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleUnblockUser(user._id, user.email)}
                                            className="btn btn-xs btn-outline btn-success"
                                        >
                                            Unblock
                                        </button>
                                    )}
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