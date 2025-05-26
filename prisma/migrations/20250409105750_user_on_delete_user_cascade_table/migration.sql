-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_userId_fkey";

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
