/*
  Warnings:

  - You are about to drop the `UserPermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserPermission";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "permission" INTEGER NOT NULL,
    CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "user_permissions_user_id_idx" ON "user_permissions"("user_id");

-- CreateIndex
CREATE INDEX "user_permissions_entity_idx" ON "user_permissions"("entity");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_user_id_entity_key" ON "user_permissions"("user_id", "entity");
