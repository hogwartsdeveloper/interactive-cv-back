-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "UserModel" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "UserModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalModel" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "LocalModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalName" (
    "id" SERIAL NOT NULL,
    "en" TEXT NOT NULL,
    "kz" TEXT NOT NULL,
    "ru" TEXT NOT NULL,
    "localId" INTEGER NOT NULL,

    CONSTRAINT "LocalName_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocalName_localId_key" ON "LocalName"("localId");

-- AddForeignKey
ALTER TABLE "LocalName" ADD CONSTRAINT "LocalName_localId_fkey" FOREIGN KEY ("localId") REFERENCES "LocalModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
