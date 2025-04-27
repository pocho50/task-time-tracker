/*
  Warnings:

  - You are about to drop the column `user_id` on the `user_permissions` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "entity" TEXT NOT NULL,
    "permission" INTEGER NOT NULL
);
INSERT INTO "new_user_permissions" ("entity", "id", "permission") SELECT "entity", "id", "permission" FROM "user_permissions";
DROP TABLE "user_permissions";
ALTER TABLE "new_user_permissions" RENAME TO "user_permissions";
CREATE INDEX "user_permissions_role_idx" ON "user_permissions"("role");
CREATE INDEX "user_permissions_entity_idx" ON "user_permissions"("entity");
CREATE UNIQUE INDEX "user_permissions_role_entity_key" ON "user_permissions"("role", "entity");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
