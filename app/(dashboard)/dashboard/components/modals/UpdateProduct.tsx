// "use client";

// import { X } from "lucide-react";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { Category, Product, Specification, SpecificationItem } from "@/types";
// import Image from "next/image";

// interface UpdateProductProps {
//   onClose: () => void;
//   product: Product;
// }

// const UpdateProduct = ({ onClose, product }: UpdateProductProps) => {
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [newTag, setNewTag] = useState("");

//   const [form, setForm] = useState<Product>({
//     title: product.title,
//     slug: product.slug,
//     price: product.price,
//     discountPrice: product.discountPrice || null,
//     stock: product.stock,
//     brand: product.brand,
//     description: product.description,
//     shortDesc: product.shortDesc,
//     categoryId: product.categoryId,
//     mainImage: product.mainImage,
//     galleryImages: product.images?.map((img) => img.url) || [],
//     tags: product.tags?.map((t) => t.name) || [],
//     specifications:
//       product.specifications?.map((spec) => ({
//         title: spec.title,
//         items: spec.items.map((item) => ({ key: item.key, value: item.value })),
//       })) || [],
//   });

//   useEffect(() => {
//     fetch("/api/admin/categories")
//       .then((res) => res.json())
//       .then(setCategories)
//       .catch(() => toast.error("خطا در دریافت دسته‌بندی‌ها"));
//   }, []);

//   const updateField = (key: keyof ProductForm, value: any) =>
//     setForm((prev) => ({ ...prev, [key]: value }));

//   // ==========================
//   // 📌 Cloudinary Upload
//   // ==========================
//   const uploadToCloudinary = async (file: File) => {
//     const fd = new FormData();
//     fd.append("file", file);
//     fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

//     const res = await fetch(
//       `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
//       { method: "POST", body: fd }
//     );
//     const data = await res.json();
//     return data.secure_url;
//   };

//   const handleMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     toast.info("در حال آپلود تصویر...");
//     const url = await uploadToCloudinary(file);
//     updateField("mainImage", url);
//     toast.success("تصویر اصلی آپلود شد");
//   };

//   const handleGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     if (!files.length) return;
//     toast.info("در حال آپلود تصاویر...");
//     const uploaded = await Promise.all(files.map(uploadToCloudinary));
//     updateField("galleryImages", [...form.galleryImages, ...uploaded]);
//     toast.success("تصاویر گالری آپلود شد");
//   };

//   // ==========================
//   // 📌 Tags
//   // ==========================
//   const addTag = () => {
//     const tag = newTag.trim();
//     if (!tag || form.tags.includes(tag)) return;
//     updateField("tags", [...form.tags, tag]);
//     setNewTag("");
//   };

//   const removeTag = (tag: string) =>
//     updateField(
//       "tags",
//       form.tags.filter((t) => t !== tag)
//     );

//   // ==========================
//   // 📌 Specifications
//   // ==========================
//   const updateSpec = (index: number, key: keyof Specification, value: any) => {
//     const specs = [...form.specifications];
//     specs[index][key] = value;
//     updateField("specifications", specs);
//   };

//   const updateSpecItem = (
//     specIndex: number,
//     itemIndex: number,
//     key: keyof SpecificationItem,
//     value: string
//   ) => {
//     const specs = [...form.specifications];
//     specs[specIndex].items[itemIndex][key] = value;
//     updateField("specifications", specs);
//   };

//   const addSpec = () =>
//     updateField("specifications", [
//       ...form.specifications,
//       { title: "", items: [] },
//     ]);

//   const addSpecItem = (specIndex: number) => {
//     const specs = [...form.specifications];
//     specs[specIndex].items.push({ key: "", value: "" });
//     updateField("specifications", specs);
//   };

//   const removeSpecItem = (specIndex: number, itemIndex: number) => {
//     const specs = [...form.specifications];
//     specs[specIndex].items.splice(itemIndex, 1);
//     updateField("specifications", specs);
//   };

