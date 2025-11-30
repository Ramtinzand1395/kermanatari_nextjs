"use client";

import { ArrowLeft, MapPin, ShoppingBag } from "lucide-react";
import useCartStore from "@/stores/cartStore";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Address } from "@/types";
// import { Address } from "@prisma/client";

interface PaymentFormProps {
  selectedAddress?: Address | null;
  total: number;
  totalPrice: number;
  totalDiscount: number;
  shippingCost?: number;
}

export default function PaymentForm({
  selectedAddress,
  total,
  totalPrice,
  totalDiscount,
  shippingCost = 0,
}:PaymentFormProps) {
  const { cart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  // ارسال سفارش و انتقال به درگاه پرداخت
  const submitOrder = async () => {
    if (!selectedAddress) return alert("لطفا آدرس را انتخاب کنید");
    if (cart.length === 0) return alert("سبد خرید خالی است");

    setLoading(true);
    try {
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const totalShipping = shippingCost;

      const res = await fetch(`/api/orders?userId=${session?.user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user.id,
          addressId: selectedAddress.id,
          items,
          shippingCost: totalShipping,
          paymentMethod: "online",
        }),
      });

      if (!res.ok) throw new Error("خطا در ثبت سفارش");
      const data = await res.json();
      alert("سفارش با موفقیت ثبت شد!");
      console.log(data);
    } catch (error) {
      console.error(error);
      alert("خطا در ثبت سفارش");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedAddress) {
    return (
      <p className="text-red-500 text-center">
        آدرسی انتخاب نشده است — لطفاً به مرحله قبل برگردید.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl font-bold text-gray-800">تأیید نهایی و پرداخت</h2>

      {/* آدرس انتخاب‌شده */}
      <div className="border p-5 rounded-xl bg-gray-50 flex gap-3 items-start">
        <MapPin className="text-blue-600 w-6 h-6" />

        <div>
          <p className="font-semibold text-gray-700 mb-1">
            {selectedAddress.province} - {selectedAddress.city}
          </p>
          <p className="text-sm text-gray-600">
            {selectedAddress.address}{" "}
            {selectedAddress.plaque && `پلاک ${selectedAddress.plaque}`}{" "}
            {selectedAddress.unit && `واحد ${selectedAddress.unit}`}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            کدپستی: {selectedAddress.postalCode}
          </p>
        </div>
      </div>

      {/* لیست محصولات */}
      <div className="border p-5 rounded-xl bg-white">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-blue-600" />
          محصولات سفارش
        </h3>

        <div className="flex flex-col gap-4">
          {cart.map((item) => (
            <div
              key={item.sku}
              className="flex justify-between items-center border-b pb-3"
            >
              <p className="text-gray-700">{item.title}</p>
              <p className="font-medium">
                {item.quantity} ×{" "}
                {(item.discountPrice ?? item.price).toLocaleString()} تومان
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* جمع کل */}
      <div className="border p-5 rounded-xl bg-white flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">مبلغ کالاها</span>
          <span>{total.toLocaleString()} تومان</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">تخفیف</span>
          <span className="text-green-600">
            {totalDiscount.toLocaleString()} تومان
          </span>
        </div>

        <div className="border-t pt-3 flex justify-between text-lg font-semibold">
          <span>مبلغ قابل پرداخت</span>
          <span>{totalPrice.toLocaleString()} تومان</span>
        </div>
      </div>

      {/* دکمه پرداخت */}
      <button
        onClick={submitOrder}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-white p-3 rounded-lg cursor-pointer flex items-center justify-center gap-2 text-lg"
      >
        {loading ? "در حال پردازش..." : "پرداخت"}
        {!loading && <ArrowLeft className="w-4 h-4" />}
      </button>
    </div>
  );
}
