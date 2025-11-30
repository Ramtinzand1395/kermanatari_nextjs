// app/api/favorites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
    }

    // فرض: session.user.id موجود است (string یا number)
    const userId = Number((session.user as any).id);
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "شناسه کاربر نامعتبر است" }, { status: 400 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    // برگردوندن لیست کامل علاقه‌مندی‌ها به همراه اطلاعات محصول
    return NextResponse.json(favorites);
  } catch (err) {
    console.error("GET /api/favorites error:", err);
    return NextResponse.json({ error: "خطا در دریافت علاقه‌مندی‌ها" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
    }

    const userId = Number((session.user as any).id);
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "شناسه کاربر نامعتبر است" }, { status: 400 });
    }

    const body = await req.json();
    const productId = Number(body.productId);
    if (!productId || isNaN(productId)) {
      return NextResponse.json({ error: "productId الزامی است" }, { status: 400 });
    }

    // جلوگیری از ثبت دوباره (unique در مدل هم هست)
    const exists = await prisma.favorite.findFirst({ where: { userId, productId } });
    if (exists) {
      return NextResponse.json({ message: "این محصول قبلاً در علاقه‌مندی‌ها ثبت شده است" }, { status: 200 });
    }

    const newFav = await prisma.favorite.create({
      data: { userId, productId },
      include: { product: true },
    });

    return NextResponse.json(newFav, { status: 201 });
  } catch (err) {
    console.error("POST /api/favorites error:", err);
    return NextResponse.json({ error: "خطا در ثبت علاقه‌مندی" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
    }

    const userId = Number((session.user as any).id);
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "شناسه کاربر نامعتبر است" }, { status: 400 });
    }

    // در DELETE بدنه JSON با { productId } دریافت می‌کنیم
    const body = await req.json();
    const productId = Number(body.productId);
    if (!productId || isNaN(productId)) {
      return NextResponse.json({ error: "productId الزامی است" }, { status: 400 });
    }

    await prisma.favorite.deleteMany({
      where: { userId, productId },
    });

    return NextResponse.json({ message: "با موفقیت حذف شد" });
  } catch (err) {
    console.error("DELETE /api/favorites error:", err);
    return NextResponse.json({ error: "خطا در حذف علاقه‌مندی" }, { status: 500 });
  }
}
