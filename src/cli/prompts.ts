import { isCancel, select } from "@clack/prompts";
import { terminate } from "src/utils";
import {
    database_types,
    languages,
    no_sql_database,
    no_sql_orms,
    pkg_managers,
    sql_database,
    sql_orms,
} from "src/config";
import type {
    DATABASE_TYPE,
    ProjectConfig,
    INTERACTIVE_PROMPTS,
} from "src/types";

export async function promptDatabaseType(): Promise<
    ProjectConfig["databaseType"]
> {
    const databaseType = await select({
        message: "Select your Database type:",
        options: database_types.map(
            ({ label, emoji, value }: INTERACTIVE_PROMPTS) => ({
                label: `${label} ${emoji}`,
                value: value,
            }),
        ),
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
        options: options.map(
            ({ label, emoji, value }: INTERACTIVE_PROMPTS) => ({
                label: `${label} ${emoji}`,
                value: value,
            }),
        ),
    });

    if (isCancel(database)) terminate("Process cancelled ❌");

    return database as ProjectConfig["database"];
}

export async function promptDatabaseOrm(
    type: DATABASE_TYPE,
): Promise<ProjectConfig["databaseOrm"]> {
    const options = type === "sql" ? sql_orms : no_sql_orms;

    const orm = await select({
        message: "Choose your ORM",
        options: options.map(
            ({ label, emoji, value }: INTERACTIVE_PROMPTS) => ({
                label: `${label} ${emoji}`,
                value: value,
            }),
        ),
    });

    if (isCancel(orm)) terminate("Process cancelled ❌");

    return orm as ProjectConfig["databaseOrm"];
}

export async function promptLanguage(): Promise<ProjectConfig["language"]> {
    const language = await select({
        message: "Select your programming language:",
        options: languages.map(
            ({ label, emoji, value }: INTERACTIVE_PROMPTS) => ({
                label: `${label} ${emoji}`,
                value: value,
            }),
        ),
    });

    if (isCancel(language)) terminate("Process cancelled ❌");

    return language as ProjectConfig["language"];
}

export async function promptPkgManager(): Promise<ProjectConfig["pkgManager"]> {
    const pkgManager = await select({
        message: "Select your package manager:",
        options: pkg_managers.map(
            ({ label, emoji, value }: INTERACTIVE_PROMPTS) => ({
                label: `${label} ${emoji}`,
                value: value,
            }),
        ),
    });

    if (isCancel(pkgManager)) terminate("Process cancelled ❌");

    return pkgManager as ProjectConfig["pkgManager"];
}
