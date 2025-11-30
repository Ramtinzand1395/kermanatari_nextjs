"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
      if (!confirm("آیا از حذف این محصول مطمئن هستید؟")) return;
      
      setLoading(true);
      try {
        console.log(id,"sent")
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("خطا در حذف محصول");

      toast.success("✅ محصول با موفقیت حذف شد.");
      router.refresh(); // صفحه را رفرش می‌کند تا محصول حذف‌شده نمایش داده نشود
    } catch (err) {
      toast.error("❌ خطایی رخ داد، لطفاً دوباره تلاش کنید.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`p-2 rounded-md text-red-600 hover:bg-red-100 transition ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      title="حذف محصول"
    >
      <Trash2 size={18} />
    </button>
  );
}
