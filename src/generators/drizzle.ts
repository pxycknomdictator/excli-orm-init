import {
    dbLocation,
    drizzleDialectMap,
    drizzleConfigLocation,
    schemasLocation,
} from "../config";
import { concatFileExtension, generateFile } from "../utils";
import type {
    GenerateFileArgs,
    Language,
    ProjectConfig,
    SQL_DATABASE,
} from "../types";

const drizzleSchemasList = {
    mysql: drizzleMysqlMariadbSchema,
    mariadb: drizzleMysqlMariadbSchema,
    sqlite: drizzleSqliteSchema,
    postgres: drizzlePostgresSchema,
};

const drizzleImportsMap = {
    mysql: "mysql2",
    mariadb: "mysql2",
    sqlite: "libsql",
    postgres: "node-postgres",
};

export async function setupDrizzle(config: ProjectConfig) {
    const { language, database } = config;

    const [drizzlePath, dbPath, schemasPath] = concatFileExtension(
        language,
        drizzleConfigLocation,
        dbLocation,
        schemasLocation,
    );

    const drizzleSchema = drizzleSchemasList[database as SQL_DATABASE];

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

    await Promise.all(drizzle.map((config) => generateFile({ ...config })));
}

function drizzleConfigContent(db: SQL_DATABASE, lang: Language) {
    const dialect = db !== "mariadb" ? drizzleDialectMap[db] : "mysql";

    return `import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/models/schemas.${lang}",
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
    email: varchar("email", { length: 255 }).notNull().unique(),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" })
        .defaultNow()
        .$onUpdate(() => new Date()),
});
`;
}

function drizzleSqliteSchema() {
    return `import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    age: integer("age").notNull(),
    email: text("email").notNull().unique(),
    isActive: integer("is_active", { mode: "boolean" }).default(true),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql\`CURRENT_TIMESTAMP\`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql\`CURRENT_TIMESTAMP\`)
        .$onUpdate(() => new Date()),
});
`;
}

function drizzleConnection(db: SQL_DATABASE, lang: Language) {
    const module = drizzleImportsMap[db];

    return `import { drizzle } from "drizzle-orm/${module}";

export const db = drizzle(process.env.DATABASE_URL${lang === "ts" ? "!" : ""});
`;
}
