import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { Link } from 'react-router';

const MyDonationRequest = () => {
    const [totalRequest, setTotalRequest] = useState(0);
    const [myRequests, setMyRequests] = useState([])
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');



    const axiosSecure = useAxiosSecure()


    useEffect(() => {
        axiosSecure.get(`/my-donation-requests?page=${currentPage - 1}&size=${itemsPerPage}&status=${statusFilter}`)
            .then(res => {
                setMyRequests(res.data.request);
                setTotalRequest(res.data.totalRequest)
            })
    }, [axiosSecure, currentPage, itemsPerPage, statusFilter])

    const numberOfPages = Math.ceil(totalRequest / itemsPerPage)
    const pages = [...Array(numberOfPages).keys()].map(e => e + 1)


    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (currentPage < pages.length) {
            setCurrentPage(currentPage + 1)
        }
    }


    return (
        <div>
            <div className="flex justify-end mb-4">
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1); // reset page on filter change
                    }}
                    className="select select-bordered w-52"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                    <option value="canceled">Canceled</option>
                </select>
            </div>

            <h1 className="text-2xl font-semibold mb-4">My Donation Requests</h1>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Hospital Name</th>
                            <th>Blood Group</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        {
                            myRequests.map((request, index) =>
                                <tr key={request._id}>
                                    <th>{((currentPage - 1) * itemsPerPage) + (index + 1)}</th>
                                    <td>{request.recipientName}</td>
                                    <td>{request.hospitalName}</td>
                                    <td>{request.bloodGroup}</td>
                                    <td>{request.status}</td>
                                    <td>
                                        <Link className="btn btn-xs btn-outline" to={`/donation-requests/${request._id}`}>
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            <div className=' flex justify-center mt-12 gap-4'>
                <button onClick={handlePrev} className='btn'>Prev</button>
                {
                    pages.map(page =>
                        <button className={`btn ${page === currentPage ? 'bg-blue-400 text-white' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
                    )
                }
                <button onClick={handleNext} className='btn'>Next</button>
            </div>
        </div>
    );
};

export default MyDonationRequest;