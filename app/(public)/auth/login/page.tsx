import type { Metadata } from "next";
import LoginPage from "./LoginForm";

export const metadata: Metadata = {
  title: "ورود به حساب کاربری | Kerman Atari",
  description:
    "به حساب کاربری خود در کرمان آتاری وارد شوید و سفارش‌ها، خریدها و اطلاعات حساب خود را مدیریت کنید.",
  robots: {
    index: false, // از ایندکس شدن جلوگیری می‌کند
    follow: false,
  },
  openGraph: {
    title: "ورود به حساب کاربری | Kerman Atari",
    description:
      "به حساب کاربری خود در کرمان آتاری وارد شوید و سفارش‌ها، خریدها و اطلاعات حساب خود را مدیریت کنید.",
    url: "https://kermanatari.ir/auth/login",
    siteName: "Kerman Atari",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ورود به حساب کاربری | Kerman Atari",
    description:
      "صفحه ورود به حساب کاربری در سایت رسمی کرمان آتاری.",
  },
  alternates: {
    canonical: "https://kermanatari.ir/auth/login",
  },
};

export default function Page() {
  return <LoginPage />;
}
