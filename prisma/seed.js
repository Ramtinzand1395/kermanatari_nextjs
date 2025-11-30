import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

async function main() {
  // مسیر فایل JSON نسبت به فولدر prisma
  const filePath = path.resolve('./prisma/test.gamelists.json');

  // خواندن فایل JSON
  const gamelists = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  for (const list of gamelists) {
    // ساخت GameList
    const createdList = await prisma.gameList.create({
      data: {
        platform: list.platform ?? null
      }
    });

    // ساخت آیتم‌ها برای هر لیست
    for (const item of list.items) {
      await prisma.gameListItem.create({
        data: {
          name: item.name,
          gameListId: createdList.id
        }
      });
    }
  }

  console.log("Seed completed with auto-increment IDs.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });
