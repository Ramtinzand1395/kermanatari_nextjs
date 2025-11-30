// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import moment from "moment-jalaali";

// interface CustomerOrderWithList {
//   id: number;
//   list: string;
//   deliveryStatus: string | null;
//   consoleType: string | null;
//   customer: {
//     mobile: string;
//     lastName: string;
//     sex: string;
//   };
//   [key: string]: unknown; // برای سایر فیلدها بدون any
// }

// moment.loadPersian({ usePersianDigits: false });

// const generateRandomCode = () => Math.floor(10000 + Math.random() * 90000);

// // تابع ارسال پیامک
// async function senSMS({
//   bodyId,
//   to,
//   args,
// }: {
//   bodyId: number;
//   to: string;
//   args: string[];
// }) {
//   const url =
//     "https://console.melipayamak.com/api/send/shared/cba17fa6705a4348b2e2d10279cf3fb9";
//   const payload = { bodyId, to, args };
//   const res = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json; charset=UTF-8" },
//     body: JSON.stringify(payload),
//   });
//   const text = await res.text();
//   return { status: res.status, body: text };
// }

// // Helper برای تبدیل اعداد به فارسی
// function toPersianDigits(str: string) {
//   return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
// }

// // Helper برای نام کنسول به فارسی
// function getPersianConsoleName(consoleType?: string) {
//   if (!consoleType) return "";
//   if (consoleType === "ps4" || consoleType === "copy") return "پلی استیشن ۴";
//   if (consoleType === "ps5") return "پلی استیشن ۵";
//   if (consoleType.toLowerCase() === "xbox") return "ایکس باکس";
//   return consoleType;
// }

// export async function GET() {
//   const orders = await prisma.customerOrder.findMany({
//     where: {
//       NOT: {
//         deliveryStatus: "تحویل به مشتری",
//       },
//     },
//     include: { customer: true },
//   });

//   const parsedOrders = orders.map((o:CustomerOrderWithList) => ({ ...o, list: JSON.parse(o.list) }));

//   const groupedOrders: Record<string, typeof parsedOrders> = {};
//   parsedOrders.forEach((order) => {
//     const key = order.consoleType;
//     if (!groupedOrders[key]) groupedOrders[key] = [];
//     groupedOrders[key].push(order);
//   });

//   return NextResponse.json(groupedOrders);
// }

// export async function POST(req: Request) {
//   const body = await req.json();
//   const { list, price, customerId, description, consoleType, deliveryStatus } =
//     body;

//   const persianDate = moment().format("jYYYY/jMM/jDD HH:mm");

//   // تولید deliveryCode یکتا
//   let isUnique = false;
//   let deliveryCode = "";
//   while (!isUnique) {
//     const code = String(generateRandomCode());
//     const existing = await prisma.customerOrder.findUnique({
//       where: { deliveryCode: code },
//     });
//     if (!existing) {
//       isUnique = true;
//       deliveryCode = code;
//     }
//   }

//   const order = await prisma.customerOrder.create({
//     data: {
//       list: JSON.stringify(list),
//       price,
//       customerId,
//       description,
//       consoleType,
//       deliveryStatus: deliveryStatus || "دریافت از مشتری",
//       persianDate,
//       deliveryCode,
//     },
//     include: { customer: true },
//   });

//   // ارسال پیامک بعد از ایجاد سفارش
//   const persianConsole = getPersianConsoleName(consoleType);
//   const [datePart, timePart] = persianDate.split(" ");
//   const customer = order.customer;

//   let smsResponse = null;
//   try {
//     smsResponse = await senSMS({
//       bodyId: 323165, // شناسه قالب پیامک
//       to: customer.mobile,
//       args: [
//         customer.sex === "مرد" ? "جناب آقای" : "سرکار خانم",
//         customer.lastName,
//         persianConsole,
//         toPersianDigits(datePart),
//         toPersianDigits(timePart),
//       ],
//     });
//   } catch (err) {
//     console.error("خطا در ارسال پیامک:", err);
//   }

