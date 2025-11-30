import { Metadata } from "next";
import DeleteButton from "../components/buttons/DeleteButton";
import Image from "next/image";
import EditButton from "../components/buttons/EditButton";
import { Product } from "@/types";

export const metadata: Metadata = {
  title: "مدیریت محصولات | کرمان آتاری",
  description: "مدیریت و مشاهده لیست محصولات فروشگاه کرمان آتاری.",
};

// ✅ تابع دریافت داده‌ها از API (با URL مطلق)
async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // در پروداکشن مقدار واقعی دامین را در env قرار بده

  const res = await fetch(`${baseUrl}/api/admin/products`, {
    cache: "no-store", // داده‌ها همیشه تازه از سرور
  });

  if (!res.ok) throw new Error("خطا در دریافت محصولات");
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <div className="overflow-x-auto w-full mt-6 px-4">
      <h1 className="text-xl font-bold mb-4 text-gray-800">لیست محصولات</h1>

      <table className="min-w-full border-collapse text-sm text-gray-700 bg-white shadow-md rounded-xl overflow-hidden">
        <thead className="bg-blue-500 text-white text-sm">
          <tr>
            <th className="px-4 py-3 text-right">تصویر</th>
            <th className="px-4 py-3 text-right">نام محصول</th>
            <th className="px-4 py-3 text-center">دسته‌بندی</th>
            <th className="px-4 py-3 text-center">قیمت</th>
            <th className="px-4 py-3 text-center">موجودی</th>
            <th className="px-4 py-3 text-center">عملیات</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((product: Product) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-right">
                  <Image
                    width={200}
                    height={400}
                    src={product.mainImage}
                    alt={product.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                  {product.title}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {product.category?.name || "—"}
                </td>
                <td className="px-4 py-3 text-center font-semibold">
                  {product.price.toLocaleString("fa-IR")} تومان
                </td>
                <td className="px-4 py-3 text-center">
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium">
                      {product.stock}
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">ناموجود</span>
                  )}
                </td>
                <td className="px-4 py-3 flex items-center justify-center gap-3">
                  <EditButton product={product} />
                  <DeleteButton id={product.id} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-center py-6 text-gray-400 font-medium"
              >
                محصولی یافت نشد.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
