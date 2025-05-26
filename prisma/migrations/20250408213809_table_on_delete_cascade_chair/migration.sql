-- DropForeignKey
ALTER TABLE "Chair" DROP CONSTRAINT "Chair_tableId_fkey";

-- AddForeignKey
ALTER TABLE "Chair" ADD CONSTRAINT "Chair_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE CASCADE ON UPDATE CASCADE;
