/*
  Warnings:

  - You are about to drop the column `batchCode` on the `Batch` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `Batch` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Batch` table. All the data in the column will be lost.
  - You are about to drop the column `productionDate` on the `Batch` table. All the data in the column will be lost.
  - You are about to drop the `BatchLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Batch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Batch" DROP CONSTRAINT "Batch_productId_fkey";

-- DropForeignKey
ALTER TABLE "BatchLog" DROP CONSTRAINT "BatchLog_batchId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_productId_fkey";

-- AlterTable
ALTER TABLE "Batch" DROP COLUMN "batchCode",
DROP COLUMN "expiryDate",
DROP COLUMN "productId",
DROP COLUMN "productionDate",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "BatchLog";

-- DropTable
DROP TABLE "Inventory";
