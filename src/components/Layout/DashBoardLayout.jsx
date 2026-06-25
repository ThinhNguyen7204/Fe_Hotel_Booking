import React, { useState } from 'react';
import Sidebar from "../Sidebar/Sidebar";
import DashboardHeader from "../DashboardHeader/DashboardHeader";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to track sidebar visibility
  const role = "admin";

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen); // Toggle the sidebar visibility
  };

  return (
    <>
      <section>
        <div className="flex flex-row">
          {/* Sidebar */}
          <div 
            className={`${
              isSidebarOpen ? 'block' : 'hidden'
            } lg:block fixed lg:static z-40 top-0 left-0 w-[65%] lg:w-[20%] bg-slate-900 border-r border-slate-800 shadow-xl px-4 py-6 transition-all duration-300 ease-in-out lg:transition-none min-h-screen`}
          >
            <Sidebar role={role} />
          </div>

          {/* Content area */}
          <div className="w-full lg:w-[80%] bg-slate-50/50 min-h-screen flex flex-col min-w-0">
            <DashboardHeader toggleSidebar={toggleSidebar} /> {/* Pass the toggleSidebar function */}
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </div>

        {/* Overlay for small screens when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
            onClick={toggleSidebar} // Close sidebar when clicking on overlay
          ></div>
        )}
      </section>
    </>
  );
};

export default DashboardLayout;
