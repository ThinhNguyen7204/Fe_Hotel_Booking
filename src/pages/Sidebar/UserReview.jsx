import React, { useState, useEffect, useContext } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import ModalConfirm from "../../components/ModalConfirm/ModalConfirm";
import { toast } from "react-toastify";
import {
  deleteReview,
  getReviewById,
  getReviewByUserId,
  updateReview,
} from "../../services/ReviewService";
import ReactPaginate from "react-paginate";
import HoverRating from "./HoverRating";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AuthContext } from "../../context/AuthContext";
import { FaTimes } from "react-icons/fa";
import moment from "moment";
import UserIcon from "../../assets/img/userIcon.png";

const UserReview = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [reviewToUpdate, setReviewToUpdate] = useState(null);
  const [reviewData, setReviewData] = useState([]);

  const [reviewByUserID, setReviewByUserID] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useContext(AuthContext);

  // Mở modal cập nhật review và tải dữ liệu review
  const handleUpdateReview = async (id) => {
    try {
      const result = await getReviewById(id);
      setReviewData(result.review);
      setReviewToUpdate(id);
      setModalUpdateOpen(true);
    } catch (error) {
      toast.error("Error fetching review data");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateReview(reviewToUpdate, reviewData);
      toast.success("Review updated successfully.");
      setModalUpdateOpen(false);

      fetchReviewByUserID(user.id, page);
    } catch (error) {
      toast.error("Error updating review");
    }
  };

  const handleDeleteReview = (id) => {
    setReviewToDelete(id);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await deleteReview(reviewToDelete);
      toast.success("Delete successfully review.");
    } catch (error) {
      toast.error("Error delete review");
    } finally {
      setModalOpen(false);
      fetchReviewByUserID(user.id, page);
    }
  };

  useEffect(() => {
    fetchReviewByUserID(user.id, page);
  }, [user.id, page]);

  const fetchReviewByUserID = async (userId, page) => {
    try {
      const result = await getReviewByUserId(userId, page);
      console.log(result.reviewList);
      setReviewByUserID(result.reviewList);
      setTotalPages(result.totalPages);
    } catch (error) {
      toast.error("Error fetching review data get by user id", error);
    }
  };

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  const renderStars = (rating) => {
    const filledStars = Math.round(rating); // Làm tròn rating để lấy số sao
    const totalStars = 5; // Tổng số sao tối đa
    let stars = "";

    for (let i = 0; i < totalStars; i++) {
      stars += i < filledStars ? "★" : "☆"; // Thêm sao đổ đầy (★) hoặc sao rỗng (☆)
    }

    return stars;
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50/50 min-h-screen w-full min-w-0">
      {/* Welcome & Heading Banner */}
      <div className="mb-8">
        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          Feedback & Opinions
        </span>
        <h1 className="text-slate-800 text-3xl font-extrabold mt-3 tracking-tight">
          My Reviews
        </h1>
        <p className="text-slate-500 text-[15px] mt-1.5 leading-relaxed">
          Manage your opinions and ratings for the rooms you stayed in.
        </p>
      </div>

      {/* Reviews Section */}
      <div className="max-w-5xl">
        {reviewByUserID.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {reviewByUserID.map((item, index) => (
              <div 
                key={item.id || index}
                className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 shadow-inner flex items-center justify-center">
                    <img
                      src={item.user?.imageUrl || UserIcon}
                      alt={item.user?.name || "User Avatar"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <h4 className="font-bold text-slate-800 text-base truncate">
                        {item.user?.name || "Anonymous"}
                      </h4>
                      <div className="flex text-yellow-500 text-sm">
                        {renderStars(item.reviewRate)}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-2 break-words">
                      {item.comment}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 font-medium">
                      <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg border border-indigo-100 font-semibold">
                        Room Type: {item.room?.roomType}
                      </span>
                      <span>•</span>
                      <span>{moment(item.createdTime).format("MMMM Do YYYY, h:mm a")}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleUpdateReview(item.id)}
                    className="flex items-center justify-center w-10 h-10 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition-colors"
                    title="Edit Review"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteReview(item.id)}
                    className="flex items-center justify-center w-10 h-10 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-colors"
                    title="Delete Review"
                  >
                    <FaTrash size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 shadow-sm text-center">
            <p className="text-slate-450 font-medium italic">You haven't submitted any reviews yet.</p>
          </div>
        )}

        {/* Pagination */}
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

      {isModalOpen && (
        <ModalConfirm
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm Delete"
          message="Are you sure you want to delete this review?"
          onConfirm={handleDelete}
        />
      )}

      {/* Modal cập nhật review */}
      <Modal open={isModalUpdateOpen} onClose={() => setModalUpdateOpen(false)}>
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
            onClick={() => setModalUpdateOpen(false)}
          >
            <FaTimes size={16} color="gray" />
          </div>
          <h2 className="font-primary text-2xl text-slate-800 text-center mb-6 font-semibold">
            UPDATE REVIEW
          </h2>
          <div className="mb-4 flex flex-col items-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Your Rating</span>
            <HoverRating
              value={reviewData.reviewRate}
              onChange={(event, newValue) =>
                setReviewData({ ...reviewData, reviewRate: newValue })
              }
            />
          </div>
          <TextField
            label="Comment"
            multiline
            rows={4}
            value={reviewData.comment || ""}
            onChange={(e) =>
              setReviewData({ ...reviewData, comment: e.target.value })
            }
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
            onClick={handleUpdate}
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
            Save Changes
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UserReview;
