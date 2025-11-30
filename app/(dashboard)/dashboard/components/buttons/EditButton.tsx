"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import UpdateProduct from "../modals/UpdateProduct";
import { Product } from "@/types";
interface EditButtonProps {
  product: Product;
}
export default function EditButton({ product }: EditButtonProps) {
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const handleEdit = () => {
    setIsEditDrawerOpen(true);
  };

  return (
    <>
      <button
        onClick={handleEdit}
        className="p-2 rounded-md text-blue-600 hover:bg-blue-100 transition"
        title="ویرایش محصول"
      >
        <Pencil size={18} />
      </button>
      {isEditDrawerOpen && product && (
        <>
          <UpdateProduct
            product={product}
            onClose={() => {
              setIsEditDrawerOpen(false);
            }}
          />
        </>
      )}
    </>
  );
}
