// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const users = await prisma.user.findMany({
//       include: {
//         orders: true,
//         comments: true,
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json(users);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return NextResponse.json({ error: "خطا در دریافت کاربران" }, { status: 500 });
//   }
// }

// app/api/users/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
  try {
    // دریافت session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
    }

    // فقط superadmin می‌تواند کاربران را ببیند
    if (session.user.role !== "superadmin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (err) {
    console.error("خطا در دریافت کاربران:", err);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
