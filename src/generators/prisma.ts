import { dbLocation, prismaDialectMap, prismaSchemaLocation } from "src/config";
import {
    appendExistsFile,
    concatFileExtension,
    fireShell,
    generateFile,
} from "src/utils";
import type { ProjectConfig, GenerateFileArgs } from "src/types";

const prismaConnectionDatabasesList: Record<
    ProjectConfig["database"],
    (db: ProjectConfig["database"]) => string
> = {
    mysql: prismaMysqlMariadbConnection,
    mariadb: prismaMysqlMariadbConnection,
    postgres: prismaPostgresConnection,
    mongodb: prismaMongodbConnection,
};

export async function setupPrisma(config: ProjectConfig) {
    const { databaseType, database, language } = config;

    const prismaSchema =
        databaseType === "sql" ? prismaSqlSchema : prismaNoSqlSchema;

    await initializePrisma(database);
    await appendExistsFile({
        fileLocation: prismaSchemaLocation,
        fileContent: prismaSchema(),
    });

    const [dbPath] = concatFileExtension(language, dbLocation);
    const prismaConnectionGenerator = prismaConnectionDatabasesList[database];

    const prisma: GenerateFileArgs[] = [
        {
            fileLocation: dbPath!,
            fileContent: prismaConnectionGenerator(database),
        },
    ];

    await Promise.all(
        prisma.map(async (config) => await generateFile({ ...config })),
    );

    await fireShell("npx prisma generate");
}

function prismaSqlSchema() {
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

function prismaNoSqlSchema() {
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

async function initializePrisma(db: ProjectConfig["database"]) {
    try {
        const provider = db !== "mariadb" ? prismaDialectMap[db] : "mysql";
        const prismaCli = `npx prisma init --datasource-provider ${provider} --output ../src/generated/prisma`;
        await fireShell(prismaCli);
    } catch {
        throw new Error("Failed to generate Prisma config");
    }
}

function prismaMysqlMariadbConnection(db: ProjectConfig["database"]) {
    const prefix = db === "mysql" ? "MYSQL_" : "MARIADB_";

    return `
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaMariaDb({
  host: process.env.${prefix}HOST,
  user: process.env.${prefix}USER,
  password: process.env.${prefix}PASSWORD,
  database: process.env.${prefix}DATABASE,
  connectionLimit: 5,
});

export const prisma = new PrismaClient({ adapter });
`;
}

function prismaPostgresConnection(_db: ProjectConfig["database"]) {
    return `
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
`;
}

function prismaMongodbConnection(_db: ProjectConfig["database"]) {
    return `
import { PrismaClient } from "../generated/prisma/client.js";
export const prisma = new PrismaClient();
`;
}
