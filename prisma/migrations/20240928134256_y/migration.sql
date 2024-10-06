/*
  Warnings:

  - You are about to drop the column `is_enabled` on the `PushStream` table. All the data in the column will be lost.
  - You are about to drop the column `output_h` on the `PushStream` table. All the data in the column will be lost.
  - You are about to drop the column `output_w` on the `PushStream` table. All the data in the column will be lost.
  - You are about to drop the column `push_datetime_range` on the `PushStream` table. All the data in the column will be lost.
  - You are about to drop the column `sampling_rate` on the `PushStream` table. All the data in the column will be lost.
  - You are about to drop the column `secret_key` on the `PushStream` table. All the data in the column will be lost.
  - Added the required column `outputh` to the `PushStream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputw` to the `PushStream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pushDatetimeRange` to the `PushStream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `samplingRate` to the `PushStream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secretKey` to the `PushStream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `PushStream` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Workspace" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PushStream" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "setting" TEXT NOT NULL,
    "fps" INTEGER NOT NULL,
    "videobps" INTEGER NOT NULL,
    "keyframe" INTEGER NOT NULL,
    "outputw" INTEGER NOT NULL,
    "outputh" INTEGER NOT NULL,
    "samplingRate" TEXT NOT NULL,
    "audiobps" TEXT NOT NULL,
    "pushDatetimeRange" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "workspaceId" INTEGER NOT NULL,
    "quickAccess" BOOLEAN NOT NULL DEFAULT false,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccessTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PushStream_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PushStream" ("address", "audiobps", "createdAt", "fps", "id", "keyframe", "name", "setting", "updatedAt", "videobps") SELECT "address", "audiobps", "createdAt", "fps", "id", "keyframe", "name", "setting", "updatedAt", "videobps" FROM "PushStream";
DROP TABLE "PushStream";
ALTER TABLE "new_PushStream" RENAME TO "PushStream";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
