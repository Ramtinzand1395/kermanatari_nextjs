import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      name,
      lastName,
      email,
      mobile,
      password,
      confirmPassword,
      newsletter,
    } = await req.json();

    // ولیدیشن اولیه
    if (!name || !lastName || !email || !mobile || !password) {
      return NextResponse.json(
        { message: "لطفاً همه فیلدها را تکمیل کنید" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "رمز عبور و تکرار آن یکسان نیست" },
        { status: 400 }
      );
    }

    // چک ایمیل
    const emailExists = await prisma.user.findUnique({
      where: { email },
    });
    if (emailExists) {
      return NextResponse.json(
        { message: "کاربری با این ایمیل وجود دارد" },
        { status: 400 }
      );
    }

    // چک موبایل
    const mobileExists = await prisma.user.findUnique({
      where: { mobile },
    });
    if (mobileExists) {
      return NextResponse.json(
        { message: "کاربری با این شماره موبایل وجود دارد" },
        { status: 400 }
      );
    }

    // هش رمز
    const hashedPassword = await bcrypt.hash(password, 10);

    // ساخت کاربر
    const user = await prisma.user.create({
      data: {
        name,
        lastName,
        email,
        mobile,
        newsletter,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "ثبت‌نام با موفقیت انجام شد 🎉", user },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "خطا در ثبت‌نام" }, { status: 500 });
  }
}


