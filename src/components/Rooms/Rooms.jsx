import React, { useContext, useEffect, useState } from "react";
import { RoomContext } from "../../context/RoomContext";
import { AuthContext } from "../../context/AuthContext";
import BookForm from "../../components/BookForm/BookForm";
import { SpinnerDotted } from "spinners-react";
import introRoomPage from "../../assets/img/Rooms/room11.jpg";
import { Link } from "react-router-dom";
import { BsArrowsFullscreen, BsPeople } from "react-icons/bs";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import Rating from "@mui/material/Rating";

const Rooms = () => {
  const {
    roomsAvailable,
    rooms,
    loading,
    fetchAvailableRooms,
    fetchRoom,
    page,
    setPage,
    pageAvailable,
    setPageAvailable,
    totalPages,
  } = useContext(RoomContext);
  const { user } = useContext(AuthContext);

  // State để lưu trữ ngày check-in và check-out
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numOfAdults, setNumOfAdults] = useState(2);
  const [numOfChildren, setNumOfChildren] = useState(0);
  const [checkRoom, setCheckRoom] = useState(false);
  // const [page, setPage] = useState(0); // Số trang hiện tại
  // const [totalPages, setTotalPages] = useState(0); // Tổng số trang từ API

  const handlePageClick = (event) => {
    if (checkRoom) {
      setPageAvailable(event.selected);
    } else {
      setPage(event.selected);
    }
  };

  // Gọi hàm fetchAvailableRooms khi ngày check-in hoặc check-out thay đổi
  const handleFetchAvailable = () => {
    if (checkInDate && checkOutDate) {
      if (new Date(checkOutDate) > new Date(checkInDate)) {
        const totalGuest = numOfAdults + numOfChildren;
        fetchAvailableRooms(
          checkInDate,
          checkOutDate,
          totalGuest,
          pageAvailable
        );
        setCheckRoom(true);
      } else {
        toast.error("Check-out date must be later than check-in date.");
      }
    } else {
      toast.error("Please select both check-in and check-out dates.");
    }
  };

  const handleFetchAvailableRooms = () => {
    setCheckRoom(true);
  };

  // Fetch tất cả các phòng nếu user
  useEffect(() => {
    if (user) {
      // if (checkInDate && checkOutDate) {
      //   const totalGuest = numOfAdults + numOfChildren;
      //   fetchAvailableRooms(checkInDate, checkOutDate, totalGuest, page);
      // }

      if (checkRoom) {
        handleFetchAvailable();
      } else {
        fetchRoom(page);
      }
    }
  }, [
    page,
    pageAvailable,
    checkRoom,
    checkInDate,
    checkOutDate,
    numOfAdults,
    numOfChildren,
  ]);

  return (
    <section className="pb-20">
      {/* loading */}
      {loading && (
        <div className="h-screen fixed bottom-0 top-0 bg-black/90 w-full z-50 flex justify-center items-center">
          <SpinnerDotted color="white" />
        </div>
      )}

      <div className="h-[550px] overflow-hidden relative">
        <img
          src={introRoomPage}
          alt="Rooms & Suites"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/50 z-10"></div>
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white text-center px-4">
          <div className="font-tertiary uppercase text-xs lg:text-sm tracking-[6px] text-accent font-semibold mb-2">
            Aurora Grand
          </div>
          <h2 className="font-primary text-5xl lg:text-7xl tracking-wide mb-4">Rooms & Suites</h2>
          <span className="w-16 h-[2px] bg-accent/60 mt-1"></span>
        </div>
      </div>

      <div className="container mx-auto relative mb-32">
        <div
          className="bg-accent/20 mt-4 p-4 lg:shadow-xl lg:absolute
        lg:left-0 lg:right-0 lg:p-0 lg:z-30 lg:-top-12"
        >
          <BookForm
            checkInDate={checkInDate}
            setCheckInDate={setCheckInDate}
            checkOutDate={checkOutDate}
            setCheckOutDate={setCheckOutDate}
            numOfChildren={numOfChildren}
            setNumOfChildren={setNumOfChildren}
            numOfAdults={numOfAdults}
            setNumOfAdults={setNumOfAdults}
            handleFetchAvailableRooms={handleFetchAvailableRooms}
          />
        </div>
      </div>

      <div className="container mx-auto lg:px-0">
        <div className="grid grid-cols-1 max-w-sm mx-auto gap-[30px] lg:grid-cols-3 lg:max-w-none lg:mx-0 px-6 lg:px-0">
          {/* Hiển thị các phòng tùy thuộc vào vai trò người dùng và ngày check-in/check-out */}
          {checkRoom && roomsAvailable ? (
            // Nếu có check-in/check-out, hiển thị roomsAvailable
            roomsAvailable.length === 0 ? (
              <div className="text-center col-span-3 text-slate-500 py-12 font-medium">No rooms available.</div>
            ) : (
              roomsAvailable.map((room, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="overflow-hidden relative bg-slate-100 h-[250px]">
                    <img
                      className="group-hover:scale-105 transition-transform duration-500 h-full w-full object-cover"
                      src={room.roomPhotoUrl}
                      alt={room.roomType}
                    />
                    {checkRoom && room.remain !== undefined && (
                      <div className="absolute top-4 left-4 bg-emerald-600 text-white font-semibold text-xs px-2.5 py-1 rounded-lg shadow-sm z-10">
                        Remain: {room.remain}
                      </div>
                    )}
                    {room.percentOfDiscount > 0 && (
                      <div className="absolute top-4 right-4 bg-rose-500 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm z-10">
                        -{room.percentOfDiscount}% Off
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1 bg-white">
                    {/* Specs Row */}
                    <div className="flex gap-x-6 items-center text-xs uppercase tracking-wider text-slate-450 font-tertiary font-medium mb-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-x-1.5">
                        <BsArrowsFullscreen className="text-accent text-[13px]" />
                        <span>{room.roomSize} m²</span>
                      </div>
                      <div className="flex items-center gap-x-1.5">
                        <BsPeople className="text-accent text-[15px]" />
                        <span>{room.roomCapacity} Guests</span>
                      </div>
                    </div>

                    <Link to={`/rooms/${room.id}`}>
                      <h3 className="font-primary text-2xl text-slate-900 mb-2 hover:text-accent transition-colors duration-200">
                        {room.roomType}
                      </h3>
                    </Link>
                    <p className="text-slate-500 font-secondary text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                      {room.roomDescription}
                    </p>

                    {/* Price and Action Button Wrapper */}
                    <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-y-4">
                      <div className="flex items-baseline gap-x-2">
                        {room.percentOfDiscount > 0 ? (
                          <>
                            <span className="text-xs text-slate-400 line-through">
                              {room.roomPrice.toLocaleString("en-US")}₫
                            </span>
                            <span className="text-xl font-primary text-accent font-semibold">
                              {room.newPrice.toLocaleString("en-US")}₫
                            </span>
                            <span className="text-[10px] text-slate-400 font-tertiary uppercase tracking-wider">/ Night</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xl font-primary text-slate-900 font-semibold">
                              {room.roomPrice.toLocaleString("en-US")}₫
                            </span>
                            <span className="text-[10px] text-slate-400 font-tertiary uppercase tracking-wider">/ Night</span>
                          </>
                        )}
                      </div>

                      <Link
                        to={`/rooms/${room.id}`}
                        className="w-full h-11 bg-slate-900 text-white font-tertiary uppercase text-xs tracking-[2px] rounded-xl flex items-center justify-center hover:bg-accent transition-all duration-300 shadow-sm active:scale-98"
                      >
                        Book now
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : rooms?.length > 0 ? (
            // Nếu không có check-in/check-out hoặc là ADMIN, hiển thị rooms
            rooms.map((room, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="overflow-hidden relative bg-slate-100 h-[250px]">
                  <img
                    className="group-hover:scale-105 transition-transform duration-500 h-full w-full object-cover"
                    src={room.roomPhotoUrl}
                    alt={room.roomType}
                  />
                  {room.percentOfDiscount > 0 && (
                    <div className="absolute top-4 right-4 bg-rose-500 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm z-10">
                      -{room.percentOfDiscount}% Off
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1 bg-white">
                  {/* Specs Row */}
                  <div className="flex gap-x-6 items-center text-xs uppercase tracking-wider text-slate-450 font-tertiary font-medium mb-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-x-1.5">
                      <BsArrowsFullscreen className="text-accent text-[13px]" />
                      <span>{room.roomSize} m²</span>
                    </div>
                    <div className="flex items-center gap-x-1.5">
                      <BsPeople className="text-accent text-[15px]" />
                      <span>{room.roomCapacity} Guests</span>
                    </div>
                  </div>

                  <Link to={`/rooms/${room.id}`}>
                    <h3 className="font-primary text-2xl text-slate-900 mb-2 hover:text-accent transition-colors duration-200">
                      {room.roomType}
                    </h3>
                  </Link>
                  <p className="text-slate-500 font-secondary text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {room.roomDescription}
                  </p>

                  {/* Price and Action Button Wrapper */}
                  <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-y-4">
                    <div className="flex items-baseline gap-x-2">
                      {room.percentOfDiscount > 0 ? (
                        <>
                          <span className="text-xs text-slate-400 line-through">
                            {room.roomPrice.toLocaleString("en-US")}₫
                          </span>
                          <span className="text-xl font-primary text-accent font-semibold">
                            {room.newPrice.toLocaleString("en-US")}₫
                          </span>
                          <span className="text-[10px] text-slate-400 font-tertiary uppercase tracking-wider">/ Night</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xl font-primary text-slate-900 font-semibold">
                            {room.roomPrice.toLocaleString("en-US")}₫
                          </span>
                          <span className="text-[10px] text-slate-400 font-tertiary uppercase tracking-wider">/ Night</span>
                        </>
                      )}
                    </div>

                    <Link
                      to={`/rooms/${room.id}`}
                      className="w-full h-11 bg-slate-900 text-white font-tertiary uppercase text-xs tracking-[2px] rounded-xl flex items-center justify-center hover:bg-accent transition-all duration-300 shadow-sm active:scale-98"
                    >
                      Book now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-3 text-slate-500 py-12 font-medium">No rooms available.</p>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-16 mb-8">
        <ReactPaginate
          breakLabel="..."
          nextLabel="NEXT →"
          onPageChange={handlePageClick}
          forcePage={checkRoom ? pageAvailable : page}
          pageRangeDisplayed={5}
          pageCount={totalPages}
          previousLabel="← PREVIOUS"
          className="flex space-x-1.5 items-center justify-center"
          pageClassName="page-item"
          pageLinkClassName="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 text-sm font-medium transition-all"
          activeLinkClassName="active bg-accent text-white border-accent hover:bg-accent-hover"
          previousClassName="page-item"
          previousLinkClassName="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 text-sm font-medium transition-all"
          nextClassName="page-item"
          nextLinkClassName="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 text-sm font-medium transition-all"
          breakClassName="page-item"
          breakLinkClassName="px-3.5 py-2 text-slate-400"
          disabledLinkClassName="opacity-40 cursor-not-allowed hover:bg-transparent"
          containerClassName="pagination"
        />
      </div>
    </section>
  );
};

export default Rooms;
