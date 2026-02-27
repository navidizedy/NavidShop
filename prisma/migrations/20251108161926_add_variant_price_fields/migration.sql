/*
  Warnings:

  - You are about to drop the column `discount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `oldPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "discount",
DROP COLUMN "oldPrice",
DROP COLUMN "price";

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "oldPrice" DOUBLE PRECISION,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0;
