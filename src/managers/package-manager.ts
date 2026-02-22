import { readFile, writeFile } from "node:fs/promises";
import { drizzleScripts, packageJsonLocation } from "src/config";
import type { ProjectConfig } from "src/types";

export async function modifyPackageJson(config: ProjectConfig) {
    const pkg = JSON.parse(
        await readFile(packageJsonLocation, { encoding: "utf-8" }),
    );

    pkg.type = "module";
    pkg.scripts = {
        ...(config.databaseOrm === "drizzle" ? drizzleScripts : {}),
    };

    await writeFile(packageJsonLocation, JSON.stringify(pkg, null, 2));
}
