import React, { useState, useEffect } from "react";
import {
  adminGetBookingLatePayment,
  cancelBookingLatePayment,
} from "../../services/BookingService";
import { FaEye, FaTrash } from "react-icons/fa";
import ModalConfirm from "../../components/ModalConfirm/ModalConfirm";
import ReactPaginate from "react-paginate";
import CheckStartDate from "../../components/CheckStartDate/CheckStartDate";
import CheckEndDate from "../../components/CheckEndDate/CheckEndDate";
import { toast } from "react-toastify";

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

// Debounce Hook for Search
// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);
//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);
//   return debouncedValue;
// };

const AdminBookingLatePayment = () => {
  const [history, setHistory] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [cancelID, setCancelID] = useState(null);
  const [isModalCancel, setModalCancel] = useState(false);
  //   const [search, setSearch] = useState("");
  //   const debouncedSearch = useDebounce(search, 500);

  //   const [startDate, setCheckStartDate] = useState("");
  //   const [endDate, setCheckEndDate] = useState("");
  // const [roomType, setRoomtype] = useState("");

  // Reset page to 0 whenever search, startDate, or endDate change
  //   useEffect(() => {
  //     setPage(0);
  //   }, [debouncedSearch, startDate, endDate]);

  useEffect(() => {
    fetchBookingHistory();
  }, [page]);

  const fetchBookingHistory = async () => {
    try {
      // let result;

      // if (startDate && endDate && debouncedSearch) {
      //   // Fetch by date range and search term
      //   result = await adminGetBookingByDateType(
      //     startDate,
      //     endDate,
      //     debouncedSearch,
      //     page
      //   );
      // } else if (startDate && endDate) {
      //   // Fetch by date range only
      //   result = await adminGetBookingByDateType(
      //     startDate,
      //     endDate,
      //     null,
      //     page
      //   );
      // } else if (debouncedSearch) {
      //   // Fetch by search term only
      //   result = await adminGetBookingByDateType(
      //     null,
      //     null,
      //     debouncedSearch,
      //     page
      //   );
      // } else {
      //   // Fetch all bookings without filters
      //   result = await adminGetAllBooking(page);
      // }

      const result = await adminGetBookingLatePayment(page);
      console.log(result);
      // console.log(startDate);
      // console.log(endDate);
      setHistory(result.bookingList);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to fetch booking history:", error);
    }
  };

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  //   const handleSearchChange = (event) => {
  //     setSearch(event.target.value);
  //   };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  const handleCancel = (id) => {
    setCancelID(id);
    setModalCancel(true);
  };

  const handleCancelBooking = async () => {
    try {
      const result = await cancelBookingLatePayment(cancelID);
      if (result.statusCode === 200) {
        fetchBookingHistory();
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

  return (
    <section className="p-4 md:p-8 bg-slate-50/30 min-h-screen w-full min-w-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-semibold text-2xl text-slate-800">Booking Late Payment</h2>
          <p className="text-sm text-slate-500">Manage bookings with outstanding payments that require attention.</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center text-slate-400">
          {"There is no booking history."}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 w-full max-w-7xl">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/75 border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Room Type
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Room ID
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Check-in
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Check-out
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Total Guests
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Payment Status
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item, index) => (
                  <tr key={index} className="bg-white hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{page * 10 + index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{item.room.roomType}</td>
                    <td className="px-6 py-4 text-slate-500">{item.room.id}</td>
                    <td className="px-6 py-4 font-mono text-slate-700 text-xs font-semibold">{item.bookingCode}</td>
                    <td className="px-6 py-4 text-slate-500">{item.checkInDate}</td>
                    <td className="px-6 py-4 text-slate-500">{item.checkOutDate}</td>
                    <td className="px-6 py-4 text-slate-500">{item.totalNumOfGuest}</td>
                    <td className="px-6 py-4 text-slate-500">{item.user.email}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">${item.finalPrice}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100 uppercase">
                        {item.paymentStatus || "Overdue"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          onClick={() => handleViewDetails(item)}
                          title="View Details"
                        >
                          <FaEye size={18} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          onClick={() => handleCancel(item.id)}
                          title="Cancel Booking"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal hiển thị chi tiết đặt phòng */}
      {selectedBooking && (
        <ModalConfirm
          open={isModalOpen}
          onClose={handleCloseModal}
          title={`Booking Details - Room #${selectedBooking.room.id}`}
          message={
            <div className="text-slate-700 space-y-4 text-sm max-w-lg">
              <div className="overflow-hidden w-full h-[220px] rounded-xl my-2 border border-slate-100 shadow-sm">
                <img
                  src={selectedBooking.room.roomPhotoUrl}
                  alt="Room"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 py-3 border-b border-slate-100 text-left">
                <p><strong>Room Type:</strong> {selectedBooking.room.roomType}</p>
                <p><strong>Booking Code:</strong> <span className="font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-150 text-xs font-semibold text-slate-800">{selectedBooking.bookingCode}</span></p>
                <p><strong>Price:</strong> <span className="font-semibold text-slate-900">${selectedBooking.finalPrice}</span></p>
                <p><strong>Guests:</strong> {selectedBooking.totalNumOfGuest} ({selectedBooking.numOfAdults} A, {selectedBooking.numOfChildren} C)</p>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 py-3 border-b border-slate-100 text-left">
                <p><strong>Customer Email:</strong> {selectedBooking.user.email}</p>
                <p><strong>Payment Status:</strong> <span className="text-rose-600 font-semibold">{selectedBooking.paymentStatus}</span></p>
                <p><strong>Check-in Date:</strong> {selectedBooking.checkInDate}</p>
                <p><strong>Check-out Date:</strong> {selectedBooking.checkOutDate}</p>
              </div>

              <div className="text-left">
                <p className="font-semibold mb-2 text-xs uppercase text-slate-400 tracking-wider">Facilities</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedBooking.room?.facility ? (
                    <>
                      {selectedBooking.room.facility.drinkInfo && (
                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-150 rounded-lg flex items-center gap-1.5 text-xs text-slate-600">
                          <FaCocktail className="text-indigo-500" /> Drink
                        </span>
                      )}
                      {selectedBooking.room.facility.gymInfo && (
                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-150 rounded-lg flex items-center gap-1.5 text-xs text-slate-600">
                          <FaStopwatch className="text-indigo-500" /> Gym
                        </span>
                      )}
                      {selectedBooking.room.facility.breakfastInfo && (
                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-150 rounded-lg flex items-center gap-1.5 text-xs text-slate-600">
                          <FaHotdog className="text-indigo-500" /> Breakfast
                        </span>
                      )}
                      {selectedBooking.room.facility.poolInfo && (
                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-150 rounded-lg flex items-center gap-1.5 text-xs text-slate-600">
                          <FaSwimmingPool className="text-indigo-500" /> Pool
                        </span>
                      )}
                      {selectedBooking.room.facility.parkingInfo && (
                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-150 rounded-lg flex items-center gap-1.5 text-xs text-slate-600">
                          <FaParking className="text-indigo-500" /> Parking
                        </span>
                      )}
                      {selectedBooking.room.facility.bathInfo && (
                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-150 rounded-lg flex items-center gap-1.5 text-xs text-slate-600">
                          <FaBath className="text-indigo-500" /> Bath
                        </span>
                      )}
                      {selectedBooking.room.facility.coffeeInfo && (
                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-150 rounded-lg flex items-center gap-1.5 text-xs text-slate-600">
                          <FaCoffee className="text-indigo-500" /> Coffee
                        </span>
                      )}
                      {selectedBooking.room.facility.wifiInfo && (
                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-150 rounded-lg flex items-center gap-1.5 text-xs text-slate-600">
                          <FaWifi className="text-indigo-500" /> WiFi
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-slate-400 text-xs">No facilities</span>
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
        title="Confirm cancel?"
        message="Are you sure you want to cancel this booking?"
        onConfirm={handleCancelBooking}
      />

      <div className="flex justify-center mt-6">
        <ReactPaginate
          breakLabel="..."
          nextLabel="NEXT →"
          onPageChange={handlePageClick}
          forcePage={page}
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
    </section>
  );
};

export default AdminBookingLatePayment;
