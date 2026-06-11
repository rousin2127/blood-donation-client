import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../hook/useAuth";
import {
  DeleteDonationRequestModal,
  DonationRequestOwnerActions,
  DonationRequestStatusBadge,
  DonorInfoCell,
} from "../DonationRequest/DonorRequestRow";
import DashboardCharts from "./DashboardCharts";

const MainDashboard = () => {
  const { user, authRevision, role } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [recentRequests, setRecentRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadRecent = useCallback(() => {
    if (!user || role !== "donor") {
      setRecentRequests([]);
      return;
    }
    axiosSecure
      .get("/my-donation-requests?size=3&page=0")
      .then((res) => {
        setRecentRequests(res.data.request || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [axiosSecure, user, role]);

  useEffect(() => {
    loadRecent();
  }, [loadRecent, authRevision]);

  useEffect(() => {
    if (!user || (role !== "admin" && role !== "volunteer")) {
      setStats(null);
      return;
    }
    axiosSecure
      .get("/dashboard-stats")
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error(err);
        setStats(null);
      });
  }, [axiosSecure, user, role]);

  return (
    <div className="space-y-4 sm:space-y-6 flex flex-col-reverse gap-8">
      {(role === "admin" || role === "volunteer") && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-base-300 bg-base-100 p-4 sm:p-6 shadow-sm flex gap-3 sm:gap-4 items-center">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Total donors</p>
              <p className="text-2xl font-bold text-base-content">{stats.totalDonors}</p>
            </div>
          </div>
          <div className="rounded-xl border border-base-300 bg-base-100 p-4 sm:p-6 shadow-sm flex gap-3 sm:gap-4 items-center">
            <div className="rounded-lg bg-secondary/10 p-3 text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Total funding</p>
              <p className="text-2xl font-bold text-base-content">
                ${Number(stats.totalFunds || 0).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-base-300 bg-base-100 p-4 sm:p-6 shadow-sm flex gap-3 sm:gap-4 items-center">
            <div className="rounded-lg bg-accent/10 p-3 text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Total donation requests</p>
              <p className="text-2xl font-bold text-base-content">{stats.totalRequests}</p>
            </div>
          </div>
        </div>
      )}

      {(role === "admin" || role === "volunteer") && (
        <DashboardCharts />
      )}

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900" key={authRevision}>
          Welcome, <span className="text-red-500">{user?.displayName || user?.name}</span>
        </h2>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Check out this snapshot of your latest blood donation inquiries.
        </p>
      </div>

      {role === "donor" && recentRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent donation requests
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Up to three of your most recent requests. Use Done or Cancel while a match is in progress.
            </p>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="table table-sm sm:table-md min-w-[640px]">
              <thead>
                <tr className="bg-gray-100">
                  <th>#</th>
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Date / time</th>
                  <th>Blood</th>
                  <th>Status</th>
                  <th>Donor info</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request, index) => (
                  <tr key={request._id}>
                    <td>{index + 1}</td>
                    <td>{request.recipientName}</td>
                    <td className="text-sm">
                      {request.district}, {request.upazila}
                    </td>
                    <td className="text-sm whitespace-nowrap">
                      {request.donationDate} {request.donationTime}
                    </td>
                    <td>{request.bloodGroup}</td>
                    <td>
                      <DonationRequestStatusBadge status={request.status} />
                    </td>
                    <td>
                      <DonorInfoCell request={request} />
                    </td>
                    <td className="text-right">
                      <DonationRequestOwnerActions
                        request={request}
                        axiosSecure={axiosSecure}
                        onChanged={loadRecent}
                        onAskDelete={setDeleteTarget}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              to="/dashboard/my-donation-requests"
              className="btn btn-outline btn-primary"
            >
              View my all requests
            </Link>
          </div>
        </div>
      )}

      <DeleteDonationRequestModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        axiosSecure={axiosSecure}
        onDeleted={loadRecent}
      />
    </div>
  );
};

export default MainDashboard;
