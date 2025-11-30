"use client";

import { useEffect, useState } from "react";
import { Favorite, Product } from "@/types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import Image from "next/image";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getFavorites = async () => {
    try {
      const res = await fetch("/api/users_data/favorites", { method: "GET" });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err?.error || "خطا در دریافت علاقه‌مندی‌ها");
        return;
      }
      const data = await res.json();
      const products = data.map((fav: Favorite) => fav.product);
      setFavorites(products);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت علاقه‌مندی‌ها");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId: number) => {
    try {
      const res = await fetch("/api/users_data/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err?.error || "خطا در حذف محصول");
        return;
      }

      setFavorites((prev) => prev.filter((p) => p.id !== productId));
      toast.info("محصول از علاقه‌مندی‌ها حذف شد");
    } catch (err) {
      console.error(err);
      toast.error("خطا در حذف محصول");
    }
  };

  useEffect(() => {
    getFavorites();
  }, []);

  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {loading ? (
        Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border rounded-lg p-2 bg-white">
              <Skeleton height={128} className="mb-2" />
              <Skeleton height={16} width={`80%`} className="mb-1" />
              <Skeleton height={14} width={`60%`} />
              <Skeleton height={24} width={`30%`} className="mt-2" />
            </div>
          ))
      ) : favorites.length === 0 ? (
        <div className="col-span-full text-center p-8 text-gray-500">
          هیچ محصولی در علاقه‌مندی‌ها وجود ندارد.
        </div>
      ) : (
        favorites.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-2 hover:shadow-lg transition relative bg-white flex flex-col"
          >
            <Image
              width={50}
              height={50}
              src={product.mainImage}
              alt={product.title}
              className="w-full h-32 sm:h-40 object-contain mb-2"
            />
            <h3 className="text-xs sm:text-sm font-semibold line-clamp-2">
              {product.title}
            </h3>
            <p className="text-gray-700 text-xs sm:text-sm mt-1">
              {product.price.toLocaleString()} تومان
            </p>
            <button
              onClick={() => removeFavorite(product.id)}
              className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition"
            >
              حذف
            </button>
          </div>
        ))
      )}
    </div>
  );
}
