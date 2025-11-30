// app/api/profile/update-password/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.mobile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "تمامی فیلدها الزامی هستند" }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "رمز جدید با تایید مطابقت ندارد" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { mobile: session.user.mobile },
    });

    if (!user?.password) {
      return NextResponse.json({ error: "امکان تغییر رمز وجود ندارد" }, { status: 400 });
    }

    const isCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isCorrect) {
      return NextResponse.json({ error: "رمز فعلی اشتباه است" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return NextResponse.json({
      success: true,
      message: "رمز عبور با موفقیت تغییر کرد",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
