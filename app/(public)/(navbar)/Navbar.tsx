"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Home,
  Info,
  Phone,
  Grid2x2,
  ChevronDown,
  User,
  FileText,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useCartStore from "@/stores/cartStore";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import MobileMenu from "./MobileMenu";
import { CartItem } from "@/types";
import { usePathname, useRouter } from "next/navigation";

const categories = [
  {
    name: "کنسول‌ها",
    slug: "consoles",
    subcategories: [
      { name: "پلی‌استیشن 5", slug: "playstation-5" },
      { name: "پلی‌استیشن 4", slug: "playstation-4" },
      { name: "پلی‌استیشن 3", slug: "playstation-3" },
    ],
  },
  {
    name: "بازی‌ها",
    slug: "games",
    subcategories: [
      { name: "بازی اکانتی", slug: "account-games" },
      { name: "بازی دیسکی", slug: "disc-games" },
      { name: "گیفت کارت", slug: "gift-cards" },
    ],
  },
  {
    name: "لوازم جانبی",
    slug: "accessories",
    subcategories: [
      { name: "دسته بازی", slug: "controllers" },
      { name: "هدست و هدفون", slug: "headsets" },
      { name: "پایه و خنک‌کننده", slug: "stands-coolers" },
    ],
  },
  {
    name: "خدمات",
    slug: "services",
    subcategories: [
      { name: "نصب بازی", slug: "game-installation" },
      { name: "اکانت قانونی", slug: "legal-accounts" },
      { name: "تعمیرات کنسول", slug: "console-repair" },
    ],
  },
  {
    name: "لوازم گیمینگ",
    slug: "gaming",
    subcategories: [
      { name: "موس", slug: "mouse" },
      { name: "کیبرد", slug: "keyboard" },
      { name: "پاوربانک", slug: "powerbank" },
    ],
  },
];

