// app/api/comments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, text, rating } = body;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
    }
    if (!productId || !text)
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });

    const comment = await prisma.comment.create({
      data: {
        text,
        rating: rating || 5,
        productId,
        userId: Number(session?.user?.id), // (در پروژه واقعی مقدار را از توکن استخراج می‌کنی)
      },
    });

    return NextResponse.json(
      { message: "کامنت با موفقیت ثبت شد", comment },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "خطا در ثبت کامنت" }, { status: 500 });
  }
}
