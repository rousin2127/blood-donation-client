import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxios from "../../Hooks/useAxios";
import DonationRequestCard from "../../components/ui/DonationRequestCard";
import { CardSkeleton } from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const DonationRequests = () => {
  const axiosPublic = useAxios();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setLoading(true);
    axiosPublic
      .get("/explore/donation-requests?status=pending&size=12&page=0")
      .then((res) => setRequests(res.data.items || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, [axiosPublic]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1>Donation requests</h1>
          <p className="text-base-content/70 mt-1">Pending requests from our live database.</p>
        </div>
        <Link to="/explore">
          <Button variant="outline" size="sm">Advanced explore</Button>
        </Link>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="rounded-xl border border-base-300 bg-base-100 p-8 text-center text-base-content/70">
          No pending donation requests found.
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {requests.map((r) => (
            <DonationRequestCard key={r._id} request={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationRequests;