//   // ==========================
//   // 📌 Submit
//   // ==========================
//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/admin/products/${product.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       if (!res.ok) throw new Error();
//       toast.success("محصول با موفقیت بروزرسانی شد");
//       onClose();
//     } catch {
//       toast.error("خطا در بروزرسانی محصول");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="bg-white rounded-xl p-5 w-[90vw] max-h-[90vh] overflow-y-auto"
//       >
//         {/* HEADER */}
//         <div className="flex items-center justify-between border-b pb-3">
//           <h2 className="text-lg font-medium">ویرایش محصول</h2>
//           <button
//             title="close"
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full"
//           >
//             <X />
//           </button>
//         </div>

//         {/* FORM */}
//         <div className="grid grid-cols-2 gap-4 py-5">
//           {/** نام محصول **/}
//           <div>
//             <label>نام محصول</label>
//             <input
//               title="title"
//               className="input"
//               value={form.title}
//               onChange={(e) => updateField("title", e.target.value)}
//             />
//           </div>

//           {/** اسلاگ **/}
//           <div>
//             <label>اسلاگ</label>
//             <input
//               title="slug"
//               className="input"
//               value={form.slug}
//               onChange={(e) => updateField("slug", e.target.value)}
//             />
//           </div>

//           {/** قیمت **/}
//           <div>
//             <label>قیمت</label>
//             <input
//               title="price"
//               type="number"
//               className="input"
//               value={form.price}
//               onChange={(e) => updateField("price", Number(e.target.value))}
//             />
//           </div>

//           {/** تخفیف **/}
//           <div>
//             <label>قیمت تخفیف</label>
//             <input
//               title="discountPrice"
//               type="number"
//               className="input"
//               value={form.discountPrice}
//               onChange={(e) =>
//                 updateField("discountPrice", Number(e.target.value))
//               }
//             />
//           </div>

//           {/** موجودی **/}
//           <div>
//             <label>موجودی</label>
//             <input
//               title="stock"
//               type="number"
//               className="input"
//               value={form.stock}
//               onChange={(e) => updateField("stock", Number(e.target.value))}
//             />
//           </div>

//           {/** برند **/}
//           <div>
//             <label>برند</label>
//             <input
//               title="brand"
//               className="input"
//               value={form.brand}
//               onChange={(e) => updateField("brand", e.target.value)}
//             />
//           </div>

//           {/** دسته‌بندی **/}
//           <div>
//             <label>دسته‌بندی</label>
//             <select
//               title="id"
//               value={form.categoryId ?? ""}
//               onChange={(e) =>
//                 updateField("categoryId", Number(e.target.value))
//               }
//               className="p-2 rounded bg-[#010c32] text-white"
//             >
//               <option value="">انتخاب دسته‌بندی</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.parent ? `${cat.parent.name} / ${cat.name}` : cat.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/** توضیح کوتاه **/}
//           <div className="col-span-2">
//             <label>توضیح کوتاه</label>
//             <textarea
//               title="shortDesc"
//               className="input h-20"
//               value={form.shortDesc}
//               onChange={(e) => updateField("shortDesc", e.target.value)}
//             />
//           </div>

//           {/** توضیحات کامل **/}
//           <div className="col-span-2">
//             <label>توضیحات کامل</label>
//             <textarea
//               title="description"
//               className="input h-32"
//               value={form.description}
//               onChange={(e) => updateField("description", e.target.value)}
//             />
//           </div>

//           {/** تصویر اصلی **/}
//           <div className="col-span-2">
//             <label className="font-semibold">تصویر اصلی</label>
//             <input
//               title="image"
//               type="file"
//               accept="image/*"
//               onChange={handleMainImage}
//             />
//             {form.mainImage && (
//               <Image
//                 alt="mainImage"
//                 width={50}
//                 height={50}
//                 src={form.mainImage}
//                 className="w-32 h-28 rounded mt-2 object-cover"
//               />
//             )}
//           </div>

//           {/** گالری **/}
//           <div className="col-span-2">
//             <label className="font-semibold">گالری تصاویر</label>
//             <input
//               title="image"
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleGallery}
//             />
//             <div className="grid grid-cols-4 gap-2 mt-2">
//               {form.galleryImages.map((url, i) => (
//                 <Image
//                   width={50}
//                   height={50}
//                   alt="galleryImage"
//                   key={i}
//                   src={url}
//                   className="w-full h-24 rounded"
//                 />
//               ))}
//             </div>
//           </div>

