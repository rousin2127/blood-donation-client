import React, { useCallback, useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import {
  DeleteDonationRequestModal,
  DonationRequestOwnerActions,
  DonationRequestStatusBadge,
  DonorInfoCell,
} from "./DonorRequestRow";

const MyDonationRequest = () => {
  const [totalRequest, setTotalRequest] = useState(0);
  const [myRequests, setMyRequests] = useState([]);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const axiosSecure = useAxiosSecure();

  const loadList = useCallback(() => {
    axiosSecure
      .get(
        `/my-donation-requests?page=${currentPage - 1}&size=${itemsPerPage}&status=${statusFilter}`
      )
      .then((res) => {
        setMyRequests(res.data.request || []);
        setTotalRequest(res.data.totalRequest);
      })
      .catch(console.error);
  }, [axiosSecure, currentPage, itemsPerPage, statusFilter]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const numberOfPages = Math.ceil(totalRequest / itemsPerPage);
  const pages = [...Array(numberOfPages).keys()].map((e) => e + 1);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold">My donation requests</h1>
        <label className="form-control w-full sm:max-w-xs shrink-0">
          <span className="label-text text-sm sr-only">Filter by status</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="select select-bordered w-full sm:w-52"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 -mx-1 sm:mx-0">
        <table className="table table-sm sm:table-md min-w-[640px]">
          <thead>
            <tr>
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
            {myRequests.map((request, index) => (
              <tr key={request._id}>
                <th>{(currentPage - 1) * itemsPerPage + (index + 1)}</th>
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
                    onChanged={loadList}
                    onAskDelete={setDeleteTarget}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-8 sm:mt-12 gap-2 sm:gap-3 flex-wrap">
        <button
          type="button"
          onClick={handlePrev}
          className="btn btn-sm sm:btn-md"
          disabled={currentPage <= 1}
        >
          Prev
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`btn btn-sm sm:btn-md min-w-9 ${page === currentPage ? "btn-primary" : ""}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={handleNext}
          className="btn btn-sm sm:btn-md"
          disabled={currentPage >= pages.length || pages.length === 0}
        >
          Next
        </button>
      </div>

      <DeleteDonationRequestModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        axiosSecure={axiosSecure}
        onDeleted={() => {
          setDeleteTarget(null);
          loadList();
        }}
      />
    </div>
  );
};

export default MyDonationRequest;
