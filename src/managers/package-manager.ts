import { promisify } from "node:util";
import { dirname } from "node:path";
import { execFile } from "node:child_process";
import { drizzleScripts, packageJsonLocation, prismaScripts } from "../config";
import type { ProjectConfig } from "../types";

export async function modifyPackageJson({
    language,
    databaseOrm,
}: ProjectConfig) {
    const execFileAsync = promisify(execFile);
    const targetDir = dirname(packageJsonLocation);

    const args = [
        "pkg",
        "set",
        `main=src/main.${language}`,
        `type=module`,
        `--prefix=${targetDir}`,
    ];

    const ormScripts =
        databaseOrm === "drizzle"
            ? drizzleScripts
            : databaseOrm === "prisma"
              ? prismaScripts
              : {};

    for (const [key, value] of Object.entries(ormScripts)) {
        args.push(`scripts.${key}=${value}`);
    }

    if (args.length > 3) await execFileAsync("npm", args);
    else await execFileAsync("npm", args);
}
