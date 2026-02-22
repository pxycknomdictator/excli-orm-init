import { packageJsonLocation } from "src/config";
import { fireShell, isFileExists } from "src/utils";

export async function initializeNodeProject(targetDir: string) {
    const isExists = isFileExists(packageJsonLocation);
    if (!isExists) await fireShell("npx init -y", targetDir);
}
