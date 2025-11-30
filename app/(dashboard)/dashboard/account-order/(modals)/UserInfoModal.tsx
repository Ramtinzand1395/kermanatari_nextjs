"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import jsPDF from "jspdf";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import GameDropdownEdite from "./GameDropdownEdite";
import vazirFontBase64 from "@/lib/base copy";
import LogoBase64 from "@/lib/LogoBase64";
import { TimerIcon, X } from "lucide-react";
import {
  customerSchema,
  orderSchema,
} from "@/validations/CustomerAppValidation";
import { Customer, CustomerOrder } from "@/types";

interface Props {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  order: CustomerOrder | null;
}

export default function UserInfoModal({ setOpenModal, order }: Props) {
  const [userOrder, setUserOrder] = useState<CustomerOrder | null>(order);
  const [customer, setCustomer] = useState<Customer | null>(
    order?.customer ?? null
  );
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [saving, setsaving] = useState(false);

  const closeModal = () => {
    setOpenModal(false);
  };

  //! pdf

  const isEnglish = (text: string) => /[a-zA-Z]/.test(text);

  const generatePDF = () => {
    const fontSize = 12; // pt
    const lineHeight = 6; // mm
    const padding = 4;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 297], // پرینتر حرارتی: عرض 80mm، طول A4
    });

    // افزودن فونت فارسی
    doc.addFileToVFS("BNAZANB.ttf", vazirFontBase64);
    doc.addFont("BNAZANB.ttf", "BNAZANB", "normal");
    doc.setFont("BNAZANB");
    doc.setFontSize(fontSize);

    // doc.addImage(BorderBase64, 'PNG', 0, 0, 80, 90);
    doc.addImage(LogoBase64, "PNG", 30, 2, 10, 10);

    let currentY = padding; // شروع نوشتن متن بعد از لوگو (30 بالا + 20 ارتفاع + 10 فاصله)

    // آرایه‌ای از خطوط با جهت چینش مشخص
    const lines: { text: string; align: "right" | "left" }[] = [];

    lines.push({ text: "اطلاعات کاربر", align: "right" });
    if (customer) {
      lines.push({
        text: `نام خانوادگی: ${customer.lastName || ""}`,
        align: "right",
      });
      lines.push({ text: `موبایل: ${customer.mobile || ""}`, align: "right" });
    }
    lines.push({ text: "===========================", align: "right" });
    lines.push({ text: "اطلاعات سفارش", align: "right" });
    if (userOrder) {
      lines.push({
        text: `تاریخ: ${userOrder.persianDate || ""}`,
        align: "right",
      });
      lines.push({
        text: `قیمت: ${userOrder.price?.toLocaleString() || ""} تومان`,
        align: "right",
      });
      lines.push({ text: "===========================", align: "right" });

      if (userOrder.list?.length) {
        lines.push({ text: "لیست بازی‌ها:", align: "right" });

        userOrder.list.forEach((game) => {
          lines.push({ text: game, align: "left" });
        });
      }
      lines.push({ text: "===========================", align: "right" });
      lines.push({
        text: `توضیحات: ${userOrder.description || ""}`,
        align: "right",
      });
    }

    // رسم خطوط در PDF
    lines.forEach(({ text, align }) => {
      const font = isEnglish(text) ? "Helvetica" : "BNAZANB";
      doc.setFont(font, "normal");

      doc.text(text, align === "right" ? 75 : 5, currentY, { align });
      currentY += lineHeight;
    });

    // خروجی Blob برای پرینت یا دانلود
    const pdfBlob = doc.output("blob");
    return pdfBlob;
  };

  const sendPdfToBackend = async () => {
    try {
      const pdfBlob = generatePDF(); // واقعی PDF هست
      const formData = new FormData();
      formData.append("file", pdfBlob, "ticket.pdf");

      const res = await fetch("/api/print", {
        method: "POST",
        body: formData,
      });

      if (res.status === 200) {
        toast.success("فایل برای چاپ ارسال شد.");
      } else {
        toast.error("خطا در ارسال فایل.");
      }
    } catch (err) {
      console.error(err);
      toast.error("ارسال با خطا مواجه شد.");
    }
  };

  const handleCustomerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: keyof Customer // changed from keyof Customer to keyof customerOrder
  ) => {
    setCustomer((prev) => (prev ? { ...prev, [field]: e.target.value } : prev));
  };
  const handleOrderChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: keyof CustomerOrder // changed from keyof Customer to keyof customerOrder
  ) => {
    setUserOrder((prev) =>
      prev ? { ...prev, [field]: e.target.value } : prev
    );
  };

  const handleSaveCustomer = async (userId: string) => {
    try {
      if (customer && userId) {
        await customerSchema.validate(customer, { abortEarly: false });
        const url = `/api/admin/customer`;

        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customer),
        });

        if (!res.ok) {
          const error = await res.json().catch(() => null);
          throw new Error(error?.message || "خطا در آپدیت سفارش");
        }

        toast.success("با موفقیت تغییر کرد.");
        setIsEditingCustomer(false);
        return await res.json();
      }
    } catch (err: unknown) {
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((validationError) => {
          if (validationError.message) {
            toast.error(validationError.message);
          }
        });
      } else {
        console.error(err);
        toast.error("خطا در ذخیره اطلاعات کاربر.");
      }
    } finally {
      setsaving(false);
      setIsEditingOrder(false);
    }
  };

  const handleSaveOrder = async () => {
    setsaving(true);
    try {
      if (!userOrder) return;

      await orderSchema.validate(userOrder, { abortEarly: false });

      const url = `/api/admin/customer-order/${userOrder.id}`;

      const dataToSend = {
        ...userOrder,
        price: Number(userOrder.price),
      };
      // TODO
      // delete dataToSend.customer;

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("خطا در آپدیت سفارش");

      const data = await res.json();
      toast.success(data.message);
      setOpenModal(false);
      setIsEditingOrder(false);
    } catch (err) {
      console.log(err);
      toast.error("خطا در آپدیت سفارش");
    } finally {
      setsaving(false);
    }
  };

  // !New
  const HandleDeleteOrder = async () => {
    if (!userOrder) return;

    const confirmDelete = window.confirm("آیا از حذف سفارش مطمئنی؟");
    if (!confirmDelete) return;
    try {
      // const { data, status } = await deleteOrder(orderId);
      const res = await fetch(`/api/customer-order/${userOrder.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status === 200) {
        toast.success(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const HandleNoSms = async () => {
    if (!customer?.id || !userOrder) return;
    const confirmNoSms = window.confirm(
      "آیا از انجام عملیات بدون پیام مطمئنی؟"
    );

    if (!confirmNoSms) return;
    try {
      const res = await fetch(
        `/api/customer-order/changestatus/${userOrder.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "تحویل به مشتری",
            sendSms: false, // 👈 پیامک ارسال نشه
          }),
        }
      );
      const data = await res.json();

      if (res.status === 200) {
        toast.success(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fieldLabels = {
    name: "نام",
    lastName: "نام خانوادگی",
    mobile: "شماره تماس",
    sex: "جنسیت",
    birthday: "تاریخ تولد",
    description: "توضیحات ",
  };
  // if (!OpenModal || !order || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
      ></div>

      <div className="relative z-50 md:w-[70vw] w-[90vw] bg-white rounded-2xl shadow-xl animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button
          title="close"
          onClick={closeModal}
          className="absolute top-4 right-4 text-white hover:text-red-500 transition"
        >
          {/* <FaTimes size={18} /> */}
          <TimerIcon size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center justify-around bg-blue-500 text-white p-4 rounded-t-2xl">
          <h2 className="text-xs md:text-xl font-bold mb-4">
            اطلاعات سفارش {customer?.lastName || "نام کاربر"}
          </h2>
          <div>
            <label className="block text-sm font-medium">تاریخ</label>
            <p className="mt-1">{userOrder?.persianDate || "تاریخ"}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Customer Info */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-b-2 pb-4 mb-4">
            {[
              "name",
              "lastName",
              "mobile",
              "sex",
              "birthday",
              "description",
            ].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-600">
                  {fieldLabels[field as keyof typeof fieldLabels] || ""}
                </label>
                {isEditingCustomer ? (
                  field === "sex" ? (
                    <select
                      title="edit"
                      value={customer?.[field] || ""}
                      onChange={(e) =>
                        handleCustomerChange(e, field as keyof Customer)
                      }
                      className="border p-1 rounded-md w-full"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="مرد">مرد</option>
                      <option value="زن">زن</option>
                    </select>
                  ) : field === "birthday" ? (
                    <DatePicker
                      calendarPosition="bottom-left"
                      containerStyle={{ width: "100%" }}
                      style={{ minWidth: "150px" }}
                      calendar={persian}
                      locale={persian_fa}
                      value={customer?.birthday}
                      onChange={(date) =>
                        setCustomer((prev) => {
                          if (!prev) return null;
                          return { ...prev, birthday: date?.toString() ?? "" };
                        })
                      }
                    />
                  ) : field === "description" ? (
                    <textarea
                      title="edit"
                      value={customer?.description || ""}
                      onChange={(e) => handleCustomerChange(e, "description")}
                      className="border p-1 rounded-md w-full"
                    />
                  ) : (
                    <input
                      title="edit"
                      type="text"
                      // value={customer[field as keyof Customer] || ""}
                      value={customer?.name || ""}
                      onChange={(e) =>
                        handleCustomerChange(e, field as keyof Customer)
                      }
                      className="border p-1 rounded-md w-full"
                    />
                  )
                ) : (
                  <p className="mt-1">
                    {/* {customer[field as keyof Customer] || "---"} */}
                    {(() => {
                      const value = customer?.[field as keyof Customer];
                      if (Array.isArray(value)) {
                        return value.map((item, index) => (
                          <div key={index}>{item.id}</div>
                        ));
                        // یا هر فیلدی که می‌خواهید نمایش دهید
                      }
                      return value ?? "---";
                    })()}
                  </p>
                )}
              </div>
            ))}

            <div className="col-span-2 lg:col-span-4 text-left mt-2 flex gap-4">
              <button
                onClick={() => {
                  setIsEditingCustomer(!isEditingCustomer);
                  if (isEditingCustomer) {
                    // resetData();
                  }
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                {isEditingCustomer ? "لغو ویرایش" : "ویرایش اطلاعات کاربر"}
              </button>
              {isEditingCustomer && (
                <button
                  onClick={() =>
                    handleSaveCustomer((userOrder?.customer as Customer).id.toString())
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                >
                  ذخیره
                </button>
              )}
            </div>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                دستگاه
              </label>
              {isEditingOrder ? (
                <select
                  title="edit"
                  value={userOrder?.consoleType || ""}
                  onChange={(e) => handleOrderChange(e, "consoleType")}
                  className="border p-1 rounded-md w-full"
                >
                  <option value="">انتخاب کنید</option>
                  <option value="ps4">PS4</option>
                  <option value="ps5">PS5</option>
                  <option value="copy">کپی خور</option>
                  <option value="Xbox">xbox</option>
                </select>
              ) : (
                <p className="mt-1">{userOrder?.consoleType || "نامشخص"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                قیمت
              </label>
              {isEditingOrder ? (
                <input
                  title="edit"
                  type="number"
                  value={userOrder?.price || 0}
                  onChange={(e) => handleOrderChange(e, "price")}
                  className="border p-1 rounded-md w-full"
                />
              ) : (
                <p className="mt-1">
                  {userOrder?.price?.toLocaleString() || "۰"} تومان
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                توضیحات
              </label>
              <textarea
                title="edit"
                className="w-full border rounded-md p-2 text-sm text-gray-700"
                rows={3}
                readOnly={!isEditingOrder}
                value={userOrder?.description}
                onChange={(e) => handleOrderChange(e, "description")}
              />
            </div>
          </div>

          {/* Games List */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              لیست بازی‌ها
            </label>
            <GameDropdownEdite
              userOrder={userOrder}
              setUserOrder={setUserOrder}
            />
            <div className="mt-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {userOrder?.list?.length ? (
                userOrder?.list.map((game, index) => (
                  <div
                    className="flex items-center border-2 p-2 rounded-2xl text-black shadow-md my-3"
                    key={index}
                  >
                    <button
                      onClick={() => {
                        setUserOrder((prev) =>
                          prev
                            ? {
                                ...prev,
                                list: prev.list.filter((_, i) => i !== index),
                              }
                            : prev
                        );
                      }}
                      className="text-red-500 hover:text-red-700 ml-2"
                      title="حذف بازی"
                    >
                      {/* <MdClose size={20} /> */}
                      <X />
                    </button>
                    <span key={index} className="block ">
                      {game}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-gray-400">لیست بازی‌ها خالی است</span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <button
              onClick={() => {
                setIsEditingOrder(!isEditingOrder);
                // if (isEditingOrder) {
                //   resetData();
                // }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              {isEditingOrder ? "لغو ویرایش" : "ویرایش اطلاعات سفارش"}
            </button>
            {isEditingOrder && (
              <button
                onClick={handleSaveOrder}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                ذخیره
              </button>
            )}
          </div>
          {saving && "ذخیره سازی"}
        </div>
        <div className="flex items-center justify-around">
          <button
            onClick={HandleDeleteOrder}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            حذف سفارش
          </button>
          <button
            onClick={HandleNoSms}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
          >
            ذخیره بدون پیام
          </button>
          <button
            onClick={sendPdfToBackend}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
          >
            پرینت
          </button>
        </div>
      </div>
    </div>
  );
}
