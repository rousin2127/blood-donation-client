import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../hook/useAuth";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get(`/donation-requests/${id}`)
      .then((res) => setRequest(res.data))
      .catch((err) => {
        console.error(err);
        setRequest(null);
      })
      .finally(() => setLoading(false));
  }, [axiosSecure, id]);

  const handleDonate = async () => {
    setDonating(true);
    try {
      const res = await axiosSecure.patch(`/donation-requests/${id}/donate`);
      if (res.data?.modifiedCount > 0) {
        const refreshed = await axiosSecure.get(`/donation-requests/${id}`);
        setRequest(refreshed.data);
      }
      document.getElementById("donate_modal")?.close?.();
      alert("Donation confirmed. Status updated to inprogress.");
    } catch (err) {
      console.error(err);
      alert("Failed to donate.");
    } finally {
      setDonating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[220px]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
          Request not found.
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Request Details</h1>
        <p className="text-gray-600">Review details and confirm donation.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{request.recipientName}</h2>
            <p className="text-sm text-gray-600">
              {request.district}, {request.upazila}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-outline border-red-300 text-red-600">{request.bloodGroup}</span>
            <span className="badge">{request.status}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Info label="Hospital" value={request.hospitalName} />
          <Info label="Address" value={request.address} />
          <Info label="Donation date" value={request.donationDate} />
          <Info label="Donation time" value={request.donationTime} />
          <Info label="Requester email" value={request.requesterEmail} />
          <Info label="Message" value={request.message} />
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button
            className="btn btn-error text-white"
            onClick={() => document.getElementById("donate_modal")?.showModal?.()}
            disabled={request.status !== "pending"}
            title={request.status !== "pending" ? "Only pending requests can be donated" : "Donate"}
          >
            Donate
          </button>
        </div>
      </div>

      <dialog id="donate_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm donation</h3>
          <p className="text-sm text-gray-600 mt-1">
            This will change status from <b>pending</b> to <b>inprogress</b>.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="label">
                <span className="label-text">Donor name</span>
              </label>
              <input className="input input-bordered w-full" readOnly value={user?.displayName || ""} />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Donor email</span>
              </label>
              <input className="input input-bordered w-full" readOnly value={user?.email || ""} />
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn">Cancel</button>
              <button
                type="button"
                className="btn btn-error text-white"
                onClick={handleDonate}
                disabled={donating}
              >
                {donating ? "Confirming..." : "Confirm"}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
    <p className="text-gray-500">{label}</p>
    <p className="font-medium text-gray-900 break-words">{value || "-"}</p>
  </div>
);

export default DonationRequestDetails;
