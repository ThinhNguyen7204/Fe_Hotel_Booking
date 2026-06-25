import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { getReviewByRoomId } from "../../services/ReviewService"
import moment from 'moment';
import ReactPaginate from "react-paginate";
import { Link, NavLink } from "react-router-dom";
import UserIcon from "../../assets/img/userIcon.png";


const GetReviewByRoomID = () => {
    const [reviewByRoomID, setReviewByRoomID] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { roomId } = useParams();

    useEffect(() => {
        fetchReviewByRoomID(roomId, page);
    }, [roomId, page]);

    const fetchReviewByRoomID = async (roomId, page) => {
        try {
            const result = await getReviewByRoomId(roomId, page)
            console.log(result.reviewList)
            setReviewByRoomID(result.reviewList)
            setTotalPages(result.totalPages);
        } catch (error) {
            toast.error("Error fetching review by room", error)
        }
    }

    const renderStars = (rating) => {
        const filledStars = Math.round(rating); // Làm tròn rating để lấy số sao
        const totalStars = 5; // Tổng số sao tối đa
        let stars = '';

        for (let i = 0; i < totalStars; i++) {
            stars += i < filledStars ? '★' : '☆'; // Thêm sao đổ đầy (★) hoặc sao rỗng (☆)
        }

        return stars;
    };

    const handlePageClick = (event) => {
        setPage(event.selected);
    };


    return (
        <section className="p-8 bg-slate-50/30 min-h-screen">
            <div className="mb-6">
                <h2 className="font-semibold text-2xl text-slate-800">Room Reviews</h2>
                <p className="text-sm text-slate-500">Read what customers are saying about Room #{roomId}.</p>
            </div>

            <div className="space-y-4 max-w-4xl">
                {reviewByRoomID.length > 0 ? (
                    reviewByRoomID.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 shadow-sm flex items-center justify-center bg-slate-50">
                                        <img
                                            src={item.user?.imageUrl || UserIcon}
                                            alt={`${item.user?.name || "User"}'s avatar`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 text-sm">
                                            {item.user?.name || "Anonymous User"}
                                        </h4>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-amber-400 text-sm leading-none">
                                                {renderStars(item.reviewRate)}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">
                                                ({item.reviewRate}/5)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-450">
                                    {moment(item.createdTime).format("MMMM Do YYYY, h:mm a")}
                                </span>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                    {item.comment}
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        {item.room.roomType}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center text-slate-400">
                        No reviews available for this room yet.
                    </div>
                )}
            </div>

            <div className="flex justify-center mt-8 max-w-4xl">
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="NEXT →"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={totalPages}
                    previousLabel="← PREVIOUS"
                    className="flex space-x-1.5 items-center justify-center"
                    pageClassName="page-item"
                    pageLinkClassName="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 text-sm font-medium transition-all"
                    activeLinkClassName="active bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-750"
                    previousClassName="page-item"
                    previousLinkClassName="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 text-sm font-medium transition-all"
                    nextClassName="page-item"
                    nextLinkClassName="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 text-sm font-medium transition-all"
                    breakClassName="page-item"
                    breakLinkClassName="px-3.5 py-2 text-slate-400"
                    disabledLinkClassName="opacity-50 cursor-not-allowed hover:bg-white"
                    containerClassName="pagination"
                />
            </div>

            <div className="flex justify-end mt-8 max-w-4xl">
                <Link
                    to="/admin/roomlist"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-650 hover:text-slate-800 text-sm font-medium rounded-xl border border-slate-200 shadow-sm transition-all"
                >
                    Back to Room List
                </Link>
            </div>
        </section>
    );
};


export default GetReviewByRoomID