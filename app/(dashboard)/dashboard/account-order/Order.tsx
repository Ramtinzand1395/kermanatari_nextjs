"use client";

import Link from "next/link";
import { useState } from "react";
import AddOrderModal from "./(modals)/AddOrderModal";

export default function Order() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [OpenAddItem, setOpenAddItem] = useState(false);

  const handleOpenModal = () => {
    setOpenAddItem(!OpenAddItem);
  };
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="inline-flex justify-center w-full rounded-xl border-2 border-gray-700 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-300"
      >
        عملیات سفارش
        <svg
          className="-mr-1 ml-2 h-5 w-5 transition-transform duration-300"
          style={{
            transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div
          className="origin-top-left absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 
                     animate-dropdown-open"
        >
          <div className="py-1 flex flex-col">
            <button
              onClick={() => {
                handleOpenModal();
                setDropdownOpen(false);
              }}
              className="text-gray-700 hover:bg-blue-100 block px-4 py-2 text-sm text-right transition duration-200"
            >
              ثبت سفارش جدید
            </button>

            <Link
              href={"/dashboard/account-order/game-list"}
              className="text-gray-700 hover:bg-blue-100 block px-4 py-2 text-sm text-right transition duration-200"
            >
              همه بازی ها
            </Link>
            <Link
              href={"/dashboard/all-customer-orders/table"}
              className="text-gray-700 hover:bg-blue-100 block px-4 py-2 text-sm text-right transition duration-200"
            >
              همه سفارش‌ها
            </Link>
          </div>
        </div>
      )}
        {OpenAddItem && (
          <AddOrderModal
            OpenAddItem={OpenAddItem}
            setOpenAddItem={setOpenAddItem}
          />
        )}
    </div>
  );
}
