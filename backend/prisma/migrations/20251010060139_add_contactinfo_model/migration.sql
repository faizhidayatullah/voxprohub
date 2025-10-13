-- CreateTable
CREATE TABLE `ContactInfo` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'singleton',
    `whatsapp` VARCHAR(191) NOT NULL,
    `waMessage` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
