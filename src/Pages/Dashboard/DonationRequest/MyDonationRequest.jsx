import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { CloudUpload } from 'lucide-react';

const MyDonationRequest = () => {
    const [totalRequest, setTotalRequest] = useState(0);
    const [myRequests, setMyRequests] = useState([])
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);


    const axiosSecure = useAxiosSecure()


    useEffect(() => {
        axiosSecure.get(`/my-donation-requests?page=${currentPage - 1}&size=${itemsPerPage}`)
            .then(res => {
                setMyRequests(res.data.request);
                setTotalRequest(res.data.totalRequest)
            })
    }, [axiosSecure, currentPage, itemsPerPage])

    const numberOfPages = Math.ceil(totalRequest / itemsPerPage)
    const pages = [...Array(numberOfPages).keys()].map(e => e + 1)


    const handlePrev = ()=>{
        if(currentPage>1){
            setCurrentPage(currentPage-1)
        }
    }

    const handleNext = ()=>{
        if (currentPage<pages.length){
            setCurrentPage(currentPage+1)
        }
    }


    return (
        <div>
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
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        {
                            myRequests.map((request,index) =>
                                <tr>
                                    <th>{(currentPage*5)+(index+1)-5}</th>
                                    <td>{request.recipientName}</td>
                                    <td>{request.hospitalName}</td>
                                    <td>{request.bloodGroup}</td>
                                    <td>{request.status}</td>
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
                     <button className={`btn ${page === currentPage ? 'bg-blue-400 text-white' : ''}`} onClick={()=> setCurrentPage(page)}>{page}</button>
                )
               }
               <button onClick={handleNext} className='btn'>Next</button>
            </div>  
        </div>
    );
};

export default MyDonationRequest;