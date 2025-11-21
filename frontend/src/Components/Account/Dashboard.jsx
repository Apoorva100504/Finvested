import React from "react";
import { Link, Outlet } from "react-router-dom";

const Dashboard = ({ isDashboardModalOpen, onToggleDashboardModal }) => {
  return (
    <div className="relative">

      {/* MODAL OVERLAY */}
      {isDashboardModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-end pr-6 pt-16 z-50"
          onClick={onToggleDashboardModal}
        >
          {/* MODAL BOX */}
          <div
            className="w-80 bg-white rounded-xl shadow-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex flex-col mb-2">
              <h3 className="text-lg font-semibold">shironikashiro13</h3>
              <p className="text-sm text-gray-600">shironikashiro13@gmail.com</p>
            </div>

            <hr className="my-2" />

            {/* BALANCE */}
            <Link
              to="/dashboard/balance"
              onClick={onToggleDashboardModal}
              className="flex items-start gap-3 py-3 hover:bg-gray-100 px-2 rounded-md"
            >
              {/* Wallet Icon */}
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5m18 0v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5m18 0H3" />
              </svg>

              <div>
                <p className="font-medium text-gray-800">₹0.00</p>
                <p className="text-xs text-gray-500">Stocks, F&O balance</p>
              </div>
            </Link>

            {/* ALL ORDERS */}
            <Link
              to="/dashboard/all-orders"
              onClick={onToggleDashboardModal}
              className="flex items-center gap-3 py-3 hover:bg-gray-100 px-2 rounded-md"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-gray-800">All Orders</span>
            </Link>

            {/* CUSTOMER SUPPORT */}
            <Link
              to="/dashboard/customer-support"
              onClick={onToggleDashboardModal}
              className="flex items-center gap-3 py-3 hover:bg-gray-100 px-2 rounded-md"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M18 10a6 6 0 1 0-12 0v4a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-4z" />
                <path d="M6 14H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h2" />
                <path d="M18 14h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-2" />
              </svg>
              <span className="text-gray-800">24 × 7 Customer Support</span>
            </Link>

            {/* REPORTS */}
            <Link
              to="/dashboard/reports"
              onClick={onToggleDashboardModal}
              className="flex items-center gap-3 py-3 hover:bg-gray-100 px-2 rounded-md"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h16v16H4z" />
                <path d="M8 12h8M8 16h6M8 8h8" />
              </svg>
              <span className="text-gray-800">Reports</span>
            </Link>

            {/* LOGOUT */}
            <div className="border-t mt-3 pt-3">
              <Link
                to="/dashboard/logout"
                onClick={onToggleDashboardModal}
                className="flex items-center gap-3 py-3 hover:bg-gray-100 px-2 rounded-md text-red-500"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                </svg>

                <span className="font-medium">Log out</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default Dashboard;
