import {
    promptDatabaseType,
    promptDatabase,
    promptDatabaseOrm,
    promptLanguage,
    promptPkgManager,
} from "src/cli";
import { ormsList, tsConfigFileLocation } from "src/config";
import { fireShell, generateFile, isFileExists } from "src/utils";
import { modifyPackageJson } from "src/managers";
import { initializeNodeProject, installPackagesWithManager } from "./installer";
import type { ProjectConfig } from "src/types";
import { tsConfig } from "src/managers/tsconfig";

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

    await initializeNodeProject(targetDir);
    await modifyPackageJson(config);
    await installPackagesWithManager(config, targetDir);
    await setupOrm(config);

    const isExist = isFileExists(tsConfigFileLocation);

    if (config.language === "ts" && !isExist) {
        await generateFile({
            fileLocation: tsConfigFileLocation,
            fileContent: JSON.stringify(tsConfig, null, 4),
        });
    }

    await fireShell("npx prettier --write . --tab-width 4", targetDir);
}
