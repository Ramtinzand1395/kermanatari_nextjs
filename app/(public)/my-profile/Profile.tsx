"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  ProfileFormPayload,
  UpdatePasswordPayload,
  UserProfileForm,
} from "@/types";
import DateObject from "react-date-object";

export default function Profile() {
  const [editField, setEditField] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileFormPayload>({
    name: "",
    lastName: "",
    gender: "",
    birthday: "",
    nationalCode: "",
    email: "",
    mobile: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // مقداردهی اولیه از session
  async function getUserByMobile() {
    const res = await fetch(`/api/users_data/user`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "خطا در دریافت کاربر");
    }
    return res.json();
  }
  useEffect(() => {
    getUserByMobile()
      .then((user) => {
        setFormData({
          name: user.name || "",
          lastName: user.lastName || "",
          gender: user.gender,
          birthday: user.birthday || "",
          nationalCode: user.nationalCode || "",
          email: user.email || "",
          mobile: user.mobile || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch((err) => toast.error(err.message));
  }, []);

  // تمام فیلدها
  const fields = [
    { key: "name", label: "نام" },
    { key: "lastName", label: "نام خانوادگی" },
    { key: "email", label: "ایمیل" },
    { key: "mobile", label: "شماره موبایل" },
    { key: "gender", label: "جنسیت" },
    { key: "birthday", label: "تاریخ تولد" },
    { key: "nationalCode", label: "کد ملی" },
    { key: "password", label: "کلمه عبور" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------- API ----------------
  async function updateProfileInfo(data: UserProfileForm) {
    const res = await fetch("/api/users_data/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async function updatePassword(data: Partial<UserProfileForm>) {
    const res = await fetch("/api/register/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  // ---------- SAVE ----------------
  // const handleSave = async () => {
  //   // تغییر رمز عبور
  //   if (editField === "password") {
  //     if (!formData.currentPassword)
  //       return toast.error("پسورد فعلی را وارد کنید");
  //     if (!formData.newPassword) return toast.error("پسورد جدید را وارد کنید");
  //     if (formData.newPassword !== formData.confirmPassword)
  //       return toast.error("تکرار پسورد جدید مطابقت ندارد");

  //     const res = await updatePassword({
  //       currentPassword: formData.currentPassword,
  //       newPassword: formData.newPassword,
  //       confirmPassword: formData.confirmPassword,
  //     });

  //     if (res.success) {
  //       toast.success("رمز عبور با موفقیت تغییر کرد");
  //       setFormData((prev) => ({
  //         ...prev,
  //         currentPassword: "",
  //         newPassword: "",
  //         confirmPassword: "",
  //       }));
  //       setEditField(null);
  //     } else {
  //       toast.error(res.error || "خطا در تغییر رمز");
  //     }
  //     return;
  //   }

  //   // تغییر اطلاعات سایر فیلدها
  //   const res = await updateProfileInfo({
  //     [editField!]: formData[editField as keyof typeof formData],
  //   });

  //   if (res.success) {
  //     toast.success("اطلاعات با موفقیت ذخیره شد");
  //     setEditField(null);
  //   } else {
  //     toast.error(res.error || "خطا در ذخیره اطلاعات");
  //   }
  // };

  const handleSave = async () => {
    if (!editField) return;

    // ---------- تغییر رمز عبور ----------
    if (editField === "password") {
      if (!formData.currentPassword)
        return toast.error("پسورد فعلی را وارد کنید");
      if (!formData.newPassword) return toast.error("پسورد جدید را وارد کنید");
      if (formData.newPassword !== formData.confirmPassword)
        return toast.error("تکرار پسورد جدید مطابقت ندارد");

      const res = await updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      if (res.success) {
        toast.success("رمز عبور با موفقیت تغییر کرد");
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setEditField(null);
      } else {
        toast.error(res.error || "خطا در تغییر رمز");
      }
      return;
    }

    // ---------- تغییر سایر فیلدها ----------
    const res = await updateProfileInfo(formData as UserProfileForm);

    if (res.success) {
      toast.success("اطلاعات با موفقیت ذخیره شد");
      setEditField(null);
    } else {
      toast.error(res.error || "خطا در ذخیره اطلاعات");
    }
  };

  // -----------------------------------------------------

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-sm">
      {/* نمایش اطلاعات */}
      <div className="border p-4 rounded-xl shadow space-y-3 bg-white">
        {fields.map((field) => (
          <div
            key={field.key}
            className="flex justify-between items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => setEditField(field.key)}
          >
            <p className="text-gray-600">{field.label}</p>
            <p className="text-gray-800">
              {field.key === "password"
                ? "********"
                : formData[field.key as keyof typeof formData] ||
                  `برای ثبت ${field.label} کلیک کنید`}
            </p>
          </div>
        ))}
      </div>

      {/* فرم ادیت */}
      {editField && (
        <div className="border p-4 rounded-xl shadow bg-white min-h-[200px]">
          <div className="space-y-3">
            <p className="font-semibold text-gray-700 mb-2">
              ویرایش {fields.find((f) => f.key === editField)?.label}
            </p>

            {editField === "gender" ? (
              <select
                title="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">انتخاب کنید</option>
                <option value="مرد">مرد</option>
                <option value="زن">زن</option>
              </select>
            ) : editField === "birthday" ? (
              <DatePicker
                value={formData.birthday || ""}
                onChange={(date: DateObject | null) =>
                  setFormData({
                    ...formData,
                    birthday: date?.format?.("YYYY-MM-DD") ?? "",
                  })
                }
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                className="w-full p-2 border rounded"
              />
            ) : editField === "password" ? (
              <div className="space-y-3">
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="رمز عبور فعلی"
                />
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="رمز عبور جدید"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="تکرار رمز عبور جدید"
                />
              </div>
            ) : (
              <input
                type="text"
                name={editField}
                value={formData[editField as keyof typeof formData]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder={`ویرایش ${
                  fields.find((f) => f.key === editField)?.label
                }`}
              />
            )}

            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setEditField(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                لغو
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}

      {!editField && (
        <div className="flex flex-col gap-5">
          <p className="">
            خرید و فروش بازی‌های پلی‌استیشن، کنسول و اکانت‌های دیجیتالی با
            بهترین قیمت در کرمان.
          </p>
          <p>آدرس: کرمان، میدان شهدا، خیابان زینبیه، جنب داروخانه</p>
          <p>شماره تماس: 09383077225</p>
        </div>
      )}
    </div>
  );
}
