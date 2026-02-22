import {
    installCmdMap,
    ormsPackagesList,
    packageJsonLocation,
} from "src/config";
import type { ProjectConfig } from "src/types";
import { fireShell, isFileExists } from "src/utils";

export async function initializeNodeProject(targetDir: string) {
    const isExists = isFileExists(packageJsonLocation);
    if (!isExists) await fireShell("npm init -y", targetDir);
}

export async function installPackagesWithManager(
    config: ProjectConfig,
    targetDir: string,
) {
    const { language, pkgManager, databaseOrm, database } = config;

    const isTs = language === "ts";
    const installCmd = installCmdMap[pkgManager] ?? null;

    const orm = ormsPackagesList[databaseOrm];
    const { packages, devPackages } = orm(database, isTs);

    await fireShell(
        `${pkgManager} ${installCmd} ${packages.join(" ")}`,
        targetDir,
    );

    if (devPackages.length > 0) {
        await fireShell(
            `${pkgManager} ${installCmd} ${devPackages.join(" ")} -D`,
            targetDir,
        );
    }
}
