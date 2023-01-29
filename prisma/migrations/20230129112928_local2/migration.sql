/*
  Warnings:

  - You are about to drop the `LocalModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LocalName` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LocalModel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LocalName";
PRAGMA foreign_keys=on;
