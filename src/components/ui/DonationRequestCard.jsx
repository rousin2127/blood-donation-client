import React from "react";
import { Link } from "react-router";
import Badge from "./Badge";
import Button from "./Button";
import Card from "./Card";

export default function DonationRequestCard({ request }) {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-base-content truncate">{request.recipientName}</h3>
          <p className="text-sm text-base-content/70 truncate">
            {request.district}, {request.upazila}
          </p>
        </div>
        <Badge tone="error" className="shrink-0 border-error/30 text-error">
          {request.bloodGroup}
        </Badge>
      </div>
      <p className="text-sm text-base-content/80 line-clamp-2 flex-1 mb-4">
        {request.message || `Blood needed at ${request.hospitalName || "hospital"}.`}
      </p>
      <div className="grid grid-cols-2 gap-2 text-xs text-base-content/70 mb-4">
        <div>
          <span className="block opacity-70">Date</span>
          <span className="font-medium text-base-content">{request.donationDate}</span>
        </div>
        <div>
          <span className="block opacity-70">Time</span>
          <span className="font-medium text-base-content">{request.donationTime}</span>
        </div>
      </div>
      <Link to={`/donation-requests/${request._id}`} className="mt-auto">
        <Button variant="primary" size="sm" className="w-full">
          View details
        </Button>
      </Link>
    </Card>
  );
}