//   return NextResponse.json(
//     { message: "سفارش ایجاد شد.", Data: order, sms: smsResponse },
//     { status: 201 }
//   );
// }

// todo
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import moment from "moment-jalaali";

interface CustomerOrderWithList {
  id: number;
  list: string;
  deliveryStatus: string | null;
  consoleType: string | null;
  customer: {
    mobile: string;
    lastName: string;
    sex: string;
  };
  [key: string]: unknown; // برای سایر فیلدها بدون any
}

moment.loadPersian({ usePersianDigits: false });

const generateRandomCode = () => Math.floor(10000 + Math.random() * 90000);

// تابع ارسال پیامک
async function senSMS({
  bodyId,
  to,
  args,
}: {
  bodyId: number;
  to: string;
  args: string[];
}) {
  const url =
    "https://console.melipayamak.com/api/send/shared/cba17fa6705a4348b2e2d10279cf3fb9";
  const payload = { bodyId, to, args };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

// Helper برای تبدیل اعداد به فارسی
function toPersianDigits(str: string) {
  return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
}

// Helper برای نام کنسول به فارسی
function getPersianConsoleName(consoleType?: string) {
  if (!consoleType) return "";
  if (consoleType === "ps4" || consoleType === "copy") return "پلی استیشن ۴";
  if (consoleType === "ps5") return "پلی استیشن ۵";
  if (consoleType.toLowerCase() === "xbox") return "ایکس باکس";
  return consoleType;
}

export async function GET() {
  const orders = await prisma.customerOrder.findMany({
    where: {
      NOT: {
        deliveryStatus: "تحویل به مشتری",
      },
    },
    include: { customer: true },
  });

  const parsedOrders = orders.map((o) => ({
    ...o,
    list: JSON.parse(o.list),
    deliveryStatus: o.deliveryStatus || "دریافت از مشتری",
    consoleType: o.consoleType || "unknown", // ⚠️ مقدار پیش‌فرض برای null
  }));

  const groupedOrders: Record<string, CustomerOrderWithList[]> = {};

  parsedOrders.forEach((order) => {
    const key = order.consoleType!; // safe because we set a default above
    if (!groupedOrders[key]) groupedOrders[key] = [];
    groupedOrders[key].push(order);
  });

  return NextResponse.json(groupedOrders);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { list, price, customerId, description, consoleType, deliveryStatus } =
    body;

  const persianDate = moment().format("jYYYY/jMM/jDD HH:mm");

  // تولید deliveryCode یکتا
  let isUnique = false;
  let deliveryCode = "";
  while (!isUnique) {
    const code = String(generateRandomCode());
    const existing = await prisma.customerOrder.findUnique({
      where: { deliveryCode: code },
    });
    if (!existing) {
      isUnique = true;
      deliveryCode = code;
    }
  }

  const order = await prisma.customerOrder.create({
    data: {
      list: JSON.stringify(list),
      price,
      customerId,
      description,
      consoleType,
      deliveryStatus: deliveryStatus || "دریافت از مشتری",
      persianDate,
      deliveryCode,
    },
    include: { customer: true },
  });

  // ارسال پیامک بعد از ایجاد سفارش
  const persianConsole = getPersianConsoleName(consoleType);
  const [datePart, timePart] = persianDate.split(" ");
  const customer = order.customer;

  let smsResponse = null;
  try {
    smsResponse = await senSMS({
      bodyId: 323165, // شناسه قالب پیامک
      to: customer.mobile,
      args: [
        customer.sex === "مرد" ? "جناب آقای" : "سرکار خانم",
        customer.lastName,
        persianConsole,
        toPersianDigits(datePart),
        toPersianDigits(timePart),
      ],
    });
  } catch (err) {
    console.error("خطا در ارسال پیامک:", err);
  }

  return NextResponse.json(
    { message: "سفارش ایجاد شد.", Data: order, sms: smsResponse },
    { status: 201 }
  );
}
