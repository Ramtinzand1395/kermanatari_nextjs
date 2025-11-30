"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [mobile, setmobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async  (e: React.FormEvent<HTMLFormElement>)  => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      mobile,
      password,
    });

    if (result?.error) setError("شماره موبایل یا رمز اشتباه است");
    else window.location.href = "/";
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-100">
        {/* IMAGE */}
        <div className="flex justify-center">
          <Image
            src="/Hero1.png"
            alt="Login"
            width={350}
            height={200}
            className="rounded-xl object-cover"
          />
        </div>

        {/* INPUTS */}
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="text-center bg-red-300 py-4 mb-6 rounded">{error}</p>
          )}
          <div className="flex flex-col gap-4">
            {/* PHONE INPUT */}
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="شماره موبایل"
              onChange={(e) => setmobile(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-right
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />

            {/* PASSWORD INPUT */}
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="رمز عبور"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-right
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium shadow-md"
            >
              ورود
            </button>

            <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition font-medium">
              ورود با پیامک
            </button>
          </div>
        </form>

        {/* SIGNUP */}
        <div className="text-center text-gray-600 mt-4">
          حساب کاربری ندارید؟{" "}
          <Link href={"/auth/register"}>
            <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
              ثبت‌ نام کنید
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
