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
    (config: ProjectConfig) => string
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

    await initializePrisma(config);
    await appendExistsFile({
        fileLocation: prismaSchemaLocation,
        fileContent: prismaSchema(),
    });

    const [dbPath] = concatFileExtension(language, dbLocation);
    const prismaConnectionGenerator = prismaConnectionDatabasesList[database];

    const prisma: GenerateFileArgs[] = [
        {
            fileLocation: dbPath!,
            fileContent: prismaConnectionGenerator(config),
        },
    ];

    await Promise.all(
        prisma.map(async (config) => await generateFile({ ...config })),
    );
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

async function initializePrisma(config: ProjectConfig) {
    const { database, language } = config;
    try {
        const provider =
            database !== "mariadb" ? prismaDialectMap[database] : "mysql";
        const isLegacyGeneratorProvider =
            language !== "ts" ? "--generator-provider prisma-client-js" : "";
        const prismaCli = `npx prisma init --datasource-provider ${provider} --output ../src/generated/prisma ${isLegacyGeneratorProvider}`;
        await fireShell(prismaCli);
    } catch {
        throw new Error("Failed to generate Prisma config");
    }
}

function prismaMysqlMariadbConnection(config: ProjectConfig) {
    const { database } = config;

    const prefix = database === "mysql" ? "MYSQL_" : "MARIADB_";

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

function prismaPostgresConnection(config: ProjectConfig) {
    const { language } = config;

    return `
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL${language === "ts" ? "!" : ""};

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
`;
}

function prismaMongodbConnection(_config: ProjectConfig) {
    return `
import { PrismaClient } from "../generated/prisma/client.js";

export const prisma = new PrismaClient();
`;
}
