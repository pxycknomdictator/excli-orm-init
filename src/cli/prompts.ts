import { isCancel, select } from "@clack/prompts";
import { terminate } from "src/utils";
import {
    no_sql_database,
    no_sql_orms,
    sql_database,
    sql_orms,
} from "src/config";
import type { DATABASE_TYPE, ProjectConfig } from "src/types";

export async function promptDatabaseType(): Promise<
    ProjectConfig["databaseType"]
> {
    const databaseType = await select({
        message: "Select your Database type:",
        options: [
            { label: "SQL", value: "sql" },
            { label: "NOSQL", value: "no_sql" },
        ],
    });

    if (isCancel(databaseType)) terminate("Process cancelled ❌");

    return databaseType as ProjectConfig["databaseType"];
}

export async function promptDatabase(
    type: DATABASE_TYPE,
): Promise<ProjectConfig["database"]> {
    const options = type === "sql" ? sql_database : no_sql_database;

    const database = await select({
        message: "Choose your database",
        options: options.map((db) => ({
            label: db.toUpperCase(),
            value: db,
        })),
    });

    if (isCancel(database)) terminate("Process cancelled ❌");

    return database as ProjectConfig["database"];
}

export async function promptDatabaseOrm(
    type: DATABASE_TYPE,
): Promise<ProjectConfig["databaseOrm"]> {
    const options = type === "sql" ? sql_orms : no_sql_orms;

    const orm = await select({
        message: "Choose your database",
        options: options.map((orm) => ({
            label: orm.toUpperCase(),
            value: orm,
        })),
    });

    if (isCancel(orm)) terminate("Process cancelled ❌");

    return orm as ProjectConfig["databaseOrm"];
}

export async function promptLanguage(): Promise<ProjectConfig["language"]> {
    const language = await select({
        message: "Select your programming language:",
        options: [
            { label: "TypeScript", value: "ts" },
            { label: "JavaScript", value: "js" },
        ],
    });

    if (isCancel(language)) terminate("Process cancelled ❌");

    return language as ProjectConfig["language"];
}

export async function promptPkgManager(): Promise<ProjectConfig["pkgManager"]> {
    const pkgManager = await select({
        message: "Select your package manager:",
        options: [
            { label: "npm", value: "npm" },
            { label: "yarn", value: "yarn" },
            { label: "pnpm", value: "pnpm" },
            { label: "bun", value: "bun" },
        ],
    });

    if (isCancel(pkgManager)) terminate("Process cancelled ❌");

    return pkgManager as ProjectConfig["pkgManager"];
}
