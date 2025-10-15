/*
  Warnings:

  - You are about to drop the column `authorId` on the `Document` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_authorId_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "authorId",
ADD COLUMN     "pdfName" TEXT,
ADD COLUMN     "pdfSize" INTEGER;
