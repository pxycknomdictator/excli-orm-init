import { prismaDialectMap, prismaSchemaLocation } from "src/config";
import { appendExistsFile, fireShell } from "src/utils";
import type { ProjectConfig } from "src/types";

export async function setupPrisma(config: ProjectConfig) {
    const { databaseType } = config;

    const prismaSchema =
        databaseType === "sql" ? prismaSqlSchema : prismaNoSqlSchema;

    await initializePrisma(config.database);
    await appendExistsFile({
        fileLocation: prismaSchemaLocation,
        fileContent: prismaSchema(),
    });
}

export function prismaSqlSchema() {
    return `model User {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(255)
  age       Int
  email     String   @unique @db.VarChar(255)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
`;
}

export function prismaNoSqlSchema() {
    return `model User {
  id        String @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  age       Int
  email     String   @unique
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
`;
}

export async function initializePrisma(db: ProjectConfig["database"]) {
    try {
        const database = db !== "mariadb" ? prismaDialectMap[db] : "mysql";
        const prismaCli = `npx prisma init --datasource-provider ${database} --output ../src/generated/prisma`;
        await fireShell(prismaCli);
    } catch (error) {
        throw new Error("failed to generate prisma config");
    }
}
