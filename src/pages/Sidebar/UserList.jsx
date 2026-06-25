import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext"; // Đảm bảo đường dẫn đúng đến AuthProvider
import { NavLink, Link } from "react-router-dom";
import { TiEyeOutline } from "react-icons/ti";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import UserIcon from "../../assets/img/userIcon.png";
import ReactPaginate from "react-paginate";
import { FaHistory } from "react-icons/fa";

const UserList = () => {
  const { userList, page, setPage, totalPages } = useContext(AuthContext); // Lấy userList từ AuthContext

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  return (
    <section className="p-4 md:p-8 bg-slate-50/30 min-h-screen w-full min-w-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-semibold text-2xl text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500">Manage registered customers and staff credentials.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 w-full max-w-7xl">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/75 border-b border-slate-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">
                  S.N
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Name
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Email
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Role
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Photo
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Phone Number
                </th>
                <th scope="col" className="px-6 py-4 font-semibold text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userList && userList.length > 0 ? (
                userList.map((user, index) => (
                  <tr
                    key={user.id}
                    className="bg-white hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">{page * 10 + index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 capitalize">{user.name}</td>
                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.role?.toLowerCase() === "admin" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 uppercase">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center bg-slate-50">
                        <img
                          src={user.imageUrl || UserIcon}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{user.phoneNumber || "N/A"}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <Link
                          to={`/admin/userlist/booking/${user.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          title="View Booking History"
                        >
                          <FaHistory size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

export default UserList;
