-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "entity" TEXT NOT NULL,
    "permission" INTEGER NOT NULL,
    CONSTRAINT "user_permissions_role_fkey" FOREIGN KEY ("role") REFERENCES "roles" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_user_permissions" ("entity", "id", "permission", "role") SELECT "entity", "id", "permission", "role" FROM "user_permissions";
DROP TABLE "user_permissions";
ALTER TABLE "new_user_permissions" RENAME TO "user_permissions";
CREATE INDEX "user_permissions_role_idx" ON "user_permissions"("role");
CREATE INDEX "user_permissions_entity_idx" ON "user_permissions"("entity");
CREATE UNIQUE INDEX "user_permissions_role_entity_key" ON "user_permissions"("role", "entity");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "theme" TEXT NOT NULL DEFAULT 'light',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_role_fkey" FOREIGN KEY ("role") REFERENCES "roles" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_users" ("created_at", "email", "id", "locale", "name", "password", "role", "theme") SELECT "created_at", "email", "id", "locale", "name", "password", "role", "theme" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "roles_key_key" ON "roles"("key");

-- CreateIndex
CREATE INDEX "roles_key_idx" ON "roles"("key");
