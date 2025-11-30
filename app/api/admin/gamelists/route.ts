// app/api/gamelistitem/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
interface GameListItem {
  id: number;
  name: string;
}

interface GameList {
  platform: string;
  id: number;
  items: GameListItem[];
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const platform = url.searchParams.get("platform"); // مثلا "playstation"

    let gameLists;
    if (platform) {
      gameLists = await prisma.gameList.findMany({
        where: { platform },
        include: { items: true }, // آیتم‌های هر gamelist را می‌آورد
      });
    } else {
      gameLists = await prisma.gameList.findMany({
        include: { items: true },
      });
    }

    // می‌توانیم همه آیتم‌ها را flat کنیم و برگردانیم
    const allItems = gameLists.flatMap((list: GameList) =>
      list.items.map((item) => ({
        id: item.id,
        name: item.name,
        gameListId: list.id,
        platform: list.platform,
      }))
    );

    return NextResponse.json(allItems);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

// اضافه کردن آیتم جدید
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newItem = await prisma.gameListItem.create({
      data: {
        name: body.name,
        gameListId: Number(body.gameListId),
      },
    });
    return NextResponse.json(newItem);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to create item" },
      { status: 500 }
    );
  }
}
