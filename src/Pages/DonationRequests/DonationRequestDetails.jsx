import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import useAxios from "../../Hooks/useAxios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../hook/useAuth";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import DonationRequestCard from "../../components/ui/DonationRequestCard";
import { toastApiError, toastSuccess } from "../../utils/toast";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [related, setRelated] = useState([]);
  const [donating, setDonating] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      axiosPublic.get(`/public/donation-requests/${id}`),
      axiosPublic.get(`/public/donation-requests/${id}/related`),
    ])
      .then(([detail, rel]) => {
        setRequest(detail.data);
        setRelated(rel.data || []);
      })
      .catch(() => setRequest(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [axiosPublic, id]);

  const handleDonate = async () => {
    if (!user) return;
    setDonating(true);
    try {
      const res = await axiosSecure.patch(`/donation-requests/${id}/donate`);
      if (res.data?.modifiedCount > 0) load();
      document.getElementById("donate_modal")?.close?.();
      toastSuccess("Donation confirmed. Status updated to in progress.");
    } catch (err) {
      toastApiError(err, "Failed to donate.");
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
      <Card>
        <p className="text-base-content/70">Request not found or has been removed.</p>
        <Link to="/explore" className="btn btn-primary btn-sm mt-4">Browse requests</Link>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1>Request details</h1>
        <p className="text-base-content/70 mt-1">Public overview — log in to confirm a donation.</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{request.recipientName}</h2>
            <p className="text-sm text-base-content/70">{request.district}, {request.upazila}</p>
          </div>
          <div className="flex gap-2">
            <Badge tone="error">{request.bloodGroup}</Badge>
            <Badge>{request.status}</Badge>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Info label="Hospital" value={request.hospitalName} />
          <Info label="Address" value={request.address} />
          <Info label="Donation date" value={request.donationDate} />
          <Info label="Donation time" value={request.donationTime} />
          <Info label="Message" value={request.message} className="md:col-span-2" />
          {request.status === "inprogress" && request.donorName && (
            <Info label="Matched donor" value={request.donorName} />
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-end">
          {!user ? (
            <Link to="/login" state={{ from: { pathname: `/donation-requests/${id}` } }}>
              <Button>Log in to donate</Button>
            </Link>
          ) : (
            <Button
              variant="error"
              disabled={request.status !== "pending"}
              onClick={() => document.getElementById("donate_modal")?.showModal?.()}
            >
              Donate
            </Button>
          )}
        </div>
      </Card>

      {related.length > 0 && (
        <section>
          <h2 className="mb-4">Related requests</h2>
          <p className="text-sm text-base-content/70 mb-4">
            Other pending requests with the same blood group in {request.district}.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => (
              <DonationRequestCard key={r._id} request={r} />
            ))}
          </div>
        </section>
      )}

      <dialog id="donate_modal" className="modal">
        <div className="modal-box rounded-xl">
          <h3 className="font-bold text-lg">Confirm donation</h3>
          <p className="text-sm text-base-content/70 mt-1">
            Status will change from <strong>pending</strong> to <strong>in progress</strong>.
          </p>
          <div className="mt-4 space-y-3">
            <label className="form-control">
              <span className="label-text">Donor name</span>
              <input className="input input-bordered rounded-xl" readOnly value={user?.displayName || ""} />
            </label>
            <label className="form-control">
              <span className="label-text">Donor email</span>
              <input className="input input-bordered rounded-xl" readOnly value={user?.email || ""} />
            </label>
          </div>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <Button variant="ghost" type="button">Cancel</Button>
              <Button variant="error" type="button" onClick={handleDonate} loading={donating}>
                Confirm
              </Button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

const Info = ({ label, value, className = "" }) => (
  <div className={`rounded-xl border border-base-300 bg-base-200/50 p-4 ${className}`}>
    <p className="text-base-content/60 text-xs uppercase tracking-wide">{label}</p>
    <p className="font-medium mt-1 break-words">{value || "—"}</p>
  </div>
);

export default DonationRequestDetails;
