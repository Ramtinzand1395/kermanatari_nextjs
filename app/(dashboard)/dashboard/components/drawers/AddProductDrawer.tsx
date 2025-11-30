"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import { Category } from "@/types";

interface ProductForm {
  title: string;
  slug: string;
  price: number;
  discountPrice?: number;
  stock: number;
  brand: string;
  description: string;
  shortDesc: string;
  categoryId?: number;
  tags: string[];
  mainImage: string; // فقط URL
  galleryImages: string[]; // URL[]
  specifications: { title: string; items: { key: string; value: string }[] }[];
}

interface Props {
  onClose: () => void;
}

export default function AddProductDrawer({ onClose }: Props) {
  const [form, setForm] = useState<ProductForm>({
    title: "",
    slug: "",
    price: 0,
    discountPrice: undefined,
    stock: 0,
    brand: "",
    description: "",
    shortDesc: "",
    categoryId: undefined,
    mainImage: "",
    galleryImages: [],
    specifications: [],
    tags: [],
  });
  const [newTag, setNewTag] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => toast.error("خطا در دریافت دسته‌بندی‌ها"));
  }, []);

  const updateField = <K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ---------------------------
  // ⬆⬆⬆ آپلود Cloudinary
  // ---------------------------
  const uploadToCloudinary = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
      {
        method: "POST",
        body: fd,
      }
    );
    const data = await res.json();
    return data.secure_url as string;
  };

  // ---------------------------
  // ⬆⬆⬆ انتخاب عکس اصلی
  // ---------------------------
  const handleMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.info("در حال آپلود تصویر اصلی...");
    const url = await uploadToCloudinary(file);
    updateField("mainImage", url);
    toast.success("تصویر اصلی با موفقیت آپلود شد");
  };

  // ---------------------------
  // ⬆⬆⬆ انتخاب گالری
  // ---------------------------
  const handleGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    toast.info("در حال آپلود تصاویر گالری...");

    const uploaded = await Promise.all(files.map((f) => uploadToCloudinary(f)));

    updateField("galleryImages", [...form.galleryImages, ...uploaded]);

    toast.success("تمام تصاویر با موفقیت آپلود شدند");
  };

  // ---------------------------
  // ⬆⬆⬆ Submit
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.slug ||
      !form.price ||
      !form.mainImage ||
      !form.categoryId
    )
      return toast.warning(
        "عنوان، اسلاگ، قیمت و تصویر و دسته بندی اصلی الزامی است"
      );

    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("محصول با موفقیت اضافه شد");

        setForm({
          title: "",
          slug: "",
          price: 0,
          discountPrice: undefined,
          stock: 0,
          brand: "",
          description: "",
          shortDesc: "",
          categoryId: undefined,
          mainImage: "",
          galleryImages: [],
          specifications: [],
          tags: [],
        });
      } else {
        toast.error(data.error || "خطا در اضافه کردن محصول");
      }
    } catch (err) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // تگ‌ها
  // ---------------------------
  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      updateField("tags", [...form.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    updateField(
      "tags",
      form.tags.filter((t) => t !== tag)
    );
  };

  const updateSpec = <K extends keyof ProductForm["specifications"][0]>(
    specIndex: number,
    key: K,
    value: ProductForm["specifications"][0][K]
  ) => {
    const specs = [...form.specifications];
    specs[specIndex][key] = value;
    updateField("specifications", specs);
  };

  const updateSpecItem = (
    specIndex: number,
    itemIndex: number,
    key: "key" | "value",
    value: string
  ) => {
    const specs = [...form.specifications];
    specs[specIndex].items[itemIndex][key] = value;
    updateField("specifications", specs);
  };

  const addSpec = () =>
    updateField("specifications", [
      ...form.specifications,
      { title: "", items: [] },
    ]);
  const addSpecItem = (specIndex: number) => {
    const specs = [...form.specifications];
    specs[specIndex].items.push({ key: "", value: "" });
    updateField("specifications", specs);
  };
  const removeSpecItem = (specIndex: number, itemIndex: number) => {
    const specs = [...form.specifications];
    specs[specIndex].items.splice(itemIndex, 1);
    updateField("specifications", specs);
  };

  // --------------------------- UI -----------------------------
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative bg-[#001A6E] text-white w-96 p-6 overflow-y-auto">
        <button
          title="close"
          onClick={onClose}
          className="absolute top-4 left-4"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl mb-4 font-bold">افزودن محصول جدید</h2>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {/* فیلدهای متن */}
          {(
            ["title", "slug", "brand", "shortDesc"] as (keyof ProductForm)[]
          ).map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              value={form[field] as string}
              onChange={(e) =>
                updateField(field as keyof ProductForm, e.target.value)
              }
              className="p-2 rounded bg-[#010c32]"
            />
          ))}

          <textarea
            placeholder="توضیحات"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="p-2 rounded bg-[#010c32]"
          />

          {/* عددی‌ها */}
          {(["price", "discountPrice", "stock"] as (keyof ProductForm)[]).map(
            (field) => (
              <>
                <label>{field}</label>
                <input
                  key={field}
                  type="number"
                  placeholder={field}
                  value={(form[field] as number) ?? ""}
                  onChange={(e) =>
                    updateField(
                      field as keyof ProductForm,
                      Number(e.target.value)
                    )
                  }
                  className="p-2 rounded bg-[#010c32]"
                />
              </>
            )
          )}

          {/* دسته‌بندی */}
          <select
            title="category"
            value={form.categoryId ?? ""}
            onChange={(e) => updateField("categoryId", Number(e.target.value))}
            className="p-2 rounded bg-[#010c32]"
          >
            <option value="">انتخاب دسته‌بندی</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.parent ? `${cat.parent.name} / ${cat.name}` : cat.name}
              </option>
            ))}
          </select>

          {/* عکس اصلی */}
          <div>
            <p className="mb-1">تصویر اصلی:</p>
            <input
              title="file"
              type="file"
              accept="image/*"
              onChange={handleMainImage}
            />

            {form.mainImage && (
              <Image
                alt="mainImage"
                width={50}
                height={25}
                src={form.mainImage}
                className=" object-cover rounded mt-2"
              />
            )}
          </div>

          {/* گالری */}
          <div>
            <p className="mb-1">گالری تصاویر:</p>
            <input
              title="mainImage"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGallery}
            />

            {form.galleryImages.map((url, i) => (
              <Image
                width={50}
                height={25}
                alt="galleryImages"
                key={i}
                src={url}
                className=" object-cover rounded mt-2"
              />
            ))}
          </div>
          {/* تگ‌ها */}
          <div>
            <p className="mb-1 font-bold">تگ‌ها:</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-600 px-2 py-1 rounded flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-xs bg-red-600 rounded px-1"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="تگ جدید"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="p-2 rounded bg-[#010c32] flex-1"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-green-600 p-2 rounded"
              >
                افزودن
              </button>
            </div>
          </div>

          {/* مشخصات */}
          <div>
            <p className="mb-1 font-bold">مشخصات:</p>
            {form.specifications.map((spec, specIndex) => (
              <div
                key={specIndex}
                className="mb-2 border border-gray-600 p-2 rounded"
              >
                <input
                  type="text"
                  placeholder="تیتر مشخصات"
                  value={spec.title}
                  onChange={(e) =>
                    updateSpec(specIndex, "title", e.target.value)
                  }
                  className="p-1 rounded bg-[#1A1D33] w-full mb-1"
                />
                {spec.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex flex-col gap-2 mb-1">
                    <input
                      type="text"
                      placeholder="کلید"
                      value={item.key}
                      onChange={(e) =>
                        updateSpecItem(
                          specIndex,
                          itemIndex,
                          "key",
                          e.target.value
                        )
                      }
                      className="p-1 rounded bg-[#1A1D33] flex-1"
                    />
                    <div className="">
                      <input
                        type="text"
                        placeholder="مقدار"
                        value={item.value}
                        onChange={(e) =>
                          updateSpecItem(
                            specIndex,
                            itemIndex,
                            "value",
                            e.target.value
                          )
                        }
                        className="p-1 rounded bg-[#1A1D33] flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecItem(specIndex, itemIndex)}
                        className="bg-red-600 p-1 rounded text-xs"
                      >
                        x
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSpecItem(specIndex)}
                  className="bg-green-600 p-1 rounded text-xs"
                >
                  + آیتم
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpec}
              className="bg-blue-600 p-2 rounded text-sm mb-2"
            >
              + مشخصات جدید
            </button>
          </div>

          {/* دکمه ذخیره */}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 p-2 rounded"
          >
            {loading ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </form>
      </div>
    </div>
  );
}
