import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
  }
  try {
    const mobile = session.user.mobile;

    if (!mobile) {
      return NextResponse.json(
        { error: "شماره موبایل ارسال نشده" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { mobile },
    });

    if (!user) {
      return NextResponse.json(
        { error: "کاربری با این شماره موبایل یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("خطا در دریافت کاربر:", err);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.mobile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    await prisma.user.update({
      where: { mobile: session.user.mobile },
      data: {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        gender: data.gender,
        birthday: data.birthday,
        nationalCode: data.nationalCode,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
