-- CreateTable
CREATE TABLE "PushStream" (
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

-- CreateTable
CREATE TABLE "Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pushStreamId" INTEGER NOT NULL,
    CONSTRAINT "Video_pushStreamId_fkey" FOREIGN KEY ("pushStreamId") REFERENCES "PushStream" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
