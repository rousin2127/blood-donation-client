import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../hook/useAuth";
import { toastApiError, toastSuccess } from "../../../utils/toast";
import {
  DeleteDonationRequestModal,
  DonationRequestOwnerActions,
  DonorInfoCell,
} from "../DonationRequest/DonorRequestRow";

const AllBloodDonationRequests = () => {
  const axiosSecure = useAxiosSecure();
  const { role } = useAuth();
  const [list, setList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    axiosSecure
      .get(`/all-donation-requests?status=${statusFilter}`)
      .then((res) => setList(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [axiosSecure, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await axiosSecure.patch(`/donation-requests/${id}/status`, { status });
      toastSuccess("Status updated.");
      load();
    } catch (e) {
      console.error(e);
      toastApiError(e, "Update failed");
    }
  };

  const isVolunteer = role === "volunteer";
  const isAdmin = role === "admin";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">All blood donation requests</h1>
        <select
          className="select select-bordered w-full sm:max-w-xs shrink-0"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100 -mx-1 sm:mx-0">
          <table className="table table-sm sm:table-md min-w-[720px]">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Location</th>
                <th>Blood</th>
                <th>Date / time</th>
                <th>Donor info</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r._id}>
                  <td>{r.recipientName}</td>
                  <td className="text-sm">
                    {r.district}, {r.upazila}
                  </td>
                  <td>{r.bloodGroup}</td>
                  <td className="text-sm whitespace-nowrap">
                    {r.donationDate} {r.donationTime}
                  </td>
                  <td>
                    <DonorInfoCell request={r} />
                  </td>
                  <td>
                    {isVolunteer || isAdmin ? (
                      <select
                        className="select select-bordered select-sm max-w-[11rem]"
                        value={r.status}
                        onChange={(e) => updateStatus(r._id, e.target.value)}
                      >
                        <option value="pending">pending</option>
                        <option value="inprogress">inprogress</option>
                        <option value="done">done</option>
                        <option value="canceled">canceled</option>
                      </select>
                    ) : (
                      r.status
                    )}
                  </td>
                  <td className="text-right">
                    {isVolunteer ? (
                      <Link
                        to={`/donation-requests/${r._id}`}
                        className="btn btn-xs btn-outline btn-primary"
                      >
                        View
                      </Link>
                    ) : isAdmin ? (
                      <div className="flex flex-wrap gap-1 justify-end items-center">
                        <DonationRequestOwnerActions
                          request={r}
                          axiosSecure={axiosSecure}
                          onChanged={load}
                          onAskDelete={setDeleteTarget}
                          showDoneCancel={false}
                        />
                      </div>
                    ) : (
                      <Link
                        to={`/donation-requests/${r._id}`}
                        className="btn btn-xs btn-outline btn-primary"
                      >
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteDonationRequestModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        axiosSecure={axiosSecure}
        onDeleted={load}
      />
    </div>
  );
};

export default AllBloodDonationRequests;
