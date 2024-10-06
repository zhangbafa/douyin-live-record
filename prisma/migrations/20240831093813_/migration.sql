/*
  Warnings:

  - Added the required column `bitrate` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fps` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumb` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoCodec` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "duration" REAL NOT NULL,
    "bitrate" INTEGER NOT NULL,
    "videoCodec" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "fps" INTEGER NOT NULL,
    "thumb" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "pushStreamId" INTEGER NOT NULL,
    CONSTRAINT "Video_pushStreamId_fkey" FOREIGN KEY ("pushStreamId") REFERENCES "PushStream" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("id", "pushStreamId") SELECT "id", "pushStreamId" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
