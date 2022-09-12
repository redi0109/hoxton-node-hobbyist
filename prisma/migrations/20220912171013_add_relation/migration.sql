-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hobby" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Hobby_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Hobby" ("active", "id", "image", "name", "userId") SELECT "active", "id", "image", "name", "userId" FROM "Hobby";
DROP TABLE "Hobby";
ALTER TABLE "new_Hobby" RENAME TO "Hobby";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
