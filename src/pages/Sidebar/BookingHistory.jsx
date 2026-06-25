import React, { useState, useEffect, useContext } from "react";
import { bookingHistory } from "../../services/BookingService";
import { FaEye } from "react-icons/fa";
import ModalConfirm from "../../components/ModalConfirm/ModalConfirm";
import ReactPaginate from "react-paginate";
import HoverRating from "./HoverRating";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";

import {
  FaTimes,
  FaWifi,
  FaCheck,
  FaCoffee,
  FaBath,
  FaParking,
  FaSwimmingPool,
  FaHotdog,
  FaStopwatch,
  FaCocktail,
} from "react-icons/fa";
import { addReview } from "../../services/ReviewService";
import { AuthContext } from "../../context/AuthContext";

const BookingHistory = () => {
  const [history, setHistory] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null); // Lưu thông tin đặt phòng đã chọn
  const [page, setPage] = useState(0); // Số trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang từ API

  const [isReviewModalOpen, setReviewModalOpen] = useState(false); // Review modal
  const [reviewRate, setReviewRate] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const result = await bookingHistory(page);
        setHistory(result.bookingList);
        setTotalPages(result.totalPages); // Cập nhật tổng số trang
      } catch (error) {
        toast.error(error);
      }
    };

    fetchBookingHistory();
  }, [page, selectedBooking]);

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  // Xử lý mở modal khi nhấn FaEye
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBooking(null); // Reset thông tin khi đóng modal
  };

  const handleOpenReviewModal = (booking) => {
    setSelectedBooking(booking);
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setReviewRate(0);
    setReviewComment("");
    setSelectedBooking(null);
  };

  const handleSubmitReview = async () => {
    if (reviewRate > 0 && reviewComment.trim()) {
      try {
        const roomId = selectedBooking.room.id;
        // Dữ liệu review cần gửi lên
        const reviewData = {
          reviewRate,
          comment: reviewComment,
          createdTime: new Date().toISOString(),
          roomId: selectedBooking.room.id, // Thêm roomId
          userId: user.id, // Thêm userId
        };
        // Gửi dữ liệu review tới API
        await addReview(roomId, reviewData);
        toast.success("Add review successfully!");
        handleCloseReviewModal(); // Đóng modal sau khi thành công
      } catch (error) {
        toast.error("Error adding review:", error);
      }
    } else {
      toast.error("Please fill in both the rating and the comment.");
    }
  };

  // const handleSubmitReview = () => {
  //   if (reviewRate > 0 && reviewComment.trim()) {
  //     console.log({
  //       reviewRate,
  //       comment: reviewComment,
  //     });
  //     handleCloseReviewModal();
  //   } else {
  //     alert("Please fill in both the rating and the comment.");
  //   }
  // };

  return (
    <div className="p-4 md:p-8 bg-slate-50/50 min-h-screen w-full min-w-0">
      {/* Page Header */}
      <div className="mb-8">
        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          Reservation Logs
        </span>
        <h1 className="text-slate-800 text-3xl font-extrabold mt-3 tracking-tight">
          Booking History
        </h1>
        <p className="text-slate-500 text-[15px] mt-1.5 leading-relaxed">
          Review your past stays, dates, payment records, and write room reviews.
        </p>
      </div>

      {/* Main Content Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 w-full max-w-7xl">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 font-medium italic">
              You have no booking history.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 border-collapse">
              <thead>
                <tr className="text-xs uppercase text-slate-400 border-b border-slate-100 bg-slate-50/50">
                  <th scope="col" className="px-6 py-4 font-semibold">ID</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Room Type</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Room ID</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Code</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Check-in Date</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Check-out Date</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Adults</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Children</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Price</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Payment Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Details</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{index + 1}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{item.room.roomType}</td>
                    <td className="px-6 py-4">{item.room.id}</td>
                    <td className="px-6 py-4 font-mono text-slate-600 font-bold">{item.bookingCode}</td>
                    <td className="px-6 py-4 text-slate-500">{item.checkInDate}</td>
                    <td className="px-6 py-4 text-slate-500">{item.checkOutDate}</td>
                    <td className="px-6 py-4 text-center">{item.numOfAdults}</td>
                    <td className="px-6 py-4 text-center">{item.numOfChildren}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">${item.finalPrice}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.paymentStatus === "PAID"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-transparent hover:border-indigo-100"
                        onClick={() => handleViewDetails(item)}
                        title="View Details"
                      >
                        <FaEye size={16} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-sm"
                        onClick={() => handleOpenReviewModal(item)}
                      >
                        Write Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal hiển thị chi tiết đặt phòng */}
      {selectedBooking && (
        <ModalConfirm
          open={isModalOpen}
          onClose={handleCloseModal}
          title={`Booking Details - ${selectedBooking.room.roomType}`}
          message={
            <div className="text-slate-700">
              <div className="overflow-hidden w-full h-[220px] rounded-2xl border border-slate-100 mb-5">
                <img
                  src={selectedBooking.room.roomPhotoUrl}
                  alt="Room"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-slate-400 text-xs uppercase font-bold block">Room ID</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.room.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs uppercase font-bold block">Booking Code</span>
                  <span className="font-mono font-bold text-slate-800">{selectedBooking.bookingCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs uppercase font-bold block">Check-in Date</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.checkInDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs uppercase font-bold block">Check-out Date</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.checkOutDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs uppercase font-bold block">Guests</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.numOfAdults} Adults, {selectedBooking.numOfChildren} Kids</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs uppercase font-bold block">Total Price</span>
                  <span className="font-bold text-indigo-600">${selectedBooking.finalPrice}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-slate-100">
                <span className="text-slate-400 text-xs uppercase font-bold block mb-3">Room Facilities</span>
                <div className="grid grid-cols-4 gap-2">
                  {selectedBooking.room?.facility ? (
                    <>
                      {selectedBooking.room.facility.wifiInfo && <FaWifi className="text-accent text-lg" title="WiFi Included" />}
                      {selectedBooking.room.facility.coffeeInfo && <FaCoffee className="text-accent text-lg" title="Coffee Available" />}
                      {selectedBooking.room.facility.bathInfo && <FaBath className="text-accent text-lg" title="Bath Included" />}
                      {selectedBooking.room.facility.parkingInfo && <FaParking className="text-accent text-lg" title="Parking Available" />}
                      {selectedBooking.room.facility.poolInfo && <FaSwimmingPool className="text-accent text-lg" title="Pool Access" />}
                      {selectedBooking.room.facility.breakfastInfo && <FaHotdog className="text-accent text-lg" title="Breakfast Included" />}
                      {selectedBooking.room.facility.gymInfo && <FaStopwatch className="text-accent text-lg" title="Gym Available" />}
                      {selectedBooking.room.facility.drinkInfo && <FaCocktail className="text-accent text-lg" title="Welcome Drink" />}
                    </>
                  ) : (
                    <span className="text-slate-400 text-xs col-span-4 italic">No facilities</span>
                  )}
                </div>
              </div>
            </div>
          }
        />
      )}

      {/* Modal Đánh giá */}
      <Modal open={isReviewModalOpen} onClose={handleCloseReviewModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 440 },
            bgcolor: "background.paper",
            borderRadius: "24px",
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            p: 4,
            border: "none",
            outline: "none"
          }}
        >
          <div
            className="absolute top-4 right-4 p-2 cursor-pointer hover:bg-slate-100 rounded-full transition-colors"
            onClick={handleCloseReviewModal}
          >
            <FaTimes size={16} color="gray" />
          </div>
          <h2 className="font-primary text-2xl text-slate-800 text-center mb-6 font-semibold">
            REVIEW ROOM
          </h2>
          <div className="mb-4 flex flex-col items-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Room Rating</span>
            <HoverRating
              value={reviewRate}
              onChange={(event, newValue) => setReviewRate(newValue)}
            />
          </div>
          <TextField
            label="Comment"
            multiline
            rows={4}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            fullWidth
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&.Mui-focused fieldset': {
                  borderColor: '#A37D4C',
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#A37D4C',
              }
            }}
          />
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: "12px",
              backgroundColor: "#A37D4C",
              color: "white",
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "15px",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#8C6A3E",
                boxShadow: "none",
              },
            }}
          >
            Submit Review
          </Button>
        </Box>
      </Modal>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 mb-8">
          <ReactPaginate
            breakLabel="..."
            nextLabel="NEXT →"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPages}
            previousLabel="← PREVIOUS"
            className="flex space-x-1.5 items-center justify-center"
            pageClassName="page-item"
            pageLinkClassName="px-3.5 py-2 border border-slate-200 hover:bg-slate-550/5 rounded-xl text-slate-600 text-sm font-medium transition-all"
            activeLinkClassName="active bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
            previousClassName="page-item"
            previousLinkClassName="px-3.5 py-2 border border-slate-200 hover:bg-slate-550/5 rounded-xl text-slate-600 text-sm font-medium transition-all"
            nextClassName="page-item"
            nextLinkClassName="px-3.5 py-2 border border-slate-200 hover:bg-slate-550/5 rounded-xl text-slate-655 text-sm font-medium transition-all"
            breakClassName="page-item"
            breakLinkClassName="px-3.5 py-2 text-slate-400"
            disabledLinkClassName="opacity-40 cursor-not-allowed hover:bg-transparent"
            containerClassName="pagination"
          />
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
