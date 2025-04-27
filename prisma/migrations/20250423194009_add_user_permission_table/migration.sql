-- CreateTable
CREATE TABLE "UserPermission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "permission" INTEGER NOT NULL,
    CONSTRAINT "UserPermission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "UserPermission_user_id_idx" ON "UserPermission"("user_id");

-- CreateIndex
CREATE INDEX "UserPermission_entity_idx" ON "UserPermission"("entity");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_user_id_entity_key" ON "UserPermission"("user_id", "entity");
