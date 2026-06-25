import React, { useState, useEffect } from "react";
import { recentBooking, cancelBooking } from "../../services/BookingService";
import { userPay } from "../../services/PaymentService";
import { FaEye, FaTrash } from "react-icons/fa";
import ModalConfirm from "../../components/ModalConfirm/ModalConfirm";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { MdPayment } from "react-icons/md";

import {
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

const RecentBooking = () => {
  const [history, setHistory] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null); // Lưu thông tin đặt phòng đã chọn
  const [cancelID, setCancelID] = useState(null);
  const [isModalCancel, setModalCancel] = useState(false);
  const [page, setPage] = useState(0); // Số trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang từ API

  const URL = `${import.meta.env.VITE_API_BASE_URL || "https://hotel-booking-api-xojn.onrender.com"}/payments/confirm`;

  useEffect(() => {
    const fetchRecentBooking = async () => {
      try {
        const result = await recentBooking(page);
        setHistory(result.bookingList);
        setTotalPages(result.totalPages); // Cập nhật tổng số trang
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecentBooking();
  }, [page]);

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  const handleCancel = (id) => {
    setCancelID(id);
    setModalCancel(true);
  };

  const handleCancelBooking = async () => {
    try {
      const result = await cancelBooking(cancelID);
      if (result.statusCode === 200) {
        const fetchRecentBooking = async () => {
          try {
            const result = await recentBooking();
            setHistory(result.bookingList);
          } catch (error) {
            console.error(error);
          }
        };

        fetchRecentBooking();
        toast.success(`Booking was cancelled`);
      } else {
        toast.error(`Error cancel booking`);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setModalCancel(false); // Close the modal after action
    }
  };

  const handlePay = async (item) => {
    try {
      // console.log(item.room.roomType);
      // console.log(item.bookingCode);
      // console.log(item.finalPrice.toString());
      // console.log(URL);
      // console.log(URL);
      const result = await userPay(
        item.room.roomType,
        item.bookingCode,
        item.finalPrice,
        URL,
        URL
      );
      // console.log(result);
      // Kiểm tra nếu kết quả trả về status là 200 và có checkoutUrl
      if (result.status === 200 && result.data && result.data.error === 0 && result.data.data && result.data.data.checkoutUrl) {
        // Chuyển hướng người dùng đến checkoutUrl
        window.location.href = result.data.data.checkoutUrl;
      } else {
        toast.error(result.data?.message || "Tạo link thanh toán thất bại!");
      }
    } catch (error) {
      console.error(error.message);
    }
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

  return (
    <div className="p-4 md:p-8 bg-slate-50/50 min-h-screen w-full min-w-0">
      {/* Page Header */}
      <div className="mb-8">
        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          Current Bookings
        </span>
        <h1 className="text-slate-800 text-3xl font-extrabold mt-3 tracking-tight">
          Recent Bookings
        </h1>
        <p className="text-slate-500 text-[15px] mt-1.5 leading-relaxed">
          Track and manage your current reservations, check status, and complete payment.
        </p>
      </div>

      {/* Main Content Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 w-full max-w-7xl">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 font-medium italic">
              You have no recent bookings.
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
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Actions</th>
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
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.paymentStatus === "PAID"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {item.paymentStatus}
                        </span>
                        {item.paymentStatus === "UNPAID" && (
                          <button
                            className="p-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                            onClick={() => handlePay(item)}
                            title="Pay Now"
                          >
                            <MdPayment size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-transparent hover:border-indigo-100"
                          onClick={() => handleViewDetails(item)}
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100"
                          onClick={() => handleCancel(item.id)}
                          title="Cancel Booking"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
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

      <ModalConfirm
        open={isModalCancel}
        onClose={() => setModalCancel(false)}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        onConfirm={handleCancelBooking}
      />

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
            nextLinkClassName="px-3.5 py-2 border border-slate-200 hover:bg-slate-550/5 rounded-xl text-slate-600 text-sm font-medium transition-all"
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

export default RecentBooking;
