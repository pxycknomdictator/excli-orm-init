import { readFile, writeFile } from "node:fs/promises";
import { drizzleScripts, packageJsonLocation, prismaScripts } from "../config";
import type { ProjectConfig } from "../types";

export async function modifyPackageJson(config: ProjectConfig) {
    const pkg = JSON.parse(
        await readFile(packageJsonLocation, { encoding: "utf-8" }),
    );

    pkg.main = `src/main.${config.language}`;
    pkg.type = "module";
    pkg.scripts = {
        ...pkg.scripts,
        ...(config.databaseOrm === "drizzle" ? drizzleScripts : {}),
        ...(config.databaseOrm === "prisma" ? prismaScripts : {}),
    };

    await writeFile(packageJsonLocation, JSON.stringify(pkg, null, 2));
}
