// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// export async function DELETE(
//   req: Request,
//   context: { params:{ id: string } }
// ) {
//     const session = await getServerSession(authOptions);
  
//     if (!session?.user) {
//       return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
//     }
  
//     // فقط superadmin می‌تواند کاربران را ببیند
//     if (session.user.role !== "superadmin") {
//       return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
//     }
//   try {
//     console.log("first")
//     const { id } =  context.params; // ✅ await اضافه شد
//     console.log(id,"ID")
//     const categoryId = parseInt(id);

//     await prisma.category.delete({
//       where: { id: categoryId },
//     });

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "خطا در حذف دسته" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // در Next.js 16 params یک Promise است
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
    }

    if (session.user.role !== "superadmin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    // دسترسی به id با await
    const { id } = await context.params;

    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "آی‌دی نامعتبر است" }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطا در حذف دسته" }, { status: 500 });
  }
}
