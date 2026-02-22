import {
    promptDatabaseType,
    promptDatabase,
    promptDatabaseOrm,
    promptLanguage,
    promptPkgManager,
} from "src/cli";
import { ormsList } from "src/config";
import { fireShell } from "src/utils";
import { modifyPackageJson } from "src/managers";
import { initializeNodeProject, installPackagesWithManager } from "./installer";
import type { ProjectConfig } from "src/types";

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

    await Promise.all([
        setupOrm(config),
        initializeNodeProject(targetDir),
        installPackagesWithManager(config, targetDir),
    ]);

    await modifyPackageJson(config);
    await fireShell("npx prettier --write . --tab-width 4", targetDir);
}
