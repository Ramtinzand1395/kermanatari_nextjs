import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

// ===== GET Addresses =====
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: Number(session.user.id) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(addresses);
  } catch (err) {
    return NextResponse.json({ error: "خطا در دریافت آدرس‌ها" }, { status: 500 });
  }
}

// ===== POST Add Address =====
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
    }

    const { province, city, address, plaque, unit, postalCode } = await req.json();

    const newAddress = await prisma.address.create({
      data: {
        userId: Number(session.user.id),
        province,
        city,
        address,
        plaque,
        unit,
        postalCode,
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطا در افزودن آدرس" }, { status: 500 });
  }
}

// ===== PUT Update Address =====
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
    }

    const { id, province, city, address, plaque, unit, postalCode } = await req.json();

    const updated = await prisma.address.update({
      where: { id },
      data: { province, city, address, plaque, unit, postalCode },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطا در بروزرسانی آدرس" }, { status: 500 });
  }
}

// ===== DELETE Address =====
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
    }

    const id = Number(req.nextUrl.searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "id الزامی است" }, { status: 400 });

    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ message: "آدرس حذف شد" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطا در حذف آدرس" }, { status: 500 });
  }
}
