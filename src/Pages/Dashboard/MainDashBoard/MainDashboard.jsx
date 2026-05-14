import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../hook/useAuth";

const MainDashboard = () => {
  const { user, authRevision } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    if (!user) return;

    axiosSecure
      .get("/my-donation-requests?size=3&page=0")
      .then(res => {
        setRecentRequests(res.data.request);
      })
      .catch(err => {
        console.error(err);
      });
  }, [axiosSecure, user]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-gray-900" key={authRevision}>
          Welcome, <span className="text-red-500">{user?.displayName || user?.name}</span>
        </h2>
        <p className="text-gray-500 mt-1">
          Check out this snapshot of your latest blood donation inquiries.
        </p>
      </div>

      {/* Recent Requests */}
      {recentRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Donation Requests
            </h3>
            <Link to="/dashboard/my-donation-requests" className="btn btn-sm btn-outline">
              View my all requests
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-gray-100">
                  <th>#</th>
                  <th>Recipient</th>
                  <th>Hospital</th>
                  <th>Blood Group</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request, index) => (
                  <tr key={request._id}>
                    <td>{index + 1}</td>
                    <td>{request.recipientName}</td>
                    <td>{request.hospitalName}</td>
                    <td>{request.bloodGroup}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                          ${
                            request.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : request.status === "done"
                              ? "bg-green-100 text-green-700"
                              : request.status === "canceled"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        `}
                      >
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainDashboard;
