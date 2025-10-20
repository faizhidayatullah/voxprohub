-- CreateTable
CREATE TABLE `LandingContent` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'landing',
    `heroTitle` VARCHAR(191) NOT NULL,
    `heroSubtitle` VARCHAR(191) NOT NULL,
    `heroImage` VARCHAR(191) NULL,
    `visiTitle` VARCHAR(191) NULL,
    `visiText` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
