"use client";

import { User } from "@/types";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/users_data/users");
        if (!res.ok) throw new Error("خطا در دریافت کاربران");

        const data = (await res.json()) as User[]; // 🔹 اینجا نوع مشخص شد
        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("خطا در دریافت اطلاعات");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-4">لیست کاربران</h1>

      {/* خطا */}
      {error && (
        <div className="text-red-700 bg-red-100 p-3 mb-4 rounded-md shadow-sm">
          {error}
        </div>
      )}

      {/* لودینگ */}
      {loading ? (
        <div>
          <Skeleton height={35} count={5} className="mb-2 rounded" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm text-gray-700 rounded-lg">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-2 border">نام</th>
                <th className="p-2 border">نام خانوادگی</th>
                <th className="p-2 border">ایمیل</th>
                <th className="p-2 border">موبایل</th>
                <th className="p-2 border">نقش</th>
                <th className="p-2 border">تاریخ ایجاد</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`text-center ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.lastName}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.mobile}</td>
                  <td className="p-2 border text-blue-600 font-medium">
                    {user.role}
                  </td>
                  <td className="p-2 border">
                    {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
