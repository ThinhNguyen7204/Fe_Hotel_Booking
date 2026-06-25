import React, { useContext } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdNotifications } from "react-icons/io";
import User1 from "../../assets/img/user1.png"; // Hình ảnh người dùng (có thể thay đổi)
import UserIcon from "../../assets/img/userIcon.png";

import { AuthContext } from "../../context/AuthContext"; // Đảm bảo import đúng đường dẫn

const DashboardHeader = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ context

  return (
    <div className="flex items-center justify-between lg:justify-end py-3 px-8 bg-white border-b border-slate-100 shadow-sm">
      {/* Hamburger menu */}
      <button onClick={toggleSidebar} className="lg:hidden text-slate-600 hover:bg-slate-50 p-2 rounded-xl transition-all">
        <GiHamburgerMenu size={20} />
      </button>

      {/* Right side (notifications, profile) */}
      <nav className="flex items-center gap-x-6">
        <button className="text-slate-400 hover:text-indigo-600 hover:bg-slate-50 p-2.5 rounded-xl transition-all relative">
          <IoMdNotifications size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center gap-x-3.5 pl-4 border-l border-slate-100">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 shadow-inner flex items-center justify-center">
            <img
              src={user.imageUrl || UserIcon}
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            {/* Hiển thị tên và vai trò của người dùng */}
            <div className="font-semibold text-slate-800 text-[14px] leading-tight">
              {user ? user.name : "User"}
            </div>
            <div className="mt-0.5 flex">
              <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider leading-none">
                {user ? user.role : "Guest"}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DashboardHeader;
