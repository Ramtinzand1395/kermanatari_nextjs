import Order from "./Order";
import OrderTable from "./OrderTable";
async function getOrders() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // در پروداکشن مقدار واقعی دامین را در env قرار بده

  const res = await fetch(`${baseUrl}/api/admin/customer-order`, {
    cache: "no-store", // داده‌ها همیشه تازه از سرور
  });

  if (!res.ok) throw new Error("خطا در دریافت محصولات");
  return res.json();
}
export default async function AcountOrder() {
  const Orders = await getOrders();

  return (
    <div className="m-10">
      <div className="my-3">
        <Order />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2  gap-5 md:gap-2">
        <div className="bg-white shadow-md rounded-lg p-5">
          <OrderTable header={"پلی استیشن 5"} Orders={Orders.ps5} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-5">
          <OrderTable header={"پلی استیشن 4"} Orders={Orders.ps4} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-5">
          <OrderTable header={"کپی خور"} Orders={Orders.copy} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-5">
          <OrderTable header={"Xbox"} Orders={Orders.xbox} />
        </div>
      </div>
    </div>
  );
}
