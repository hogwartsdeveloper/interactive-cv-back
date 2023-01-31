-- DropForeignKey
ALTER TABLE "LocalName" DROP CONSTRAINT "LocalName_localId_fkey";

-- AddForeignKey
ALTER TABLE "LocalName" ADD CONSTRAINT "LocalName_localId_fkey" FOREIGN KEY ("localId") REFERENCES "LocalModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
