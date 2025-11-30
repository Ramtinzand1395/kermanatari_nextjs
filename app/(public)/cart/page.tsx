"use client";

import useCartStore from "@/stores/cartStore";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ShippingForm from "./ShippingForm";
import PaymentForm from "./PaymentForm";
import StepperCart from "./Stepper";
import CartData from "./CartData";
import { Address } from "@/types";
// interface Address {
//   id: number;
//   province: string;
//   city: string;
//   address: string;
//   plaque?: string;
//   unit?: string;
//   postalCode: string;
// }
export default function CartPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState({});
  const [selectedAddress, setselectedAddress] = useState<Address | null>(null);

  const activeStep = parseInt(searchParams.get("step") || "1");
  const { cart, removeFromCart } = useCartStore();

  // محاسبه مبلغ کل و تخفیف
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const totalPrice = cart.reduce(
    (acc, item) => acc + (item.discountPrice ?? item.price) * item.quantity,
    0
  );

  const totalDiscount = cart.reduce(
    (acc, item) =>
      acc + (item.price - (item.discountPrice ?? item.price)) * item.quantity,
    0
  );

  return (
    <div className="flex flex-col gap-8 mx-0 md:container md:mx-auto mt-12 min-h-[50vh]">
      {/* مراحل خرید */}
      <StepperCart activeStep={activeStep} />

      {/* محتویات سبد خرید و فرم‌ها */}
      <div className="w-full flex flex-col lg:flex-row gap-16 ">
        {/* سبد خرید */}
        <div className="w-full lg:w-9/12 shadow-lg border border-gray-100 p-8 rounded-lg flex flex-col gap-8 bg-white">
          {activeStep === 1 ? (
            <CartData cart={cart} removeFromCart={removeFromCart} />
          ) : activeStep === 2 ? (
            <ShippingForm
              addresses={addresses}
              setAddresses={setAddresses}
              form={form}
              setForm={setForm}
              selectedAddress={selectedAddress}
              setselectedAddress={setselectedAddress}
              activeStep={activeStep}
            />
          ) : activeStep === 3 ? (
            <PaymentForm
              selectedAddress={selectedAddress}
              total={total}
              totalPrice={totalPrice}
              totalDiscount={totalDiscount}
            />
          ) : (
            <p className="text-sm text-gray-500">
              لطفا فرم آدرس را پر کنید تا ادامه دهید.
            </p>
          )}
        </div>

        {/* خلاصه سبد خرید */}
        <div className="w-full lg:w-3/12 shadow-lg border border-gray-100 p-8 rounded-lg flex flex-col gap-8 h-max sticky top-15 bg-white">
          <h2 className="font-semibold">خلاصه سبد خرید</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">مبلغ کالاها</p>
              <p className="font-medium">{total.toLocaleString()} تومان</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">تخفیف کل</p>
              <p className="font-medium">
                {totalDiscount.toLocaleString()} تومان
              </p>
            </div>

            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <p className="text-gray-800 font-semibold">مجموع</p>
              <p className="font-medium">{totalPrice.toLocaleString()} تومان</p>
            </div>
          </div>

          {activeStep === 1 && (
            <button
              onClick={() => router.push("/cart?step=2", { scroll: false })}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
            >
              ادامه
              <ArrowLeft className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