//           {/** تگ‌ها **/}
//           <div className="col-span-2">
//             <p className="mb-1 font-bold">تگ‌ها:</p>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {form.tags.map((tag) => (
//                 <span
//                   key={tag}
//                   className="bg-blue-600 px-2 py-1 rounded flex items-center gap-1 text-white"
//                 >
//                   {tag}
//                   <button
//                     onClick={() => removeTag(tag)}
//                     className="text-xs bg-red-600 rounded px-1"
//                   >
//                     x
//                   </button>
//                 </span>
//               ))}
//             </div>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder="تگ جدید"
//                 value={newTag}
//                 onChange={(e) => setNewTag(e.target.value)}
//                 className="p-2 rounded bg-[#010c32] flex-1 text-white"
//               />
//               <button
//                 type="button"
//                 onClick={addTag}
//                 className="bg-green-600 p-2 rounded text-white"
//               >
//                 افزودن
//               </button>
//             </div>
//           </div>

//           {/** مشخصات **/}
//           <div className="col-span-2">
//             <p className="mb-1 font-bold">مشخصات:</p>
//             {form.specifications.map((spec, specIndex) => (
//               <div
//                 key={specIndex}
//                 className="mb-2 border border-gray-600 p-2 rounded"
//               >
//                 <input
//                   type="text"
//                   placeholder="تیتر مشخصات"
//                   value={spec.title}
//                   onChange={(e) =>
//                     updateSpec(specIndex, "title", e.target.value)
//                   }
//                   className="p-1 rounded bg-[#1A1D33] w-full mb-1 text-white"
//                 />
//                 {spec.items.map((item, itemIndex) => (
//                   <div key={itemIndex} className="flex flex-col gap-1 mb-1">
//                     <input
//                       type="text"
//                       placeholder="کلید"
//                       value={item.key}
//                       onChange={(e) =>
//                         updateSpecItem(
//                           specIndex,
//                           itemIndex,
//                           "key",
//                           e.target.value
//                         )
//                       }
//                       className="p-1 rounded bg-[#1A1D33] flex-1 text-white"
//                     />
//                     <input
//                       type="text"
//                       placeholder="مقدار"
//                       value={item.value}
//                       onChange={(e) =>
//                         updateSpecItem(
//                           specIndex,
//                           itemIndex,
//                           "value",
//                           e.target.value
//                         )
//                       }
//                       className="p-1 rounded bg-[#1A1D33] flex-1 text-white"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeSpecItem(specIndex, itemIndex)}
//                       className="bg-red-600 p-1 rounded text-xs text-white"
//                     >
//                       حذف
//                     </button>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={() => addSpecItem(specIndex)}
//                   className="bg-green-600 p-1 rounded text-xs text-white"
//                 >
//                   + آیتم
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={addSpec}
//               className="bg-blue-600 p-2 rounded text-sm text-white mb-2"
//             >
//               + مشخصات جدید
//             </button>
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="border-t pt-4 flex justify-end gap-3">
//           <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>
//             انصراف
//           </button>
//           <button
//             className="px-6 py-2 rounded bg-blue-600 text-white"
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default UpdateProduct;

"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  Category,
  Product,
  Specification,
  SpecificationItem,
  Tag,
  ProductImage,
} from "@/types";

interface ProductForm {
  title: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  brand?: string;
  description: string;
  shortDesc?: string;
  categoryId: number;
  mainImage: string;
  galleryImages: string[];
  tags: Tag[];
  specifications: {
    title: string;
    items: {
      key: string;
      value: string;
    }[];
  }[];
}

interface UpdateProductProps {
  onClose: () => void;
  product: Product;
}

