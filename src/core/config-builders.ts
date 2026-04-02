import {
    promptDatabaseType,
    promptDatabase,
    promptDatabaseOrm,
    promptLanguage,
    promptPkgManager,
} from "../cli";
import { ormsList, tsConfigFileLocation } from "../config";
import { fireShell, generateFile, isFileExists } from "../utils";
import { modifyPackageJson, tsConfig } from "../managers";
import { initializeNodeProject, installPackagesWithManager } from "./installer";
import type { ProjectConfig } from "../types";

export async function getInteractiveInputs(): Promise<ProjectConfig> {
    const { displayBanner } = await import("../cli");

    console.clear();
    displayBanner();

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

    if (config.databaseOrm === "prisma") await fireShell("npx prisma generate");
}
