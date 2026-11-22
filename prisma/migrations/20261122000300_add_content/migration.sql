CREATE TABLE `Blog` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `imageUrl` VARCHAR(2048) NULL,
  `isPublished` BOOLEAN NOT NULL DEFAULT true,
  `authorId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `Blog_authorId_idx`(`authorId`),
  INDEX `Blog_isPublished_createdAt_idx`(`isPublished`, `createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Product` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `priceCents` INTEGER NOT NULL,
  `imageUrl` VARCHAR(2048) NULL,
  `isPublished` BOOLEAN NOT NULL DEFAULT true,
  `authorId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `Product_authorId_idx`(`authorId`),
  INDEX `Product_isPublished_createdAt_idx`(`isPublished`, `createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Blog` ADD CONSTRAINT `Blog_authorId_fkey`
  FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Product` ADD CONSTRAINT `Product_authorId_fkey`
  FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