const UpdateProduct = ({ onClose, product }: UpdateProductProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTag, setNewTag] = useState<string>("");

  const [form, setForm] = useState<ProductForm>({
    title: product.title,
    slug: product.slug,
    price: product.price,
    discountPrice: product.discountPrice ?? null,
    stock: product.stock,
    brand: product.brand,
    description: product.description,
    shortDesc: product.shortDesc,
    categoryId: product.categoryId,
    mainImage: product.mainImage,
    galleryImages: product.images?.map((img: ProductImage) => img.url) || [],
    tags: product.tags || [],
    specifications:
      product.specifications?.map((spec: Specification) => ({
        title: spec.title,
        items: spec.items.map((item: SpecificationItem) => ({
          key: item.key,
          value: item.value,
        })),
      })) || [],
  });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res: Response) => res.json())
      .then((data: Category[]) => setCategories(data))
      .catch(() => toast.error("خطا در دریافت دسته‌بندی‌ها"));
  }, []);

  const updateField = <K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K]
  ): void => setForm((prev) => ({ ...prev, [key]: value }));

  // ==========================
  // 📌 Cloudinary Upload
  // ==========================
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
      { method: "POST", body: fd }
    );
    const data = (await res.json()) as { secure_url: string };
    return data.secure_url;
  };

  const handleMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.info("در حال آپلود تصویر...");
    const url = await uploadToCloudinary(file);
    updateField("mainImage", url);
    toast.success("تصویر اصلی آپلود شد");
  };

  const handleGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    toast.info("در حال آپلود تصاویر...");
    const uploaded: string[] = await Promise.all(files.map(uploadToCloudinary));
    updateField("galleryImages", [...form.galleryImages, ...uploaded]);
    toast.success("تصاویر گالری آپلود شد");
  };

  // ==========================
  // 📌 Tags
  // ==========================
  const addTag = (): void => {
    const name = newTag.trim();
    if (!name || form.tags.some((t) => t.name === name)) return;
    const newTagObj: Tag = { id: Date.now(), name, slug: name, products: [] };
    updateField("tags", [...form.tags, newTagObj]);
    setNewTag("");
  };

  const removeTag = (tagName: string): void =>
    updateField(
      "tags",
      form.tags.filter((t) => t.name !== tagName)
    );

  // ==========================
  // 📌 Specifications
  // ==========================
  const updateSpec = (index: number, value: string): void => {
    const specs = [...form.specifications];
    specs[index].title = value;
    updateField("specifications", specs);
  };

  const updateSpecItem = (
    specIndex: number,
    itemIndex: number,
    field: "key" | "value",
    value: string
  ): void => {
    const specs = [...form.specifications];
    specs[specIndex].items[itemIndex][field] = value;
    updateField("specifications", specs);
  };

  const addSpec = (): void =>
    updateField("specifications", [
      ...form.specifications,
      { title: "", items: [] },
    ]);

  const addSpecItem = (specIndex: number): void => {
    const specs = [...form.specifications];
    specs[specIndex].items.push({ key: "", value: "" });
    updateField("specifications", specs);
  };

  const removeSpecItem = (specIndex: number, itemIndex: number): void => {
    const specs = [...form.specifications];
    specs[specIndex].items.splice(itemIndex, 1);
    updateField("specifications", specs);
  };

  // ==========================
  // 📌 Submit
  // ==========================
  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("محصول با موفقیت بروزرسانی شد");
      onClose();
    } catch {
      toast.error("خطا در بروزرسانی محصول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-5 w-[90vw] max-h-[90vh] overflow-y-auto"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-medium">ویرایش محصول</h2>
          <button
            title="close"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X />
          </button>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4 py-5">
          {/* نام محصول */}
          <div>
            <label>نام محصول</label>
            <input
              title="title"
              className="input"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>

          {/* اسلاگ */}
          <div>
            <label>اسلاگ</label>
            <input
              title="slug"
              className="input"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
            />
          </div>

          {/* قیمت */}
          <div>
            <label>قیمت</label>
            <input
              title="price"
              type="number"
              className="input"
              value={form.price}
              onChange={(e) => updateField("price", Number(e.target.value))}
            />
          </div>

          {/* تخفیف */}
          <div>
            <label>قیمت تخفیف</label>
            <input
              title="discountPrice"
              type="number"
              className="input"
              value={form.discountPrice ?? ""}
              onChange={(e) =>
                updateField("discountPrice", Number(e.target.value))
              }
            />
          </div>

          {/* موجودی */}
          <div>
            <label>موجودی</label>
            <input
              title="stock"
              type="number"
              className="input"
              value={form.stock}
              onChange={(e) => updateField("stock", Number(e.target.value))}
            />
          </div>

          {/* برند */}
          <div>
            <label>برند</label>
            <input
              title="brand"
              className="input"
              value={form.brand ?? ""}
              onChange={(e) => updateField("brand", e.target.value)}
            />
          </div>

          {/* دسته‌بندی */}
          <div>
            <label>دسته‌بندی</label>
            <select
              title="categoryId"
              value={form.categoryId ?? ""}
              onChange={(e) =>
                updateField("categoryId", Number(e.target.value))
              }
              className="p-2 rounded bg-[#010c32] text-white"
            >
              <option value="">انتخاب دسته‌بندی</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.parent ? `${cat.parent.name} / ${cat.name}` : cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* توضیح کوتاه */}
          <div className="col-span-2">
            <label>توضیح کوتاه</label>
            <textarea
              title="shortDesc"
              className="input h-20"
              value={form.shortDesc ?? ""}
              onChange={(e) => updateField("shortDesc", e.target.value)}
            />
          </div>

          {/* توضیحات کامل */}
          <div className="col-span-2">
            <label>توضیحات کامل</label>
            <textarea
              title="description"
              className="input h-32"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          {/* تصویر اصلی */}
          <div className="col-span-2">
            <label className="font-semibold">تصویر اصلی</label>
            <input
              title="mainImage"
              type="file"
              accept="image/*"
              onChange={handleMainImage}
            />
            {form.mainImage && (
              <Image
                alt="mainImage"
                width={50}
                height={50}
                src={form.mainImage}
                className="w-32 h-28 rounded mt-2 object-cover"
              />
            )}
          </div>

          {/* گالری */}
          <div className="col-span-2">
            <label className="font-semibold">گالری تصاویر</label>
            <input
              title="galleryImages"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGallery}
            />
            <div className="grid grid-cols-4 gap-2 mt-2">
              {form.galleryImages.map((url, i) => (
                <Image
                  key={i}
                  width={50}
                  height={50}
                  alt="galleryImage"
                  src={url}
                  className="w-full h-24 rounded"
                />
              ))}
            </div>
          </div>

          {/* تگ‌ها */}
          <div className="col-span-2">
            <p className="mb-1 font-bold">تگ‌ها:</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-blue-600 px-2 py-1 rounded flex items-center gap-1 text-white"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => removeTag(tag.name)}
                    className="text-xs bg-red-600 rounded px-1"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                title="newTag"
                type="text"
                placeholder="تگ جدید"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="p-2 rounded bg-[#010c32] flex-1 text-white"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-green-600 p-2 rounded text-white"
              >
                افزودن
              </button>
            </div>
          </div>

          {/* مشخصات */}
          <div className="col-span-2">
            <p className="mb-1 font-bold">مشخصات:</p>
            {form.specifications.map((spec, specIndex) => (
              <div
                key={specIndex}
                className="mb-2 border border-gray-600 p-2 rounded"
              >
                <input
                  title={`specTitle${specIndex}`}
                  type="text"
                  placeholder="تیتر مشخصات"
                  value={spec.title}
                  onChange={(e) => updateSpec(specIndex, e.target.value)}
                  className="p-1 rounded bg-[#1A1D33] w-full mb-1 text-white"
                />

                {spec.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex flex-col gap-1 mb-1">
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
                      className="p-1 rounded bg-[#1A1D33] flex-1 text-white"
                    />
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
                      className="p-1 rounded bg-[#1A1D33] flex-1 text-white"
                    />

                    <button
                      type="button"
                      onClick={() => removeSpecItem(specIndex, itemIndex)}
                      className="bg-red-600 p-1 rounded text-xs text-white"
                    >
                      حذف
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSpecItem(specIndex)}
                  className="bg-green-600 p-1 rounded text-xs text-white"
                >
                  + آیتم
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpec}
              className="bg-blue-600 p-2 rounded text-sm text-white mb-2"
            >
              + مشخصات جدید
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t pt-4 flex justify-end gap-3">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>
            انصراف
          </button>
          <button
            className="px-6 py-2 rounded bg-blue-600 text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdateProduct;
