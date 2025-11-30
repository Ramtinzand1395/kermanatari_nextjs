import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import moment from "moment-jalaali";

moment.loadPersian({ usePersianDigits: false });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mobile = searchParams.get("mobile");

  if (!mobile)
    return NextResponse.json(
      { message: "موبایل ارسال نشده." },
      { status: 400 }
    );

  const customer = await prisma.customer.findUnique({ where: { mobile } });
  if (!customer)
    return NextResponse.json({ message: "خریدار پیدا نشد." }, { status: 404 });

  return NextResponse.json({ message: "خریدار پیدا شد.", data: customer });
}

export async function POST(req: Request) {
  const body = await req.json();
  let { name } = body;
  const { mobile, lastName, sex, birthday, description } = body;
  if (!mobile)
    return NextResponse.json(
      { message: "موبایل اجباری است." },
      { status: 400 }
    );

  const exists = await prisma.customer.findUnique({ where: { mobile } });
  if (!name || name.trim() === "") name = "کاربر بی نام";

  if (exists) {
    const customerId = exists.id;
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!existingCustomer)
      return NextResponse.json({ message: "کاربر پیدا نشد." }, { status: 404 });

    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: { name, mobile, lastName, sex, birthday, description },
    });

    return NextResponse.json({
      message: "خریدار ویرایش شد.",
      data: updatedCustomer,
    });
  } else {
    const customer = await prisma.customer.create({
      data: {
        name,
        mobile,
        lastName,
        sex,
        birthday,
        description,
        persianDate: moment().format("jYYYY/jMM/jDD HH:mm"),
      },
    });

    return NextResponse.json(
      { message: "خریدار اضافه شد.", data: customer },
      { status: 201 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, lastName, mobile, sex, birthday, description } = body;
    if (!mobile) {
      return NextResponse.json(
        { message: "موبایل اجباری است." },
        { status: 400 }
      );
    }
    // ویرایش مشتری موجود
    const customer = await prisma.customer.update({
      where: { id },
      data: { name, lastName, mobile, sex, birthday, description },
    });
    return NextResponse.json({ message: "خریدار ویرایش شد.", data: customer });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { message: "خطا در ذخیره اطلاعات مشتری." },
      { status: 500 }
    );
  }
}
