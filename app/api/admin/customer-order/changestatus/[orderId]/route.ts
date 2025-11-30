
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import moment from "moment-jalaali";

moment.loadPersian({ usePersianDigits: false });

// Helper برای نام کنسول به فارسی
function getPersianConsoleName(consoleType?: string) {
  if (!consoleType) return "";
  if (consoleType === "ps4" || consoleType === "copy") return "پلی استیشن ۴";
  if (consoleType === "ps5") return "پلی استیشن ۵";
  if (consoleType.toLowerCase() === "xbox") return "ایکس باکس";
  return consoleType;
}

// Helper تبدیل اعداد به فارسی
function toPersianDigits(str: string) {
  return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
}

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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await req.json();
    const { status, sendSms = true } = body; // sendSms پیش‌فرض true هست

    const numericOrderId = Number(orderId);
    if (isNaN(numericOrderId)) {
      return NextResponse.json({ message: "Order ID invalid" }, { status: 400 });
    }

    const order = await prisma.customerOrder.findUnique({
      where: { id: numericOrderId },
      include: { customer: true },
    });

    if (!order)
      return NextResponse.json({ message: "سفارشی پیدا نشد." }, { status: 400 });

    let deliveryDate: string | null = null;
    if (status === "تحویل به مشتری") {
      deliveryDate = moment().format("jYYYY/jMM/jDD HH:mm");
    }

    const updated = await prisma.customerOrder.update({
      where: { id: numericOrderId },
      data: {
        deliveryStatus: status,
        deliveryDate: deliveryDate ?? undefined,
      },
      include: { customer: true },
    });

    let smsResponse = null;
    if (sendSms) {
      const persianConsole = getPersianConsoleName(updated.consoleType);
      if (status === "آماده") {
        smsResponse = await senSMS({
          bodyId: 332452,
          to: updated.customer.mobile,
          args: [
            updated.customer.sex === "مرد" ? "جناب آقای" : "سرکار خانم",
            updated.customer.lastName,
            toPersianDigits(updated.deliveryCode),
          ],
        });
      } else if (status === "تحویل به مشتری") {
        smsResponse = await senSMS({
          bodyId: 323178,
          to: updated.customer.mobile,
          args: [
            updated.customer.sex === "مرد" ? "جناب آقای" : "سرکار خانم",
            updated.customer.lastName,
            persianConsole,
            toPersianDigits(deliveryDate || ""),
          ],
        });
      }
    }

    return NextResponse.json({
      message: "سفارش تغییر کرد.",
      Data: updated,
      sms: smsResponse,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
