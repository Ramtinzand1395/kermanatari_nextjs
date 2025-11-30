"use client";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  total: number;
  product: { title: string; mainImage: string };
}

interface Address {
  city: string;
  address: string;
  plaque?: string;
  unit?: string;
  postalCode: string;
}

interface User {
  name: string;
  lastName: string;
  email: string;
}

interface Order {
  id: number;
  user: User | null;
  items: OrderItem[];
  totalPrice: number;
  finalPrice: number;
  status: string;
  paymentStatus: string; // اضافه شده
  address: Address | null;
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?page=${page}&limit=${limit}`);
      const data = await res.json();
      setOrders(data.orders);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 font-sans text-sm">
      <h1 className="text-lg font-bold mb-4">مدیریت سفارش‌ها</h1>

      {loading
        ? Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="border rounded-md p-3 mb-3 shadow-sm animate-pulse"
            >
              <Skeleton height={15} width={150} className="mb-2" />
              <Skeleton height={12} width={100} className="mb-1" />
              <Skeleton height={12} width={120} />
            </div>
          ))
        : orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-md p-4 mb-4 shadow-sm bg-white"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                <div className="flex flex-col md:flex-row md:gap-4 text-gray-700">
                  <div>
                    <span className="font-semibold">کاربر:</span>{" "}
                    {order.user
                      ? `${order.user.name} ${order.user.lastName}`
                      : "ناشناخته"}
                  </div>
                  <div>
                    <span className="font-semibold">ایمیل:</span>{" "}
                    {order.user?.email || "-"}
                  </div>
                  <div>
                    <span className="font-semibold">وضعیت پرداخت:</span>{" "}
                    <span
                      className={
                        order.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {order.paymentStatus === "paid"
                        ? "پرداخت شده"
                        : "پرداخت نشده"}
                    </span>
                  </div>
                </div>

                <select
                  title="status"
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="border px-2 py-1 rounded bg-gray-50"
                >
                  <option value="pending">در انتظار</option>
                  <option value="processing">در حال پردازش</option>
                  <option value="shipped">ارسال شده</option>
                  <option value="completed">تکمیل شده</option>
                  <option value="cancelled">لغو شده</option>
                </select>
              </div>

              <div className="text-gray-600 mb-2">
                <span className="font-semibold">آدرس:</span>{" "}
                {order.address
                  ? `${order.address.city} - ${order.address.address}`
                  : "ندارد"}
              </div>

              <div className="mb-2">
                <span className="font-semibold">آیتم‌ها:</span>
                <ul className="ml-4 list-disc">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product.title} - تعداد: {item.quantity} - قیمت:{" "}
                      {item.price.toLocaleString()} تومان
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-gray-800 font-semibold">
                جمع کل: {order.totalPrice.toLocaleString()} تومان
              </div>
            </div>
          ))}

      {/* Pagination */}
      <div className="mt-4 flex justify-center items-center gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="border px-3 py-1 rounded disabled:opacity-50 hover:bg-gray-100 transition"
        >
          قبلی
        </button>
        <span>
          صفحه {page} از {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="border px-3 py-1 rounded disabled:opacity-50 hover:bg-gray-100 transition"
        >
          بعدی
        </button>
      </div>
    </div>
  );
}
