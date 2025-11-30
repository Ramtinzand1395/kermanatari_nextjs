import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
  
    if (!session?.user) {
      return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
    }
  
    // فقط superadmin می‌تواند کاربران را ببیند
    if (session.user.role !== "superadmin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }
  try {
    const { id } = await context.params; // ✅ await اضافه شد
    const categoryId = parseInt(id);

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطا در حذف دسته" }, { status: 500 });
  }
}
