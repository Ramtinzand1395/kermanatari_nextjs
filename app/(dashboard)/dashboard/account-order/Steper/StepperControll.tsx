
import { Customer } from "@/types";
import { customerSchema, searchSchema } from "@/validations/CustomerAppValidation";
import { toast } from "react-toastify";
import * as Yup from "yup";

// Define the types for the props
interface StepperControllProps {
  handleClick: (direction?: string) => void;
  currentStep: number;
  steps: string[];
  handleSearch: () => void;
  handleAddCustomer: () => void;
  customerData: Customer;
}

const StepperControll: React.FC<StepperControllProps> = ({
  handleClick,
  currentStep,
  steps,
  handleSearch,
  handleAddCustomer,
  customerData,
}) => {
  const handleNext = async () => {
    if (currentStep === 1) {
      try {
        await searchSchema.validate({ mobile: customerData.mobile });
        await handleSearch(); // call only if validation passes
        handleClick("next");
      } catch (err: unknown) {
        if (err instanceof Yup.ValidationError) {
          toast.error(err.message);
        } else {
          console.error(err);
          toast.error("خطای نامشخصی رخ داده است");
        }
      }
    } else if (currentStep === 2) {
      try {
        await customerSchema.validate(customerData, { abortEarly: false });
        await handleAddCustomer();
        handleClick("next");
      } catch (err: unknown) {
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach((validationError) => {
            if (validationError.message) {
              toast.error(validationError.message);
            }
          });
        } else {
          console.error(err);
          toast.error("خطای نامشخصی رخ داده است");
        }
      }
      
    }
  };
  return (
    <div className="container flex justify-around mt-4 mb-8">
      {/* Back button */}
      <button
        onClick={() => handleClick()}
        className={`bg-white text-slate-400 uppercase py-2 px-4 rounded-xl font-semibold border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 ease-in-out font-tanha ${
          currentStep === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        قبلی
      </button>
      {/* Next button */}
      {currentStep !== steps.length && (
        <button
          onClick={handleNext}
          className={`bg-blue-500 text-white uppercase py-2 px-10 md:px-20 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-blue-600 hover:text-white transition-all duration-200 ease-in-out font-tanha`}
        >
          بعدی
        </button>
      )}
    </div>
  );
};

export default StepperControll;
