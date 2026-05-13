import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxios from "../../Hooks/useAxios";

const DonationRequests = () => {
  const axiosPublic = useAxios();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setLoading(true);
    axiosPublic
      .get("/donation-requests")
      .then((res) => setRequests(res.data || []))
      .catch((err) => {
        console.error(err);
        setRequests([]);
      })
      .finally(() => setLoading(false));
  }, [axiosPublic]);

  return (
    <div className="py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Donation Requests</h1>
        <p className="text-gray-600">Only pending requests are shown here.</p>
      </div>

      {loading && (
        <div className="flex justify-center items-center min-h-[180px]">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
          No pending donation requests found.
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {requests.map((r) => (
            <div key={r._id} className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{r.recipientName}</h3>
                  <p className="text-sm text-gray-600">
                    {r.district}, {r.upazila}
                  </p>
                </div>
                <span className="badge badge-outline border-red-300 text-red-600">{r.bloodGroup}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-700">
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">{r.donationDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Time</p>
                  <p className="font-medium">{r.donationTime}</p>
                </div>
              </div>

              <div className="mt-5">
                <Link to={`/donation-requests/${r._id}`} className="btn btn-sm btn-error text-white">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationRequests;
