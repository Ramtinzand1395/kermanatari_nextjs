import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "ثبت‌نام در سایت | Kerman Atari",
  description: "با ساخت حساب کاربری جدید در کرمان آتاری از امکانات ویژه بهره‌مند شوید.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <RegisterForm />
      {/* Schema.org structured data برای سئو فنی */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "صفحه ثبت‌نام کاربر",
            description:
              "فرم ثبت‌نام برای ایجاد حساب کاربری جدید در سایت Kerman Atari.",
            url: "https://example.com/auth/register",
          }),
        }}
      />
    </main>
  );
}
