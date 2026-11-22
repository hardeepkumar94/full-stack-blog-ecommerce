CREATE TABLE `Order` (
  `id` VARCHAR(191) NOT NULL,
  `orderNumber` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `status` ENUM('PLACED', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PLACED',
  `paymentMethod` VARCHAR(20) NOT NULL DEFAULT 'COD',
  `totalCents` INTEGER NOT NULL,
  `customerName` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `addressLine` TEXT NOT NULL,
  `city` VARCHAR(191) NOT NULL,
  `postalCode` VARCHAR(20) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `Order_orderNumber_key`(`orderNumber`),
  INDEX `Order_userId_createdAt_idx`(`userId`, `createdAt`),
  INDEX `Order_status_idx`(`status`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `OrderItem` (
  `id` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `productName` VARCHAR(191) NOT NULL,
  `unitPriceCents` INTEGER NOT NULL,
  `quantity` INTEGER NOT NULL,
  INDEX `OrderItem_orderId_idx`(`orderId`),
  INDEX `OrderItem_productId_idx`(`productId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey`
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey`
  FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey`
  FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
