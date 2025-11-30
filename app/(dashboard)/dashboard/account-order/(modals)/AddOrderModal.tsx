"use client";
import { TimerReset } from "lucide-react";
import RegisterForm from "../Steper/RegisterForm";

interface AddOrderModalProps {
  OpenAddItem: boolean;
  setOpenAddItem: (value: boolean) => void;
}
const AddOrderModal = ({
  OpenAddItem,
  setOpenAddItem,
}: AddOrderModalProps) => {
  const closeModal = () => {
    setOpenAddItem(false);
  };
  if (!OpenAddItem) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
      ></div>

      {/* Modal content */}
      <div className="relative z-50 w-[80vw] max-w-3xl bg-white rounded-2xl p-6 shadow-xl animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          title="btn"
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
        >
          <TimerReset size={18} />
        </button>

        {/* Modal Body */}

        <RegisterForm closeModal={closeModal} />
      </div>
    </div>
  );
};

export default AddOrderModal;
