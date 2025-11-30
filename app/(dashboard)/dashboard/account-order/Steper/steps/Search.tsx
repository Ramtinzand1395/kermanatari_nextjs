import { Customer } from "@/types";

interface SearchProps {
  customerData: Customer;
  setCustomerData: React.Dispatch<React.SetStateAction<Customer>>;
}

const Search: React.FC<SearchProps> = ({ customerData, setCustomerData }) => {
 
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[480px] bg-white border rounded-2xl shadow-md p-1.5 transition-all duration-150 ease-in-out hover:scale-105 hover:shadow-lg">
        <input
          type="number"
          value={customerData.mobile}
          onChange={(e) =>
            setCustomerData((prev) => ({
              ...prev,
              mobile: e.target.value,
            }))
          }
          className="md:w-full w-auto max-w-[70vw] pl-2 py-1 pr-8 md:pl-8 md:pr-24 md:py-3 text-base text-gray-700 bg-transparent rounded-lg focus:outline-none"
          placeholder="جستجو شماره تلفن"
        />

        <div className="absolute inset-y-0 right-0 pl-2.5 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Search;
