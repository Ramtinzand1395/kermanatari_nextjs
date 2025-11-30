import { Product } from "@/types";
import Cart from "../components/Cart";
import FilterProducts from "./FilterProducts";
import SortProducts from "./SortProducts";
import Pagination from "./Pagination";

// دریافت محصولات با فیلتر و مرتب‌سازی از URL
// async function getProducts(params: { category?: string; sort?: string; page?: string }) {
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

//   const { category, sort, page } = searchParams;
//   const url = new URL(`${baseUrl}/api/products/all_products`);
//   if (category) url.searchParams.append("category", category);
//   if (sort) url.searchParams.append("sort", sort);
//   if (page) url.searchParams.append("page", page);

//   const res = await fetch(url.toString(), { cache: "no-store" });
//   if (!res.ok) throw new Error("خطا در دریافت محصولات");
//   return res.json();
// }

async function getProducts(params: {
  category?: string;
  sort?: string;
  page?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = new URL(`${baseUrl}/api/products/all_products`);

  if (params.category) url.searchParams.append("category", params.category);
  if (params.sort) url.searchParams.append("sort", params.sort);
  if (params.page) url.searchParams.append("page", params.page);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("خطا در دریافت محصولات");
  return res.json();
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const resolvedParams = await searchParams; // ✅ ابتدا Promise را resolve کن

  const data = await getProducts(resolvedParams);
  const products = data.products;
  const totalPages = Math.ceil(data.total / data.limit);
  const currentPage = data.page;

  return (
    <section className="mx-4 md:mx-10 my-10">
      {/* 🔹 بخش فیلتر و مرتب‌سازی */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <FilterProducts />

        {/* 🔹 بخش اصلی محصولات */}
        <div className="flex-1 w-full">
          {/* مرتب‌سازی بالا */}
          <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
            <SortProducts />
            <span className="text-xs text-gray-500">
              تعداد کالاها: {products?.length || 0}
            </span>
          </div>

          {/* نمایش محصولات */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.length > 0 ? (
              products.map((game: Product) => (
                <Cart key={game.id} game={game} />
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm col-span-full py-10">
                محصولی یافت نشد.
              </p>
            )}
          </div>
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </div>
    </section>
  );
}
