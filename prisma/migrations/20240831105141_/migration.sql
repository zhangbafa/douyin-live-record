/*
  Warnings:

  - You are about to alter the column `fps` on the `PushStream` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
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
    "output_w" INTEGER NOT NULL,
    "output_h" INTEGER NOT NULL,
    "sampling_rate" TEXT NOT NULL,
    "audiobps" TEXT NOT NULL,
    "push_datetime_range" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "secret_key" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PushStream" ("address", "audiobps", "createdAt", "fps", "id", "is_enabled", "keyframe", "name", "output_h", "output_w", "push_datetime_range", "sampling_rate", "secret_key", "setting", "updatedAt", "videobps") SELECT "address", "audiobps", "createdAt", "fps", "id", "is_enabled", "keyframe", "name", "output_h", "output_w", "push_datetime_range", "sampling_rate", "secret_key", "setting", "updatedAt", "videobps" FROM "PushStream";
DROP TABLE "PushStream";
ALTER TABLE "new_PushStream" RENAME TO "PushStream";
CREATE TABLE "new_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "duration" REAL NOT NULL,
    "bitrate" INTEGER NOT NULL,
    "videoCodec" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "fps" TEXT NOT NULL,
    "thumb" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "pushStreamId" INTEGER NOT NULL,
    CONSTRAINT "Video_pushStreamId_fkey" FOREIGN KEY ("pushStreamId") REFERENCES "PushStream" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("bitrate", "duration", "fileName", "fileSize", "fps", "height", "id", "path", "pushStreamId", "thumb", "videoCodec", "width") SELECT "bitrate", "duration", "fileName", "fileSize", "fps", "height", "id", "path", "pushStreamId", "thumb", "videoCodec", "width" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
