import Image from "next/image";
import { Trash2 } from "lucide-react";
import { CartItem } from "@/types";

interface CartDataProps {
  cart: CartItem[];
  removeFromCart: (item: CartItem) => void;
}

export default function CartData({ cart, removeFromCart }: CartDataProps) {
  return cart.map((item) => (
    <div className="flex items-center justify-between" key={item.sku}>
      {/* تصویر و جزئیات */}
      <div className="flex gap-8">
        <div className="relative w-32 h-12 bg-gray-50 rounded-lg overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-contain"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-gray-500">تعداد: {item.quantity}</p>
          </div>
        </div>
      </div>

      {/* قیمت + حذف */}
      <div className="flex items-end gap-2">
        {item.discountPrice === null ? (
          <span>{item.price.toLocaleString()} تومان</span>
        ) : (
          <div className="flex items-end">
            <span className="line-through ml-4 text-gray-400 text-sm">
              {item.price.toLocaleString()}
            </span>
            <span className="font-semibold text-black">
              {item.discountPrice.toLocaleString()} تومان
            </span>
          </div>
        )}

        <button
          title="removeFromCart"
          onClick={() => removeFromCart(item)}
          className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition-all duration-300 text-red-400 flex items-center justify-center cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  ));
}
