import {
    promptDatabaseType,
    promptDatabase,
    promptDatabaseOrm,
    promptLanguage,
    promptPkgManager,
} from "src/cli";
import type { ProjectConfig } from "src/types";
import { initializeNodeProject, installPackagesWithManager } from "./installer";
import { ormsList } from "src/config";

export async function getUserInputs(): Promise<ProjectConfig> {
    const databaseType = await promptDatabaseType();
    const database = await promptDatabase(databaseType);
    const databaseOrm = await promptDatabaseOrm(databaseType);
    const language = await promptLanguage();
    const pkgManager = await promptPkgManager();

    return { databaseType, database, databaseOrm, language, pkgManager };
}

export async function prepareProject(config: ProjectConfig, targetDir: string) {
    const setupOrm = ormsList[config.databaseOrm];

    await setupOrm(config);
    await initializeNodeProject(targetDir);
    await installPackagesWithManager(config, targetDir);
}
