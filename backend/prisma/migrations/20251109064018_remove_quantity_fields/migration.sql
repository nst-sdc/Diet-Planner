/*
  Warnings:

  - You are about to drop the column `base_quantity` on the `logged_meals` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `logged_meals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `logged_meals` DROP COLUMN `base_quantity`,
    DROP COLUMN `quantity`;
