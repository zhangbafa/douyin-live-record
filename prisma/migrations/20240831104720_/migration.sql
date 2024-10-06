-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PushStream" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "setting" TEXT NOT NULL,
    "fps" TEXT NOT NULL,
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
