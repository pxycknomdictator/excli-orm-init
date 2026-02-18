import { isCancel, select } from "@clack/prompts";
import { terminate } from "src/utils";
import {
    no_sql_database,
    no_sql_orms,
    sql_database,
    sql_orms,
} from "src/config";
import type { Config, DATABASE_TYPE } from "src/types";

export async function promptDatabaseType(): Promise<DATABASE_TYPE> {
    const databaseType = await select({
        message: "Select your Database type:",
        options: [
            { label: "SQL", value: "sql" },
            { label: "NOSQL", value: "no_sql" },
        ],
    });

    if (isCancel(databaseType)) terminate("Process cancelled ❌");

    return databaseType as DATABASE_TYPE;
}

export async function promptDatabase(type: DATABASE_TYPE) {
    const options = type === "sql" ? sql_database : no_sql_database;

    const database = await select({
        message: "Choose your database",
        options: options.map((db) => ({
            label: db.toUpperCase(),
            value: db,
        })),
    });

    if (isCancel(database)) terminate("Process cancelled ❌");

    return database;
}

export async function promptDatabaseOrm(type: DATABASE_TYPE) {
    const options = type === "sql" ? sql_orms : no_sql_orms;

    const orm = await select({
        message: "Choose your database",
        options: options.map((orm) => ({
            label: orm.toUpperCase(),
            value: orm,
        })),
    });

    if (isCancel(orm)) terminate("Process cancelled ❌");

    return orm;
}

export async function promptLanguage(): Promise<Config["language"]> {
    const language = (await select({
        message: "Select your programming language:",
        options: [
            { label: "TypeScript", value: "ts" },
            { label: "JavaScript", value: "js" },
        ],
    })) as Config["language"];

    if (isCancel(language)) terminate("Process cancelled ❌");

    return language;
}

export async function promptPkgManager(): Promise<Config["packageManager"]> {
    const pkgManager = (await select({
        message: "Select your package manager:",
        options: [
            { label: "npm", value: "npm" },
            { label: "yarn", value: "yarn" },
            { label: "pnpm", value: "pnpm" },
            { label: "bun", value: "bun" },
        ],
    })) as Config["packageManager"];

    if (isCancel(pkgManager)) terminate("Process cancelled ❌");

    return pkgManager;
}