const menuItems = [
  { name: "خانه", link: "/", icon: <Home className="w-4 h-4 ml-1" /> },
  {
    name: "دسته‌بندی‌ها",
    link: "#",
    icon: <Grid2x2 className="w-4 h-4 ml-1" />,
  },
  {
    name: "درباره ما",
    link: "/about-us",
    icon: <Info className="w-4 h-4 ml-1" />,
  },
  {
    name: "تماس با ما",
    link: "/contact-us",
    icon: <Phone className="w-4 h-4 ml-1" />,
  },
  {
    name: "وبلاگ",
    link: "/weblog",
    icon: <FileText className="w-4 h-4 ml-1" />,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, hasHydrated } = useCartStore();
  const [activeDropdown, setActiveDropdown] = useState<"user" | "cart" | null>(
    null
  );
  const [showCategories, setShowCategories] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <>
      <nav
        className="flex items-center justify-between bg-white p-2 md:px-10 shadow-lg sticky top-0 z-50"
        role="navigation"
        aria-label="منوی اصلی سایت کرمان آتاری"
      >
        {/* لوگو */}
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="صفحه اصلی کرمان آتاری"
        >
          <Image
            width={30}
            height={30}
            alt="لوگوی کرمان آتاری"
            src="/atari-seeklogo.svg"
            priority
          />
          <h1 className="text-black font-bold md:text-lg text-base">
            Kerman Atari
          </h1>
        </Link>

        {/* منوی اصلی */}
        <ul className="hidden md:flex text-gray-700 items-center gap-6 relative">
          {menuItems.map((item, i) => (
            <li
              key={i}
              onMouseEnter={() =>
                item.name === "دسته‌بندی‌ها" && setShowCategories(true)
              }
              onMouseLeave={() =>
                item.name === "دسته‌بندی‌ها" && setShowCategories(false)
              }
              className="relative"
            >
              <Link
                href={item.link}
                aria-label={`رفتن به ${item.name}`}
                className={`group flex items-center gap-1 text-sm transition relative
    ${pathname === item.link ? "text-blue-600" : "text-gray-700"}
    hover:text-blue-600
  `}
              >
                {item.icon}
                {item.name}
                {item.name === "دسته‌بندی‌ها" && (
                  <ChevronDown className="w-5 h-5 ml-1" />
                )}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#427D9D] transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {item.name === "دسته‌بندی‌ها" && (
                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 15 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="fixed left-0 w-screen bg-gray-100/95 shadow-xl rounded-b-xl p-5 text-black flex items-center justify-around z-50"
                      onMouseEnter={() => setShowCategories(true)}
                      onMouseLeave={() => setShowCategories(false)}
                    >
                      {categories.map((cat) => (
                        <div key={cat.name}>
                          <h3 className="font-bold text-[#001A6E] mb-2">
                            {cat.name}
                          </h3>
                          <ul className="space-y-1">
                            {cat.subcategories.map((sub) => (
                              <li key={sub.slug}>
                                <Link
                                  href={`/products/${cat.slug}/${sub.slug}`}
                                  className="text-sm hover:text-blue-600 transition"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </li>
          ))}
        </ul>

        {/* نوار جستجو */}
        <div className="items-center lg:w-[20vw] hidden lg:flex bg-white rounded-md px-2 shadow-inner">
          <input
            className="bg-transparent flex-1 p-1 text-black outline-none text-sm"
            placeholder="جستجو در محصولات..."
            type="search"
            aria-label="جستجو در محصولات"
          />
          <Search className="text-black w-4 h-4" />
        </div>

        {/* کاربر و سبد خرید */}
        <div className="flex items-center gap-1 md:gap-4 relative">
          {hasHydrated && session ? (
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("user")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className=" items-center gap-2 cursor-pointer hidden md:flex">
                <span className=" text-sm text-black">
                  {session.user?.name || "کاربر"}
                </span>
                <ChevronDown className="text-black w-4 h-4" />
              </div>

              <AnimatePresence>
                {activeDropdown === "user" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="absolute left-0 top-10 w-48 bg-white shadow-lg rounded-xl border border-gray-200 p-3 z-50"
                  >
                    {session.user && session.user.role === "user" ? (
                      <>
                        <Link
                          href="/my-profile"
                          className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition text-sm py-2"
                        >
                          <User className="w-4 h-4" /> پروفایل من
                        </Link>
                        <Link
                          href="/my-profile"
                          className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition text-sm py-2"
                        >
                          <User className="w-4 h-4" /> سفارش ها
                        </Link>
                        <Link
                          href="/my-profile?step=2"
                          className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition text-sm py-2"
                        >
                          <User className="w-4 h-4" /> لیست علاقه مندی ها
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition text-sm py-2"
                      >
                        <User className="w-4 h-4" /> داشبورد
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left flex items-center gap-2 text-red-600 hover:text-red-700 transition text-sm py-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                        />
                      </svg>
                      خروج از حساب
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/auth/login" aria-label="ورود به حساب کاربری">
              <User className="text-black w-5 h-5 hover:text-[#427D9D] transition" />
            </Link>
          )}

          {/* سبد خرید */}
          <Link href="/cart">
            <div
              className="flex items-center gap-1 relative cursor-pointer"
              onMouseEnter={() => setActiveDropdown("cart")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <ShoppingBag className="text-black w-5 h-5" />
              {cart.length > 0 && (
                <span
                  className="text-black text-xs mr-2 flex items-center"
                  aria-live="polite"
                >
                  {cart.length} کالا <ChevronDown className="ml-1 w-3 h-3" />
                </span>
              )}
              <AnimatePresence>
                {activeDropdown === "cart" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="absolute left-0 top-10 w-80 p-4 rounded-xl bg-white shadow-xl z-50 border border-gray-200"
                  >
                    {cart.length > 0 ? (
                      <>
                        <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                          {cart.map((item: CartItem) => (
                            <div
                              key={item.sku}
                              className="mb-3 flex items-center gap-3 border-b border-gray-200 pb-2 last:border-b-0"
                            >
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={60}
                                height={60}
                                className="rounded-md object-cover"
                                loading="lazy"
                              />
                              <div className="flex flex-col flex-1">
                                <h3 className="text-sm font-semibold text-gray-800 truncate">
                                  {item.title}
                                </h3>
                                <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                                  <span>{item.quantity} عدد</span>
                                  <span>
                                    {item.price.toLocaleString()} تومان
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <button
                            onClick={() => router.push("/cart")}
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 rounded-xl transition-all"
                          >
                            مشاهده سبد خرید
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600 text-sm text-center">
                        سبد خرید خالی است
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Link>
          {/* منوی موبایل */}
          <button
            className="md:hidden text-black"
            onClick={() => setMobileMenuOpen(true)}
            title="Open_Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        {status !== "loading" && session?.user && session && (
          <MobileMenu
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            menuItems={menuItems}
            categories={categories}
            user={session.user}
          />
        )}
      </nav>
    </>
  );
}
