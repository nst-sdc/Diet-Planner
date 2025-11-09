-- AlterTable
ALTER TABLE `logged_meals` ADD COLUMN `base_quantity` DOUBLE NOT NULL DEFAULT 100,
    ADD COLUMN `quantity` DOUBLE NOT NULL DEFAULT 100;
