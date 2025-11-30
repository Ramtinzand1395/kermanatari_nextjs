"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import { Iran } from "provinces-and-cities";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Address } from "@/types";
// import { Address } from "@prisma/client";

interface ShippingFormProps {
  addresses: Address[];
  setAddresses: Dispatch<SetStateAction<Address[]>>;
  form: Partial<Address>; // چون فرم می‌تواند هنوز کامل نباشد
  setForm: Dispatch<SetStateAction<Partial<Address>>>;
  selectedAddress?: Address | null;
  setselectedAddress: Dispatch<SetStateAction<Address | null>>;
  activeStep: number;
}

export default function ShippingForm({
  addresses,
  setAddresses,
  form,
  setForm,
  selectedAddress,
  setselectedAddress,
  activeStep,
}: ShippingFormProps) {
  const [loading, setLoading] = useState(true);

  const getAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users_data/address");
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      toast.error("خطا در دریافت آدرس‌ها");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = "POST";
      const res = await fetch("/api/users_data/address", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("آدرس با موفقیت ذخیره شد");
      setForm({});
      getAddresses();
      setselectedAddress((prev) => {
        const last = addresses[addresses.length - 1];
        return last || null;
      });
    } catch {
      toast.error("خطا در ذخیره آدرس");
    }
  };

  const selectedProvinceCities = form.province
    ? Iran.main.find((p: (typeof Iran.main)[0]) => p.name === form.province)
        ?.cities ?? []
    : [];

  useEffect(() => {
    getAddresses();
  }, []);
  const router = useRouter();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">آدرس‌های من</h1>

      {/* فرم اضافه/ویرایش */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 mb-10 border border-gray-200"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
          <div className="flex flex-col">
            <label htmlFor="province" className="text-gray-700 text-sm mb-1">
              استان
            </label>
            <select
              id="province"
              value={form.province || ""}
              onChange={(e) =>
                setForm({ ...form, province: e.target.value, city: "" })
              }
              className="border-gray-300 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition w-full"
              required
            >
              <option value="">انتخاب استان</option>
              {Iran.main.map(
                (p: { id: number; name: string; cities: string[] }) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="city" className="text-gray-700 text-sm mb-1">
              شهر
            </label>
            <select
              id="city"
              value={form.city || ""}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="border-gray-300 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition w-full"
              required
              disabled={!form.province}
            >
              <option value="">انتخاب شهر</option>
              {selectedProvinceCities.map((city: string) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col mb-5">
          <label htmlFor="address" className="text-gray-700 text-sm mb-1">
            آدرس
          </label>
          <input
            id="address"
            type="text"
            placeholder="مثال: خیابان ولیعصر، پلاک 10"
            value={form.address || ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="border-gray-300 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition w-full"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col">
            <label htmlFor="plaque" className="text-gray-700 text-sm mb-1">
              پلاک
            </label>
            <input
              id="plaque"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{1,5}"
              placeholder="مثال: 10"
              value={form.plaque || ""}
              onChange={(e) => setForm({ ...form, plaque: e.target.value })}
              className="border-gray-300 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="unit" className="text-gray-700 text-sm mb-1">
              واحد
            </label>
            <input
              id="unit"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{1,5}"
              placeholder="مثال: 2"
              value={form.unit || ""}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="border-gray-300 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="postalCode" className="text-gray-700 text-sm mb-1">
              کدپستی
            </label>
            <input
              id="postalCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{10}"
              placeholder="مثال: 1234567890"
              value={form.postalCode || ""}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              className="border-gray-300 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition"
          >
            افزودن آدرس
          </button>
        </div>
      </form>

      {/* لیست آدرس‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-6 bg-gray-50 shadow animate-pulse"
              >
                <Skeleton height={20} width={`50%`} className="mb-3" />
                <Skeleton height={16} width={`80%`} className="mb-2" />
                <Skeleton height={16} width={`70%`} />
              </div>
            ))
        ) : addresses.length > 0 ? (
          addresses.map((a) => (
            <div
              key={a.id}
              onClick={() => setselectedAddress(a)}
              className={`bg-white border rounded-xl p-6 shadow-md transition cursor-pointer
    ${
      selectedAddress?.id === a.id
        ? "border-blue-500 shadow-lg"
        : "border-gray-200"
    }
  `}
            >
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {a.province} - {a.city}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                {a.address} {a.plaque && `پلاک: ${a.plaque}`}{" "}
                {a.unit && `واحد: ${a.unit}`}
              </p>
              <p className="text-xs text-gray-400 mb-3">
                کدپستی: {a.postalCode}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 col-span-2 py-10">
            هیچ آدرسی ثبت نشده
          </div>
        )}
      </div>
      {activeStep === 2 && selectedAddress && (
        <button
          onClick={() => router.push("/cart?step=3", { scroll: false })}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
        >
          ادامه
          <ArrowLeft className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
