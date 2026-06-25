// src/pages/Report.jsx
import { React, useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { getReport } from '../../services/ReportService';
import { toast } from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Report = () => {
  const [reports, setReport] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useEffect(() => {
    // Tạo danh sách các năm từ năm hiện tại trở về trước (6 năm gần nhất)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
    setAvailableYears(years);
    const fetchReports = async () => {
      try {
        const result = await getReport(year);
        setReport(result.report);
        console.log(result.report);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchReports();
  }, [year]);
  // Dữ liệu biểu đồ doanh thu
  const revenueData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Revenue ($)',
        data: reports?.revenuePerMonth || [],
        backgroundColor: 'rgba(99, 102, 241, 0.85)',
        hoverBackgroundColor: 'rgba(79, 70, 229, 1)',
        borderRadius: 8,
      },
    ],
  };

  // Dữ liệu biểu đồ tần số đăng nhập
  const bookingData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Total Bookings',
        data: reports?.totalBookingsPerMonth || [],
        backgroundColor: 'rgba(139, 92, 246, 0.85)',
        hoverBackgroundColor: 'rgba(124, 58, 237, 1)',
        borderRadius: 8,
      },
    ],
  };

  // Dữ liệu biểu đồ xu hướng đặt phòng
  const trendingRoomsData = {
    labels: reports?.trendingRooms || [],
    datasets: [
      {
        label: 'Trending Room Bookings',
        data: reports?.trendingRoomBookingsPerMonth || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            family: "'Inter', sans-serif",
            weight: 500,
          },
          color: '#64748b',
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: '#f1f5f9'
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="p-8 bg-slate-50/30 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-semibold text-2xl text-slate-800">Business Report for {year}</h2>
          <p className="text-sm text-slate-500">Analyze monthly revenue, reservations, and popular accommodation trends.</p>
        </div>
        {/* Thanh chọn năm dạng thu gọn */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 transition-all"
          >
            <span>Select Year: {year}</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-36 max-h-56 overflow-y-auto bg-white border border-slate-100 rounded-xl shadow-lg z-10 p-1 py-1.5 scrollbar-thin">
              {availableYears.map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    setYear(y);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    year === y
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Year {y}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <h3 className="font-semibold text-base text-slate-800 mb-1">Revenue per Month</h3>
          <p className="text-xs text-slate-400 mb-6">Total monthly revenue received in USD ($)</p>
          <div className="h-[280px] w-full flex justify-center">
            <Bar data={revenueData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <h3 className="font-semibold text-base text-slate-800 mb-1">Total Bookings per Month</h3>
          <p className="text-xs text-slate-400 mb-6">Total volume of completed reservations per month</p>
          <div className="h-[280px] w-full flex justify-center">
            <Bar data={bookingData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <h3 className="font-semibold text-base text-slate-800 mb-1">Trending Rooms</h3>
        <p className="text-xs text-slate-400 mb-6">Room types booking popularity timeline</p>
        <div className="h-[320px] w-full flex justify-center">
          <Line data={trendingRoomsData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Report;
