// "use client";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import UserInfoModal from "./(modals)/UserInfoModal";
// import { CustomerOrder } from "@/types";

// interface OrderTableProps {
//   header: string;
//   Orders: CustomerOrder[];
// }

// const OrderTable: React.FC<OrderTableProps> = ({ header, Orders }) => {
//   const [openModal, setOpenModal] = useState<boolean>(false);
//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
//   const [LoadindSMS, setLoadindSMS] = useState(false);
//   const handleOpenModal = (orderId: string) => {
//     const order = Orders.find((o) => o.id === orderId);
//     if (!order) return;
//     setSelectedOrderId(order);
//     setOpenModal(true);
//   };
//   const changeOrderStatus = async (orderId: string, status: string) => {
//     const url = `/api/admin/customer-order/changestatus/${orderId}`;

//     const res = await fetch(url, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ status, sendSms: true }),
//     });

//     if (!res.ok) {
//       const error = await res.json().catch(() => null);
//       throw new Error(error?.message || "خطا در آپدیت سفارش");
//     }

//     return await res.json();
//   };

//   const statusOrder = ["دریافت از مشتری", "آماده", "تحویل به مشتری"];

//   const changeStatus = async (
//     orderId: string,
//     newStatus: CustomerOrder["deliveryStatus"]
//   ) => {
//     const order = Orders.find((o) => o.id === orderId);
//     if (!order) return;

//     const currentIndex = statusOrder.indexOf(order.deliveryStatus);
//     const newIndex = statusOrder.indexOf(newStatus);

//     if (newIndex <= currentIndex) {
//       toast.warning("امکان بازگشت یا تکرار وضعیت وجود ندارد.");
//       return;
//     }

//     const confirmChange = window.confirm(
//       `آیا از تغییر وضعیت به "${newStatus}" مطمئن هستید؟`
//     );
//     if (!confirmChange) return;

//     setLoadindSMS(true);
//     try {
//       // 👇 اجرای fetch
//       const response = await changeOrderStatus(orderId, newStatus);

//       toast.success(response.message);

//       if (response.sms?.status === 200) {
//         toast.success(`پیامک با موفقیت ارسال شد: ${response.sms.body}`);
//       } else {
//         toast.error(`خطا در ارسال پیام: ${response.sms?.body}`);
//       }
//     } catch (err) {
//       console.error("Error updating status:", err);
//       toast.error("خطا در تغییر وضعیت سفارش");
//     } finally {
//       setLoadindSMS(false);
//     }
//   };

//   return (
//     <>
//       <h2 className="md:text-xl text-sm font-bold">{header}</h2>
//       <div className="overflow-x-auto ">
//         <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-5 border-separate border-spacing-y-2">
//           <thead className="text-white  bg-blue-500">
//             <tr>
//               <th className="text-start text-sm px-2 py-2 whitespace-nowrap">
//                 نام خانوادگی
//               </th>
//               <th className="text-center text-sm w-full px-2  py-2 whitespace-nowrap">
//                 وضعیت
//               </th>
//               <th className="text-start text-sm px-2 py-2 whitespace-nowrap">
//                 کد دریافت
//               </th>
//               <th className="text-center text-sm px-2 py-2 whitespace-nowrap">
//                 توضیحات
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {Orders ? (
//               Orders.map((order) => (
//                 <tr className="" key={order.id}>
//                   <td className="text-center text-black py-3 ">
//                     <p
//                       onClick={() => handleOpenModal(order.id)}
//                       className="cursor-pointer hover:text-blue-500 transition duration-300"
//                     >
//                       {typeof order.customer === "string"
//                         ? order?.customer
//                         : order?.customer?.lastName}
//                     </p>
//                     {openModal && (
//                       <UserInfoModal
//                         setOpenModal={setOpenModal}
//                         OpenModal={openModal}
//                         order={order}
//                       />
//                     )}
//                   </td>
//                   <td className="flex flex-row items-center justify-around py-3 gap-2 ">
//                     {["دریافت از مشتری", "آماده", "تحویل به مشتری"].map(
//                       (status) => (
//                         <div
//                           className="flex items-start space-x-2"
//                           key={status}
//                         >
//                           <label className="group flex items-center cursor-pointer">
//                             <input
//                               type="checkbox"
//                               checked={order.deliveryStatus === status}
//                               onChange={() =>
//                                 changeStatus(
//                                   order.id,
//                                   status as customerOrder["deliveryStatus"]
//                                 )
//                               }
//                               className="hidden peer"
//                             />
//                             <span
//                               className={`relative w-6 h-6 flex justify-center items-center border-2 rounded-md shadow-md transition-all duration-500
//                             ${
//                               order.deliveryStatus === status
//                                 ? status === "دریافت از مشتری"
//                                   ? "bg-orange-500 border-orange-500"
//                                   : status === "آماده"
//                                   ? "bg-blue-500 border-blue-500"
//                                   : "bg-green-500 border-green-500"
//                                 : "bg-gray-100 border-gray-400"
//                             }`}
//                             >
//                               {order.deliveryStatus === status && (
//                                 <svg
//                                   fill="currentColor"
//                                   viewBox="0 0 20 20"
//                                   className="w-5 h-5 text-white"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                 >
//                                   <path
//                                     fillRule="evenodd"
//                                     d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
//                                     clipRule="evenodd"
//                                   />
//                                 </svg>
//                               )}
//                             </span>
//                             <span
//                               className={`mx-1 text-xs font-medium whitespace-nowrap text-gray-700  transition-colors duration-300
//                             ${
//                               status === "دریافت از مشتری"
//                                 ? "group-hover:text-orange-500"
//                                 : status === "آماده"
//                                 ? "group-hover:text-blue-500"
//                                 : "group-hover:text-green-500"
//                             }`}
//                             >
//                               {status}
//                             </span>
//                           </label>
//                         </div>
//                       )
//                     )}
//                   </td>
//                   <td className="text-center text-black py-3 ">
//                     {order.deliveryCode}
//                   </td>
//                   <td className="text-start text-black py-3 text-xs">
//                     {order.description.length > 10
//                       ? `${order.description.slice(0, 20)}...`
//                       : order.description}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={2} className="text-center py-5 text-gray-400">
//                   سفارشی یافت نشد.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default OrderTable;

export default function OrderTable() {
  return <div className=""></div>;
}
