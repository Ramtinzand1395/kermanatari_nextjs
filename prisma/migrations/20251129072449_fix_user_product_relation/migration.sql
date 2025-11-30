-- CreateTable
CREATE TABLE "customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT 'کاربر بی نام',
    "mobile" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "birthday" TEXT,
    "description" TEXT,
    "persianDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "customer_orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "list" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "description" TEXT,
    "consoleType" TEXT NOT NULL,
    "deliveryStatus" TEXT DEFAULT 'دریافت از مشتری',
    "persianDate" TEXT,
    "deliveryDate" TEXT NOT NULL DEFAULT 'تحویل داده نشده',
    "deliveryCode" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "customer_orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_mobile_key" ON "customers"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "customer_orders_deliveryCode_key" ON "customer_orders"("deliveryCode");
