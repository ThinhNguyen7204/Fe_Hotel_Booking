import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRoomById } from "../../services/RoomService";
import { toast } from "react-toastify";
import { getReviewByRoomId } from "../../services/ReviewService";
import UserIcon from "../../assets/img/userIcon.png";
import AdultsDropdown from "../../components/AdultsDropdown/AdultsDropdown";
import KidsDropdown from "../../components/KidsDropdown/KidsDropdown";
import CheckIn from "../../components/CheckIn/CheckIn";
import CheckOut from "../../components/CheckOut/CheckOut";
import { AuthContext } from "../../context/AuthContext";
import {
  checkAvailableRooms,
  userBooking,
} from "../../services/BookingService";
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
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { FaStar, FaSuitcase } from "react-icons/fa";
import moment from "moment";
import ReactPaginate from "react-paginate";

function RatingDisplay({ averageRating }) {
  const roundedRating = averageRating ? averageRating.toFixed(1) : 0;
  return (
    <Box sx={{ display: "flex", alignItems: "center", marginTop: "1px" }}>
      <Box
        sx={{
          fontWeight: "bold",
          textDecoration: "underline",
          marginRight: "8px",
        }}
      >
        {roundedRating}
      </Box>
      <Rating
        name="read-only"
        value={Number(roundedRating)}
        precision={0.5}
        readOnly
        getLabelText={(value) => `${value} Star${value !== 1 ? "s" : ""}`}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      <Box sx={{ ml: 2 }}>{}</Box>
    </Box>
  );
}

