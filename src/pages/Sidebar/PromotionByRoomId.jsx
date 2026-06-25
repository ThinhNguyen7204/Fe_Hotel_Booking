import React, { useState, useEffect } from "react";
import {
  deletePromotion,
  getPromotionByRoomId,
} from "../../services/PromotionService";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalConfirm from "../../components/ModalConfirm/ModalConfirm";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const PromotionByRoomId = () => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [deleteID, setDeleteID] = useState(null);
  const [isModalDelete, setModalDelete] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const result = await getPromotionByRoomId(id, page);
        console.log(result);
        setPromotions(result.data.promotionList);
        setTotalPages(result.data.totalPages); // Giả sử API trả về totalPages
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchPromotions();
  }, [id, page]);

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  const handleDelete = (id) => {
    setDeleteID(id);
    setModalDelete(true);
  };

  const handleDeletePromotion = async () => {
    try {
      const result = await deletePromotion(deleteID);

      if (result.status === 200) {
        toast.success("Promotion deleted successfully");

        // Fetch updated promotion list after deletion
        const updatedResult = await getPromotionByRoomId(id, page);
        setPromotions(updatedResult.data.promotionList);
        setTotalPages(updatedResult.data.totalPages);
      } else {
        toast.error("Error deleting promotion");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setModalDelete(false);
    }
  };

  return (
    <section className="p-8 bg-slate-50/30 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/admin/roomlist"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-sm font-medium rounded-xl border border-slate-200 shadow-sm transition-all mb-4"
          >
            <FaArrowLeft size={14} />
            <span>Back to Rooms</span>
          </Link>
          <h2 className="font-semibold text-2xl text-slate-800">Room's Promotions</h2>
          <p className="text-sm text-slate-500">Active discount events applied to Room #{id}.</p>
        </div>
      </div>

      <div className="mt-8">
        {promotions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promotion) => (
              <div
                key={promotion.id}
                className="relative border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                {/* Promotion Image & Percent Badge */}
                <div className="w-full h-44 relative overflow-hidden bg-slate-100">
                  <img
                    src={promotion.promotionPhotoUrl}
                    alt={promotion.description}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-rose-500 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm">
                    {promotion.percentOfDiscount}% OFF
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-base text-slate-800 mb-1.5">
                    {promotion.promotionTitle}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[40px]">
                    {promotion.description}
                  </p>

                  <div className="mt-auto space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Validity:</span>
                      <span className="font-medium text-slate-600">
                        {promotion.startDate} to {promotion.endDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dashed divider line for tear-off ticket look */}
                <div className="relative flex items-center px-5 py-1">
                  <div className="w-full border-t border-dashed border-slate-200"></div>
                  {/* Left Circle cutout */}
                  <div className="absolute -left-2 w-4 h-4 bg-slate-50 border-r border-slate-100 rounded-full"></div>
                  {/* Right Circle cutout */}
                  <div className="absolute -right-2 w-4 h-4 bg-slate-50 border-l border-slate-100 rounded-full"></div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-slate-50/50 flex justify-end gap-2 border-t border-slate-50">
                  <Link
                    to={`/admin/promotion/update/${promotion.id}`}
                    className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:text-emerald-600 transition-colors shadow-sm"
                    title="Edit Promotion"
                  >
                    <FaEdit size={16} />
                  </Link>
                  <button
                    className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:text-rose-600 transition-colors shadow-sm"
                    onClick={() => handleDelete(promotion.id)}
                    title="Delete Promotion"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center text-slate-400">
            No promotions available.
          </div>
        )}
      </div>

      {/* Modal Confirm Delete */}
      <ModalConfirm
        open={isModalDelete}
        onClose={() => setModalDelete(false)}
        title="Confirm Delete?"
        message="Are you sure you want to delete this promotion?"
        onConfirm={handleDeletePromotion}
      />

      {/* Pagination */}
      <div className="flex justify-center mt-8">
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

export default PromotionByRoomId;
