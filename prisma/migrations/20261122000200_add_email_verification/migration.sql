-- Existing accounts predate email verification and remain trusted.
ALTER TABLE `User` ADD COLUMN `emailVerifiedAt` DATETIME(3) NULL;

UPDATE `User`
SET `emailVerifiedAt` = CURRENT_TIMESTAMP(3)
WHERE `emailVerifiedAt` IS NULL;

-- Each user can have only one active email verification code.
CREATE TABLE `EmailVerificationCode` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `codeHash` CHAR(64) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `EmailVerificationCode_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `EmailVerificationCode`
ADD CONSTRAINT `EmailVerificationCode_userId_fkey`
FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;
