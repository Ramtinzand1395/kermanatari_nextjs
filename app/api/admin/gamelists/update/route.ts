// app/api/gamelistitem/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const platform = url.searchParams.get("platform"); // مثلا "ps5"
    const page = Number(url.searchParams.get("page") || 1); // صفحه فعلی
    const limit = Number(url.searchParams.get("limit") || 20); // تعداد آیتم در هر صفحه
    const skip = (page - 1) * limit;

    let gameLists;

    if (platform) {
      gameLists = await prisma.gameList.findMany({
        where: { platform },
        include: { items: true },
      });
    } else {
      gameLists = await prisma.gameList.findMany({
        include: { items: true },
      });
    }

    // همه آیتم‌ها را flat می‌کنیم
    const allItems = gameLists.flatMap((list) =>
      list.items.map((item) => ({
        id: item.id,
        name: item.name,
        gameListId: list.id,
        platform: list.platform,
      }))
    );

    // اعمال pagination
    const paginatedItems = allItems.slice(skip, skip + limit);
    const totalPages = Math.ceil(allItems.length / limit);

    return NextResponse.json({
      page,
      limit,
      totalItems: allItems.length,
      totalPages,
      items: paginatedItems,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch items" }, { status: 500 });
  }
}
