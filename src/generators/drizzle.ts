import {
    dbLocation,
    dialectMap,
    drizzleConfigLocation,
    schemasLocation,
} from "src/config";
import { concatFileExtension, generateFile } from "src/utils";
import type {
    GenerateFileArgs,
    Language,
    ProjectConfig,
    SQL_DATABASE,
} from "src/types";

export async function setupDrizzle(config: ProjectConfig) {
    const { language, database } = config;

    const [drizzlePath, dbPath, schemasPath] = concatFileExtension(
        language,
        drizzleConfigLocation,
        dbLocation,
        schemasLocation,
    );

    const drizzleSchema =
        database === "postgres"
            ? drizzlePostgresSchema
            : drizzleMysqlMariadbSchema;

    const drizzle: GenerateFileArgs[] = [
        {
            fileLocation: drizzlePath!,
            fileContent: drizzleConfigContent(
                database as SQL_DATABASE,
                language,
            ),
        },
        {
            fileLocation: dbPath!,
            fileContent: drizzleConnection(database as SQL_DATABASE, language),
        },
        { fileLocation: schemasPath!, fileContent: drizzleSchema() },
    ];

    await Promise.all(
        drizzle.map(async (config) => await generateFile({ ...config })),
    );
}

function drizzleConfigContent(db: SQL_DATABASE, lang: Language) {
    const dialect = db !== "mariadb" ? dialectMap[db] : "mysql";

    return `import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/models/schemas.ts",
    dialect: "${dialect}",
    dbCredentials: {
        url: process.env.DATABASE_URL${lang === "ts" ? "!" : ""},
    },
});
`;
}

function drizzlePostgresSchema() {
    return `import {
    uuid,
    integer,
    pgTable,
    varchar,
    boolean,
    timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    age: integer("age").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .$onUpdate(() => new Date()),
});  
`;
}

function drizzleMysqlMariadbSchema() {
    return `import {
    mysqlTable,
    varchar,
    int,
    boolean,
    timestamp,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    age: int("age").notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" })
        .defaultNow()
        .$onUpdate(() => new Date()),
});
`;
}

function drizzleConnection(db: SQL_DATABASE, lang: Language) {
    const module = db === "postgres" ? "node-postgres" : "mysql2";

    return `import { drizzle } from "drizzle-orm/${module}";

export const db = drizzle(process.env.DATABASE_URL${lang === "ts" ? "!" : ""});
`;
}
