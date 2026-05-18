import React from "react";
import { Link } from "react-router";
import { toastApiError, toastSuccess } from "../../../utils/toast";

export function DonationRequestStatusBadge({ status }) {
  const cls =
    status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : status === "done"
        ? "bg-green-100 text-green-700"
        : status === "canceled"
          ? "bg-red-100 text-red-700"
          : "bg-blue-100 text-blue-700";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

export function DonorInfoCell({ request }) {
  if (request.status !== "inprogress") {
    return <span className="text-base-content/50">—</span>;
  }
  return (
    <div className="text-sm min-w-[8rem]">
      <div className="font-medium">{request.donorName || "—"}</div>
      <div className="text-base-content/70 break-all">{request.donorEmail || "—"}</div>
    </div>
  );
}

export function DonationRequestOwnerActions({
  request,
  axiosSecure,
  onChanged,
  onAskDelete,
  showDoneCancel = true,
}) {
  const patchStatus = async (status) => {
    try {
      await axiosSecure.patch(`/donation-requests/${request._id}/status`, {
        status,
      });
      onChanged?.();
      toastSuccess(
        status === "done"
          ? "Request marked as done."
          : status === "canceled"
            ? "Request canceled."
            : "Status updated."
      );
    } catch (e) {
      console.error(e);
      toastApiError(e, "Update failed");
    }
  };

  const inprogress = request.status === "inprogress";

  return (
    <div className="flex flex-wrap gap-1 items-center justify-start sm:justify-end w-full min-w-[10rem]">
      {showDoneCancel && inprogress && (
        <>
          <button
            type="button"
            className="btn btn-xs btn-success text-white"
            onClick={() => patchStatus("done")}
          >
            Done
          </button>
          <button
            type="button"
            className="btn btn-xs btn-warning"
            onClick={() => patchStatus("canceled")}
          >
            Cancel
          </button>
        </>
      )}
      <Link
        className="btn btn-xs btn-outline"
        to={`/dashboard/edit-donation-request/${request._id}`}
      >
        Edit
      </Link>
      <button
        type="button"
        className="btn btn-xs btn-error text-white"
        onClick={() => onAskDelete?.(request)}
      >
        Delete
      </button>
      <Link
        className="btn btn-xs btn-outline btn-primary"
        to={`/donation-requests/${request._id}`}
      >
        View
      </Link>
    </div>
  );
}

export function DeleteDonationRequestModal({
  target,
  onClose,
  axiosSecure,
  onDeleted,
}) {
  if (!target) return null;

  const handleDelete = async () => {
    try {
      await axiosSecure.delete(`/donation-requests/${target._id}`);
      onClose?.();
      onDeleted?.();
      toastSuccess("Donation request deleted.");
    } catch (e) {
      console.error(e);
      toastApiError(e, "Delete failed");
    }
  };

  return (
    <div className="modal modal-open z-50 p-4">
      <div className="modal-box w-full max-w-md mx-auto">
        <h3 className="font-bold text-lg">Delete donation request?</h3>
        <p className="py-3 text-sm text-base-content/80">
          This will permanently remove the request for{" "}
          <strong>{target.recipientName}</strong>. This cannot be undone.
        </p>
        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-error text-white"
            onClick={handleDelete}
          >
            Confirm delete
          </button>
        </div>
      </div>
      <button
        type="button"
        className="modal-backdrop bg-black/50"
        aria-label="Close"
        onClick={onClose}
      />
    </div>
  );
}
