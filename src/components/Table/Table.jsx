import { useState, useEffect } from "react";
import { TiEyeOutline } from "react-icons/ti";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { getAllRooms, deleteRoom } from "../../services/RoomService";
import User1 from "../../assets/img/user1.png";
import { toast } from "react-toastify";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ModalConfirm from "../ModalConfirm/ModalConfirm";
import ReactPaginate from "react-paginate";
import { FaHistory } from "react-icons/fa";
import { BiSolidDiscount } from "react-icons/bi";

import {
  FaWifi,
  FaCoffee,
  FaBath,
  FaParking,
  FaSwimmingPool,
  FaHotdog,
  FaStopwatch,
  FaCocktail,
} from "react-icons/fa";

const Table = () => {
  const [rooms, setRoom] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null); // State to store room ID to delete
  const [page, setPage] = useState(0); // Số trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang từ API

  const handleDeleteRoom = (id) => {
    setRoomToDelete(id); // Store the room ID to be deleted
    setModalOpen(true); // Open the modal
  };

  useEffect(() => {
    fetchRoom(page);
  }, [page]);

  const fetchRoom = async (page) => {
    try {
      const result = await getAllRooms(page);
      setRoom(result.roomList);
      setTotalPages(result.totalPages); // Cập nhật tổng số trang
    } catch (error) {
      toast(error.message);
    }
  };

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  const handleDelete = async () => {
    if (!roomToDelete) return; // If no room is selected for deletion, exit

    try {
      const result = await deleteRoom(roomToDelete);
      if (result.statusCode === 200) {
        await fetchRoom(); // Re-fetch rooms after deletion
        toast.success(`Room No ${roomToDelete} was deleted`);
      } else {
        toast.error(`Error deleting room: ${roomToDelete}`);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setModalOpen(false); // Close the modal after action
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg text-slate-800">Rooms Database</h3>
          <Link
            to="/admin/addroom"
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-sm shadow-indigo-100 flex items-center gap-2"
          >
            Add new room
          </Link>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/75 border-b border-slate-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">
                  ID
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Type
                </th>
                <th scope="col" className="px-4 py-4 font-semibold">
                  Size m²
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Price
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Description
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Capacity
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Amount
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Image
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Facilities
                </th>
                <th scope="col" className="px-6 py-4 font-semibold text-center">
                  Actions
                </th>
                <th scope="col" className="px-6 py-4 font-semibold text-center">
                  Reviews
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.length > 0 ? (
                rooms.map((room, index) => (
                  <tr
                    key={room.id}
                    className="bg-white hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">{page * 10 + index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{room.roomType}</td>
                    <td className="px-6 py-4">{room.roomSize}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">${room.roomPrice}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {room.roomDescription.length > 30
                        ? room.roomDescription.slice(0, 30) + "..."
                        : room.roomDescription}
                    </td>
                    <td className="px-6 py-4">
                      {room.roomStatus === "Available" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                          {room.roomStatus}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{room.roomCapacity} guest(s)</td>
                    <td className="px-6 py-4">{room.roomAmount}</td>
                    <td className="px-6 py-4">
                      <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-100 shadow-sm hover:scale-105 transition-transform duration-200">
                        <img
                          className="w-full h-full object-cover"
                          src={room.roomPhotoUrl}
                          alt="Room"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 text-slate-400">
                        {room.facility ? (
                          <>
                            {room.facility.drinkInfo && (
                              <span className="p-1 bg-slate-50 rounded-md text-slate-600 hover:text-indigo-600 transition-colors" title="Drink Available">
                                <FaCocktail size={14} />
                              </span>
                            )}
                            {room.facility.gymInfo && (
                              <span className="p-1 bg-slate-50 rounded-md text-slate-600 hover:text-indigo-600 transition-colors" title="Gym Available">
                                <FaStopwatch size={14} />
                              </span>
                            )}
                            {room.facility.breakfastInfo && (
                              <span className="p-1 bg-slate-50 rounded-md text-slate-600 hover:text-indigo-600 transition-colors" title="Breakfast Included">
                                <FaHotdog size={14} />
                              </span>
                            )}
                            {room.facility.poolInfo && (
                              <span className="p-1 bg-slate-50 rounded-md text-slate-600 hover:text-indigo-600 transition-colors" title="Pool Access">
                                <FaSwimmingPool size={14} />
                              </span>
                            )}
                            {room.facility.parkingInfo && (
                              <span className="p-1 bg-slate-50 rounded-md text-slate-600 hover:text-indigo-600 transition-colors" title="Parking Available">
                                <FaParking size={14} />
                              </span>
                            )}
                            {room.facility.bathInfo && (
                              <span className="p-1 bg-slate-50 rounded-md text-slate-600 hover:text-indigo-600 transition-colors" title="Bath Included">
                                <FaBath size={14} />
                              </span>
                            )}
                            {room.facility.coffeeInfo && (
                              <span className="p-1 bg-slate-50 rounded-md text-slate-600 hover:text-indigo-600 transition-colors" title="Coffee Available">
                                <FaCoffee size={14} />
                              </span>
                            )}
                            {room.facility.wifiInfo && (
                              <span className="p-1 bg-slate-50 rounded-md text-slate-600 hover:text-indigo-600 transition-colors" title="WiFi Included">
                                <FaWifi size={14} />
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400 text-xs">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <NavLink
                          to={`/rooms/${room.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          title="View Details"
                        >
                          <FaEye size={18} />
                        </NavLink>

                        <NavLink
                          to={`/admin/roomlist/booking/${room.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          title="Booking History"
                        >
                          <FaHistory size={16} />
                        </NavLink>

                        <NavLink
                          to={`/admin/roomlist/promotion/${room.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-violet-50 transition-all"
                          title="Promotions"
                        >
                          <BiSolidDiscount size={18} />
                        </NavLink>

                        <NavLink
                          to={`/admin/updateRoom/${room.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                          title="Edit Room"
                        >
                          <FaEdit size={16} />
                        </NavLink>
                        <button
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          onClick={() => handleDeleteRoom(room.id)}
                          title="Delete Room"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <NavLink
                        to={`/admin/get-review-by-room-id/${room.id}`}
                        className="inline-flex items-center px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-semibold rounded-lg border border-slate-100 transition-all"
                      >
                        Reviews
                      </NavLink>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="12"
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    No rooms available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      <ModalConfirm
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm delete?"
        message="Are you sure you want to delete this room?"
        onConfirm={handleDelete}
      />

      <div className="flex justify-center mt-6">
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
    </>
  );
};

export default Table;
