import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

// GET
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
  }

  // فقط superadmin می‌تواند کاربران را ببیند
  if (session.user.role !== "superadmin") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }
  try {
    const categories = await prisma.category.findMany({
      include: { parent: true },
      orderBy: { id: "desc" },
    });
    return NextResponse.json(categories);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "مشکل در دریافت دسته‌ها" },
      { status: 500 }
    );
  }
}

// POST
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
  }

  // فقط superadmin می‌تواند کاربران را ببیند
  if (session.user.role !== "superadmin") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        parentId: body.parentId || null,
      },
    });
    return NextResponse.json(category);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "ایجاد دسته با خطا مواجه شد" },
      { status: 500 }
    );
  }
}
