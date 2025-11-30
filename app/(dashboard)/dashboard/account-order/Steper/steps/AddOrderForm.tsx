"use client";
import { X, DollarSign, Gamepad } from "lucide-react";
import GameDropdown from "../../(modals)/GameDropdown";
import { CustomerOrder } from "@/types";

interface AddOrderFormProps {
  handleSubmite: () => void;
  Order: CustomerOrder;
  setOrder: React.Dispatch<React.SetStateAction<CustomerOrder>>;
  loadingAddCustomer: boolean;
}

export default function AddOrderForm({
  handleSubmite,
  Order,
  setOrder,
  loadingAddCustomer,
}: AddOrderFormProps) {
  const handleOrderChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "price") {
      const numericValue = value.replace(/,/g, "");
      if (!/^\d*$/.test(numericValue)) return;

      setOrder((prev) => ({
        ...prev,
        price: numericValue === "" ? 0 : Number(numericValue),
      }));
    } else {
      setOrder((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const removeGame = (gameToRemove: string) => {
    setOrder((prev) => ({
      ...prev,
      list: prev.list.filter((g) => g !== gameToRemove),
    }));
  };

  const inputClasses =
    "w-full px-8 py-1 text-base text-gray-700 bg-transparent rounded-lg focus:outline-none";

  const wrapperClasses =
    "relative w-auto bg-white border rounded-2xl shadow-md p-1.5 transition-all duration-150 ease-in-out hover:scale-105 hover:shadow-lg";

  const iconClasses =
    "absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none";

  function formatNumber(value: number | null) {
    if (value === null || value === undefined) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
        {/* Price */}
        <div className={wrapperClasses}>
          <input
            type="text"
            name="price"
            value={formatNumber(Order.price)}
            onChange={handleOrderChange}
            className={inputClasses}
            placeholder=" قیمت (  تومان  ) "
          />
          <div className={iconClasses}>
            <DollarSign size={20} color="gray" />
          </div>
        </div>

        {/* Console Type */}
        <div className={wrapperClasses}>
          <select
            title="select"
            name="consoleType"
            value={Order.consoleType}
            onChange={handleOrderChange}
            className={inputClasses}
          >
            <option value=""> نوع دستگاه</option>
            <option value="ps4">ps4</option>
            <option value="ps5">ps5</option>
            <option value="copy">کپی خور</option>
            <option value="xbox">Xbox</option>
          </select>
          <div className={iconClasses}>
            <Gamepad size={20} color="gray" />
          </div>
        </div>
        <GameDropdown Selectedgames={Order} setSelectedgames={setOrder} />
      </div>
      <h3 className="font-bold my-2">لیست بازی‌ها:</h3>
      <div className="mt-4 overflow-y-auto md:overflow-y-hidden md:h-auto">
        {/* <ul className="flex flex-row flex-wrap gap-2 h-[30vh] overflow-y-auto md:overflow-y-hidden md:h-auto"> */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
          {Order?.list.map((game, idx) => (
            <li
              key={idx}
              className="bg-white w-full my-2 shadow-md border text-black px-3 py-1 rounded-2xl flex items-center gap-2"
            >
              <button
                title="btn"
                onClick={() => removeGame(game)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                <X />
              </button>
              {game}
            </li>
          ))}
        </ul>
      </div>
      <div className={`${wrapperClasses} mt-5`}>
        <textarea
          name="description"
          value={Order.description}
          onChange={handleOrderChange}
          className={inputClasses}
          placeholder="توضیحات"
          rows={4}
        ></textarea>
        <button
          type="submit"
          onClick={() => handleSubmite()}
          className={` bg-blue-500 whitespace-nowrap text-sm md:text-xl text-white uppercase md: py-2 md:px-20 px-10  rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-blue-600 hover:text-white transition-all duration-200 ease-in-out font-tanha `}
        >
          {loadingAddCustomer ? "در حال ثبت" : " ثبت سفارش"}
        </button>
      </div>
    </>
  );
}
