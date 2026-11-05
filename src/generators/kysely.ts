import { dirname, join } from "node:path";
import { dbLocation, schemasLocation } from "../config";
import { concatFileExtension, generateFile } from "../utils";
import type {
    GenerateFileArgs,
    Language,
    ProjectConfig,
    SQL_DATABASE,
} from "../types";

const kyselySchemasList = {
    mysql: kyselyMysqlSchema,
    mariadb: kyselyMysqlSchema,
    postgres: kyselyPostgresSchema,
    sqlite: kyselySqliteSchema,
};

export async function setupKysely(config: ProjectConfig) {
    const { language, database } = config;
    const db = database as SQL_DATABASE;
    const [dbPath, schemasPath] = concatFileExtension(
        language,
        dbLocation,
        schemasLocation,
    );
    const extension = language === "ts" ? "ts" : "js";
    const dbDirectory = dirname(dbLocation);
    const migrationPath = join(dbDirectory, `migrate.${extension}`);
    const initialMigrationPath = join(
        dbDirectory,
        "migrations",
        `001_create_users.${extension}`,
    );

    const files: GenerateFileArgs[] = [
        {
            fileLocation: dbPath!,
            fileContent: kyselyConnection(db, language),
        },
        {
            fileLocation: schemasPath!,
            fileContent: kyselySchemasList[db](language),
        },
        {
            fileLocation: migrationPath,
            fileContent: kyselyMigrationRunner(),
        },
        {
            fileLocation: initialMigrationPath,
            fileContent: kyselyInitialMigration(db, language),
        },
    ];

    await Promise.all(files.map((file) => generateFile(file)));
}

function kyselyConnection(db: SQL_DATABASE, language: Language) {
    const typeImport =
        language === "ts"
            ? `import type { Database } from "./schemas.js";\n`
            : "";
    const databaseType = language === "ts" ? "<Database>" : "";

    if (db === "postgres") {
        return `${typeImport}import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const dialect = new PostgresDialect({
    pool: new Pool({ connectionString: process.env.DATABASE_URL }),
});

export const db = new Kysely${databaseType}({ dialect });
`;
    }

    if (db === "sqlite") {
        return `${typeImport}import DatabaseDriver from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const dialect = new SqliteDialect({
    database: new DatabaseDriver(process.env.DATABASE_URL),
});

export const db = new Kysely${databaseType}({ dialect });
`;
    }

    return `${typeImport}import { createPool } from "mysql2";
import { Kysely, MysqlDialect } from "kysely";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const dialect = new MysqlDialect({
    pool: createPool(process.env.DATABASE_URL),
});

export const db = new Kysely${databaseType}({ dialect });
`;
}

function kyselySchemasListFor(
    idType: "number" | "string",
    isActiveColumn: "isActive" | "is_active",
    language: Language,
) {
    if (language === "js") {
        return "export {};\n";
    }

    return `import type { Generated } from "kysely";

export interface UsersTable {
    id: Generated<${idType}>;
    name: string;
    age: number;
    email: string;
    ${isActiveColumn}: Generated<boolean | null>;
    created_at: Generated<Date | null>;
    updated_at: Generated<Date | null>;
}

export interface Database {
    users: UsersTable;
}
`;
}

function kyselyMysqlSchema(language: Language) {
    return kyselySchemasListFor("number", "isActive", language);
}

function kyselyPostgresSchema(language: Language) {
    return kyselySchemasListFor("string", "is_active", language);
}

function kyselySqliteSchema(language: Language) {
    return kyselySchemasListFor("number", "is_active", language);
}

function kyselyMigrationRunner() {
    return `import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FileMigrationProvider, Migrator } from "kysely/migration";
import { db } from "./index.js";

const migrationFolder = join(
    dirname(fileURLToPath(import.meta.url)),
    "migrations",
);

const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
        fs,
        path: { join },
        migrationFolder,
    }),
});

const { error, results } = await migrator.migrateToLatest();

for (const result of results ?? []) {
    console.log(\`${"${result.status}"}: ${"${result.migrationName}"}\`);
}

if (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
}

await db.destroy();
`;
}

function kyselyInitialMigration(db: SQL_DATABASE, language: Language) {
    const typeImport =
        language === "ts"
            ? `import type { Kysely } from "kysely";
import type { Database } from "../schemas.js";
`
            : "";
    const dbType = language === "ts" ? "Kysely<Database>" : "";
    const parameterType = dbType ? `: ${dbType}` : "";

    if (db === "postgres") {
        return `${typeImport}import { sql } from "kysely";

export async function up(db${parameterType}) {
    await sql\`CREATE EXTENSION IF NOT EXISTS pgcrypto\`.execute(db);

    await db.schema
        .createTable("users")
        .addColumn("id", "uuid", (column) =>
            column.primaryKey().defaultTo(sql\`gen_random_uuid()\`),
        )
        .addColumn("name", "varchar(255)", (column) => column.notNull())
        .addColumn("age", "integer", (column) => column.notNull())
        .addColumn("email", "varchar(255)", (column) =>
            column.notNull().unique(),
        )
        .addColumn("is_active", "boolean", (column) => column.defaultTo(true))
        .addColumn("created_at", "timestamptz", (column) =>
            column.defaultTo(sql\`now()\`),
        )
        .addColumn("updated_at", "timestamptz", (column) =>
            column.defaultTo(sql\`now()\`),
        )
        .execute();
}

export async function down(db${parameterType}) {
    await db.schema.dropTable("users").execute();
}
`;
    }

    if (db === "sqlite") {
        return `${typeImport}import { sql } from "kysely";

export async function up(db${parameterType}) {
    await db.schema
        .createTable("users")
        .addColumn("id", "integer", (column) =>
            column.primaryKey().autoIncrement(),
        )
        .addColumn("name", "text", (column) => column.notNull())
        .addColumn("age", "integer", (column) => column.notNull())
        .addColumn("email", "text", (column) => column.notNull().unique())
        .addColumn("is_active", "integer", (column) => column.defaultTo(1))
        .addColumn("created_at", "integer", (column) =>
            column.defaultTo(sql\`(strftime('%s', 'now'))\`),
        )
        .addColumn("updated_at", "integer", (column) =>
            column.defaultTo(sql\`(strftime('%s', 'now'))\`),
        )
        .execute();
}

export async function down(db${parameterType}) {
    await db.schema.dropTable("users").execute();
}
`;
    }

    return `${typeImport}import { sql } from "kysely";

export async function up(db${parameterType}) {
    await db.schema
        .createTable("users")
        .addColumn("id", "integer", (column) =>
            column.primaryKey().autoIncrement(),
        )
        .addColumn("name", "varchar(255)", (column) => column.notNull())
        .addColumn("age", "integer", (column) => column.notNull())
        .addColumn("email", "varchar(255)", (column) =>
            column.notNull().unique(),
        )
        .addColumn("isActive", "boolean", (column) =>
            column.defaultTo(true),
        )
        .addColumn("created_at", "timestamp", (column) =>
            column.defaultTo(sql\`CURRENT_TIMESTAMP\`),
        )
        .addColumn("updated_at", "timestamp", (column) =>
            column.defaultTo(sql\`CURRENT_TIMESTAMP\`),
        )
        .execute();
}

export async function down(db${parameterType}) {
    await db.schema.dropTable("users").execute();
}
`;
}
