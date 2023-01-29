-- CreateTable
CREATE TABLE "LocalModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LocalName" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "en" TEXT NOT NULL,
    "kz" TEXT NOT NULL,
    "ru" TEXT NOT NULL,
    "localId" INTEGER NOT NULL,
    CONSTRAINT "LocalName_localId_fkey" FOREIGN KEY ("localId") REFERENCES "LocalModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LocalName_localId_key" ON "LocalName"("localId");