const facilityItems = [
  { key: "wifiInfo", icon: FaWifi, label: "Free WiFi" },
  { key: "coffeeInfo", icon: FaCoffee, label: "Coffee Maker" },
  { key: "bathInfo", icon: FaBath, label: "Bath Tub" },
  { key: "parkingInfo", icon: FaParking, label: "Free Parking" },
  { key: "poolInfo", icon: FaSwimmingPool, label: "Pool Access" },
  { key: "breakfastInfo", icon: FaHotdog, label: "Breakfast" },
  { key: "gymInfo", icon: FaStopwatch, label: "Gym Enabled" },
  { key: "drinkInfo", icon: FaCocktail, label: "Welcome Drink" }
];

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [reviews, setReviews] = useState([]);
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numOfAdults, setNumOfAdults] = useState(2);
  const [numOfChildren, setNumOfChildren] = useState(0);
  const [checkAvailable, setCheckAvailable] = useState(false);
  const { user } = useContext(AuthContext);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  // Sử dụng useEffect để lấy dữ liệu phòng khi component được mount
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomData = await getRoomById(id);
        setRoom(roomData);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const result = await getReviewByRoomId(id, page); // Lấy page đầu tiên
        setReviews(result.reviewList);
        console.log(result.reviewList);
        setTotalPages(result.totalPages);
      } catch (error) {
        toast.error("Failed to fetch reviews.");
      }
    };
    fetchReviews();

    fetchRoomData();
  }, [id, page]);

  const handleChecking = async () => {
    if (user.role === "USER") {
      if (checkInDate && checkOutDate) {
        if (new Date(checkOutDate) > new Date(checkInDate)) {
          try {
            const totalGuests = numOfAdults + numOfChildren;
            const result = await checkAvailableRooms(
              checkInDate,
              checkOutDate,
              totalGuests,
              room.id
            );

            if (result.status === 200) {
              setCheckAvailable(true);
              toast.success("Available Rooms");
            }
          } catch (error) {
            toast.error("No room available");
          }
        } else {
          toast.error("Check-out date must be later than check-in date.");
        }
      } else {
        toast.error("Please select both check-in and check-out dates.");
      }
    } else {
      toast.error("Only user can check");
    }
  };

  const handleBooking = async () => {
    try {
      setCheckAvailable(false);
      const totalNumOfGuest = numOfAdults + numOfChildren;
      const result = await userBooking(
        checkInDate,
        checkOutDate,
        numOfChildren,
        numOfAdults,
        totalNumOfGuest,
        room.id
      );

      if (result.status === 200) {
        toast.success("Booking successfully! Redirecting to payment...");
        setTimeout(() => {
          navigate("/recent-booking");
        }, 1500);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again");
    }
  };

  const countNumberOfNights = () => {
    const start = moment(checkInDate);
    const end = moment(checkOutDate);
    const numberOfNights = end.diff(start, "days"); // Số ngày giữa checkIn và checkOut

    return numberOfNights;
  };

  // Hàm tính giá phòng sau giảm giá
  const calculatePrice = () => {
    if (checkInDate && checkOutDate) {
      const start = moment(checkInDate);
      const end = moment(checkOutDate);
      const numberOfNights = end.diff(start, "days"); // Số ngày giữa checkIn và checkOut

      if (numberOfNights > 0) {
        // Tính giá sau giảm giá
        const priceAfterDiscount =
          room?.roomPrice * (1 - room?.percentOfDiscount / 100);
        return priceAfterDiscount * numberOfNights; // Giá phòng nhân số ngày
      }
    }
    return room?.roomPrice * (1 - room?.percentOfDiscount / 100); // Trả về giá gốc nếu không có ngày đặt
  };

  return (
    <section className="bg-slate-50/30 min-h-screen py-12">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row h-full pb-24 pt-28 gap-y-10 lg:gap-y-0">
          {/* left  */}
          <div className="w-full h-full lg:w-[60%] px-6">
            <h2 className="font-primary text-4xl lg:text-5xl text-slate-900 mb-4 tracking-wide font-normal">
              Room Detail - {room?.roomType}
            </h2>
            <p className="text-slate-500 font-secondary text-base leading-relaxed mb-8">
              {room?.roomDescription}
            </p>
            <img 
              className="w-full h-[450px] object-cover rounded-3xl shadow-lg border border-slate-100 mb-8" 
              src={room?.roomPhotoUrl} 
              alt={room?.roomType} 
            />
            
            {/* Room Metadata Bar */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8 text-sm text-slate-500 border-y border-slate-150 py-4">
              <RatingDisplay averageRating={room?.averageRating || 0} />
              <span className="text-slate-200 hidden sm:inline">|</span>
              <span className="flex items-center gap-2">
                <FaSuitcase className="text-accent" />
                <span>Booked: <strong className="text-slate-800">{room?.numberOfBooking}</strong></span>
              </span>
              <span className="text-slate-200 hidden sm:inline">|</span>
              <span className="flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                <span>Reviews: <strong className="text-slate-800">{room?.numberOfRating}</strong></span>
              </span>
              {room?.percentOfDiscount > 0 && (
                <>
                  <span className="text-slate-200 hidden sm:inline">|</span>
                  <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    -{room?.percentOfDiscount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* facilities */}
            <div className="mt-12">
              <h3 className="font-primary text-2xl text-slate-900 mb-3">Room Facilities</h3>
              <p className="text-slate-500 font-secondary text-sm leading-relaxed mb-8">
                You are welcome to see the rooms, whose luxury and comfort will
                help you rest and relax after a whole day of sightseeing and
                admiring the capital city.
              </p>
            </div>

            {/* Grid of Facilities badging */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              {room?.facility ? (
                facilityItems.map((item) => {
                  if (room.facility[item.key]) {
                    const IconComponent = item.icon;
                    return (
                      <div key={item.key} className="flex flex-col items-center justify-center p-4 border border-slate-150 rounded-2xl bg-white shadow-sm hover:border-accent/40 transition-colors group">
                        <IconComponent className="text-accent group-hover:scale-110 transition-transform duration-300 text-2xl mb-2" />
                        <span className="text-[10px] font-semibold text-slate-700 font-tertiary tracking-wider uppercase text-center">{item.label}</span>
                      </div>
                    );
                  }
                  return null;
                })
              ) : (
                <span className="text-slate-400 text-sm">No facilities available</span>
              )}
            </div>
          </div>

          {/* right  */}
          <div className="w-full h-full lg:w-[40%] px-6">
            {/* reservation  */}
            <div className="bg-white rounded-3xl border border-slate-150 shadow-xl p-8 mb-12">
              <h3 className="font-primary text-2xl text-slate-900 mb-6 font-semibold pb-3 border-b border-slate-100">Your Reservation</h3>
              <div className="flex flex-col space-y-4 mb-6">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-tertiary font-bold">Check In</label>
                  <div className="h-[54px] rounded-xl border border-slate-200 bg-white transition-all focus-within:border-accent">
                    <CheckIn setCheckInDate={setCheckInDate} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-tertiary font-bold">Check Out</label>
                  <div className="h-[54px] rounded-xl border border-slate-200 bg-white transition-all focus-within:border-accent">
                    <CheckOut setCheckOutDate={setCheckOutDate} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-tertiary font-bold">Adults</label>
                    <div className="h-[54px] rounded-xl border border-slate-200 bg-white transition-all focus-within:border-accent">
                      <AdultsDropdown setNumOfAdults={setNumOfAdults} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-tertiary font-bold">Kids</label>
                    <div className="h-[54px] rounded-xl border border-slate-200 bg-white transition-all focus-within:border-accent">
                      <KidsDropdown setNumOfChildren={setNumOfChildren} />
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="w-full h-12 bg-slate-900 text-white font-tertiary uppercase text-xs tracking-[2px] rounded-xl flex items-center justify-center hover:bg-accent transition-all duration-300 shadow-md active:scale-98 font-semibold"
                onClick={handleChecking}
              >
                Check Availability
              </button>

              {checkAvailable && user.role === "USER" && (
                <button
                  className="w-full py-4.5 bg-accent text-white font-tertiary uppercase text-xs tracking-[2px] rounded-xl flex flex-col items-center justify-center hover:bg-accent-hover transition-all duration-300 shadow-md active:scale-98 mt-4 font-semibold px-4"
                  onClick={handleBooking}
                >
                  {room?.percentOfDiscount > 0 ? (
                    <div className="text-center py-1">
                      <div className="text-[10px] uppercase tracking-wider opacity-85 mb-0.5">Book now at discounted price:</div>
                      <div className="flex items-center justify-center gap-x-2">
                        <span className="text-base font-bold">
                          {calculatePrice()?.toLocaleString()}₫
                        </span>
                        <span className="text-xs line-through opacity-60">
                          {(room?.roomPrice * countNumberOfNights()).toLocaleString()}₫
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-1.5">
                      <div className="text-[10px] uppercase tracking-wider opacity-85 mb-0.5">Confirm Booking:</div>
                      <span className="text-base font-bold">
                        {room?.roomPrice.toLocaleString()}₫
                      </span>
                    </div>
                  )}
                </button>
              )}
            </div>

            {/* rules */}
            <div className="bg-white rounded-3xl border border-slate-150 shadow-md p-8 mb-12">
              <h3 className="font-primary text-2xl text-slate-900 mb-4 font-semibold">Hotel Rules</h3>
              <p className="text-slate-500 font-secondary text-sm leading-relaxed mb-6">
                Hotel management will highly appreciate your collaboration in
                abiding by these rules and regulations, whose aim is to ensure a
                peaceful and safe stay for our Guests.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <li className="flex items-center gap-x-3 text-sm text-slate-700">
                  <FaCheck className="text-accent flex-shrink-0" />
                  <span>Check-in: 3:00 - 9:00 PM</span>
                </li>
                <li className="flex items-center gap-x-3 text-sm text-slate-700">
                  <FaCheck className="text-accent flex-shrink-0" />
                  <span>Check-out: 10:30 AM</span>
                </li>
                <li className="flex items-center gap-x-3 text-sm text-slate-700">
                  <FaCheck className="text-accent flex-shrink-0" />
                  <span>No Pets</span>
                </li>
                <li className="flex items-center gap-x-3 text-sm text-slate-700">
                  <FaCheck className="text-accent flex-shrink-0" />
                  <span>No Smoking</span>
                </li>
              </ul>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-3xl border border-slate-150 shadow-md p-8">
              <h3 className="font-primary text-2xl text-slate-900 mb-6 font-semibold">Guest Reviews</h3>
              {reviews.length > 0 ? (
                <>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 flex items-start space-x-4 hover:bg-slate-50 transition-colors duration-250"
                      >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 shadow-inner flex items-center justify-center">
                          <img
                            src={review.user?.imageUrl || UserIcon}
                            alt={review.user?.name || "User Avatar"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Nội dung review */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                            <h4 className="font-semibold text-slate-800 text-sm truncate">
                              {review.user?.name || "Anonymous"}
                            </h4>
                            <Rating
                              name="read-only"
                              value={review.reviewRate}
                              precision={0.5}
                              readOnly
                              size="small"
                            />
                          </div>
                          <p className="text-slate-600 text-xs leading-relaxed mb-2 break-words">
                            {review.comment}
                          </p>
                          <p className="text-slate-400 text-[10px] font-medium">
                            {moment(review.createdTime).format(
                              "MMMM Do YYYY, h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-slate-400 text-sm italic py-4">No reviews available for this room yet.</p>
              )}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="NEXT →"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={totalPages}
                    previousLabel="← PREVIOUS"
                    className="flex space-x-1 items-center justify-center"
                    pageClassName="page-item"
                    pageLinkClassName="px-3 py-1.5 border border-slate-200 hover:bg-slate-550/5 rounded-xl text-slate-600 text-[11px] font-medium transition-all"
                    activeLinkClassName="active bg-accent text-white border-accent hover:bg-accent-hover"
                    previousClassName="page-item"
                    previousLinkClassName="px-3 py-1.5 border border-slate-200 hover:bg-slate-550/5 rounded-xl text-slate-600 text-[11px] font-medium transition-all"
                    nextClassName="page-item"
                    nextLinkClassName="px-3 py-1.5 border border-slate-200 hover:bg-slate-550/5 rounded-xl text-slate-600 text-[11px] font-medium transition-all"
                    breakClassName="page-item"
                    breakLinkClassName="px-3 py-1.5 text-slate-400"
                    disabledLinkClassName="opacity-40 cursor-not-allowed hover:bg-transparent"
                    containerClassName="pagination"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
