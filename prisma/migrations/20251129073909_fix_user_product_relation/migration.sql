-- CreateTable
CREATE TABLE "GameList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "platform" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GameListItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "gameListId" INTEGER NOT NULL,
    CONSTRAINT "GameListItem_gameListId_fkey" FOREIGN KEY ("gameListId") REFERENCES "GameList" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TempPayment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authority" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "items" TEXT NOT NULL,
    "finalPrice" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TempPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TempPayment_authority_key" ON "TempPayment"("authority");

-- CreateIndex
CREATE INDEX "TempPayment_createdAt_idx" ON "TempPayment"("createdAt");
