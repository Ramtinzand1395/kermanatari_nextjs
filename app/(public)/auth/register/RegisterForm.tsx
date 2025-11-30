"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    newsletter: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "radio" ? value === "true" : value, // تبدیل رشته به boolean
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.lastName ||
      !form.email ||
      !form.mobile ||
      !form.password
    ) {
      toast.error("لطفاً همه فیلدها را تکمیل کنید");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("رمز عبور و تکرار آن یکسان نیست");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "خطا در ثبت‌نام");
      }

      toast.success("ثبت‌نام با موفقیت انجام شد 🎉");
      setForm({
        name: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        newsletter: true,
      });
      router.push("/auth/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("مشکلی پیش آمده است");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold text-center mb-3">ایجاد حساب کاربری</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full bg-white p-6 rounded-2xl"
      >
        <p className="text-start text-gray-600 mb-4">اطلاعات شخصی</p>

        {/* اطلاعات شخصی */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            name="name"
            type="text"
            placeholder="نام"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-right focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="lastName"
            type="text"
            placeholder="نام خانوادگی"
            value={form.lastName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-right"
          />

          <input
            name="email"
            type="email"
            placeholder="ایمیل"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-right"
          />

          <input
            name="mobile"
            type="tel"
            placeholder="شماره موبایل"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-right"
          />
        </div>

        {/* رمز عبور */}
        <p className="text-start text-gray-600 my-4">رمز عبور</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            name="password"
            type="password"
            placeholder="رمز عبور"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-right"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="تکرار رمز عبور"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-right"
          />
        </div>

        {/* خبرنامه */}
        <div className="flex items-center gap-4 mt-4">
          <span className="text-gray-700">عضویت در خبرنامه:</span>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="newsletter"
              value="true"
              checked={form.newsletter === true}
              onChange={handleChange}
            />
            <span>بله</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="newsletter"
              value="بشمسث"
              checked={form.newsletter === false}
              onChange={handleChange}
            />
            <span>خیر</span>
          </label>
        </div>

        {/* دکمه ثبت */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl mt-6 text-lg font-semibold transition"
        >
          {loading ? "در حال ثبت..." : "ثبت نام"}
        </button>
      </form>
    </div>
  );
}
