import { User, Smartphone } from "lucide-react";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Customer } from "@/types";

interface AddUserFormProps {
  customerData: Customer;
  setCustomerData: React.Dispatch<React.SetStateAction<Customer>>;
  loadingName: boolean;
}

const AddUserForm: React.FC<AddUserFormProps> = ({
  customerData,
  setCustomerData,
  loadingName,
}) => {
  const handleUserChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const inputClasses =
    "w-full px-8 py-1 text-base text-gray-700 bg-transparent rounded-lg focus:outline-none";

  const wrapperClasses =
    "relative w-auto bg-white rounded-2xl border shadow-md p-1.5 transition-all duration-150 ease-in-out hover:scale-105 hover:shadow-lg";

  const iconClasses =
    "absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none";

  if (loadingName) {
    return (
      <div className="flex justify-center items-center h-32">
        {/* <Spiner /> */}
        load
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
      {/* Name */}
      <div className={wrapperClasses}>
        <input
          type="text"
          name="name"
          value={customerData.name}
          onChange={handleUserChange}
          className={inputClasses}
          placeholder="نام را وارد کنید"
          disabled={!!customerData.id}
        />
        <div className={iconClasses}>
          <User size={16} color="gray" />
        </div>
      </div>

      {/* Last Name */}
      <div className={wrapperClasses}>
        <input
          type="text"
          name="lastName"
          value={customerData.lastName}
          onChange={handleUserChange}
          className={inputClasses}
          placeholder="نام خانوادگی را وارد کنید"
          disabled={!!customerData.id}
        />
        <div className={iconClasses}>
          <User size={16} color="gray" />
        </div>
      </div>

      {/* Sex */}
      <div className={wrapperClasses}>
        <select
          title="sex"
          name="sex"
          className={inputClasses}
          value={customerData.sex}
          onChange={handleUserChange}
          disabled={!!customerData.sex}
        >
          <option value="">انتخاب جنسیت</option>
          <option value="مرد">مرد</option>
          <option value="زن">زن</option>
        </select>
        <div className={iconClasses}>
          <User size={16} color="gray" />
        </div>
      </div>

      {/* Mobile */}
      <div className={wrapperClasses}>
        <input
          type="text"
          name="mobile"
          value={customerData.mobile}
          onChange={handleUserChange}
          className={inputClasses}
          placeholder="شماره تماس"
          inputMode="numeric"
          pattern="[0-9]*"
          disabled
        />
        <div className={iconClasses}>
          <Smartphone  size={16} color="gray" />
        </div>
      </div>
      {/* birday */}
      <div className={wrapperClasses}>
        {/* <label className="">تاریخ  از</label> */}
        <DatePicker
          calendarPosition="bottom-left"
          inputClass={inputClasses}
          containerStyle={{ width: "100%" }}
          style={{
            minWidth: "150px",
          }}
          calendar={persian}
          locale={persian_fa}
          value={customerData.birthday}
          placeholder="تاریخ تولد"
          onChange={(date) => {
            setCustomerData((prev) => ({
              ...prev,
              birthday: date?.toString() || "",
            }));
          }}
        />
      </div>
      {/* description */}
      <div className={wrapperClasses}>
        <textarea
          value={customerData.description}
          onChange={handleUserChange}
          name="description"
          id=""
          placeholder="توضیحات"
          className="h-6"
        ></textarea>
      </div>
    </div>
  );
};

export default AddUserForm;
