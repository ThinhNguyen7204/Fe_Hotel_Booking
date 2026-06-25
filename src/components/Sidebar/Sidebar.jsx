import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CiGrid41 } from "react-icons/ci";
import { IoIosLogOut, IoIosHeartEmpty } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";

import { MdOutlineCategory, MdOutlineBedroomParent } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { TbCurrencyDollar } from "react-icons/tb";
import { FaHistory } from "react-icons/fa";
import { FaStar, FaThumbsUp } from "react-icons/fa";

import ModalConfirm from "../ModalConfirm/ModalConfirm";
import logoutImage from "../../assets/img/logout.jpg";
import Logo from "../../assets/img/LogoHotel.jpg";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Hàm xử lý logout
  const handleLogout = () => {
    logout(); // Gọi hàm logout từ context
    navigate("/"); // Điều hướng về trang home sau khi logout
  };

  // Hàm tạo class cho các NavLink
  const getNavLinkClass = (isActive) =>
    `flex items-center gap-3.5 mb-2 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-300 ease-in-out ${
      isActive
        ? "text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-600/20"
        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
    }`;

  return (
    <>
      <section className="flex flex-col h-[calc(100vh-2rem)] justify-between">
        <div className="flex flex-col">
          {/* Logo và tên khách sạn */}
          <NavLink to="/" className="flex items-center mb-8 px-2 transition-opacity hover:opacity-90">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
              <img src={Logo} alt="Logo" className="w-8 h-8 object-cover" />
            </div>
            <div className="pl-3 text-[18px] font-bold text-white tracking-wide">
              Aurora Grand
            </div>
          </NavLink>

          {/* Các mục điều hướng của Sidebar */}
          <nav className="flex flex-col space-y-1">
            {/* Mục hiển thị cho Admin */}
            {user?.role === "ADMIN" && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  <CiGrid41 size={20} />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink
                  to="/admin/userlist"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  <FiUser size={20} />
                  <span>All Users</span>
                </NavLink>

                <NavLink
                  to="/admin/roomlist"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  <MdOutlineBedroomParent size={20} />
                  <span>All Rooms List</span>
                </NavLink>

                <NavLink
                  to="/admin/booking-history"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  <FaHistory size={20} />
                  <span>Booking History</span>
                </NavLink>

                <NavLink
                  to="/admin/booking-late-payments"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  <FaHistory size={20} />
                  <span>Late Payments</span>
                </NavLink>

                <NavLink
                  to="/admin/promotion"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  <MdOutlineCategory size={20} />
                  <span>Promotions</span>
                </NavLink>

                <NavLink
                  to="/admin/report"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  <TbCurrencyDollar size={20} />
                  <span>Reports</span>
                </NavLink>
              </>
            )}

            {/* Mục hiển thị cho User */}
            {user?.role === "USER" && (
              <>
                <NavLink
                  to="/recent-booking"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  <TbCurrencyDollar size={20} />
                  <span>Recent Booking</span>
                </NavLink>

                <NavLink
                  to="/booking-history"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  <FaHistory size={20} />
                  <span>Booking History</span>
                </NavLink>

                <NavLink
                  to="/user-review"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  <FaStar size={20} />
                  <span>My Reviews</span>
                </NavLink>
              </>
            )}

            {/* Mục Profile cho cả User và Admin */}
            <NavLink
              to="/profile"
              className={({ isActive }) => getNavLinkClass(isActive)}
            >
              <IoSettingsOutline size={20} />
              <span>Personal Profile</span>
            </NavLink>
          </nav>
        </div>

        {/* Nút Logout đẩy xuống dưới cùng */}
        <div className="pt-4 border-t border-slate-800/80 px-2 mt-auto">
          <button
            onClick={() => setModalOpen(true)}
            className="w-full flex items-center justify-center gap-2.5 text-slate-400 hover:text-white bg-slate-800/40 hover:bg-red-600/10 border border-slate-850 hover:border-red-500/20 py-2.5 px-4 rounded-xl transition-all duration-300 ease-in-out text-[14px] font-semibold group"
          >
            <IoIosLogOut size={18} className="transition-transform group-hover:translate-x-0.5" />
            <span>Log Out</span>
          </button>
        </div>

        {/* Modal xác nhận logout */}
        <ModalConfirm
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm Logout"
          message="Are you sure you want to log out?"
          onConfirm={handleLogout}
          image={logoutImage}
        />
      </section>
    </>
  );
};

export default Sidebar;
