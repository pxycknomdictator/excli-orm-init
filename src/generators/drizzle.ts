import { dbLocation, drizzleConfigLocation, schemasLocation } from "src/config";
import { concatFileExtension, generateFile } from "src/utils";
import type { GenerateFileArgs, ProjectConfig } from "src/types";

export async function setupDrizzle({ language }: ProjectConfig) {
    const [drizzlePath, dbPath, schemasPath] = concatFileExtension(
        language,
        drizzleConfigLocation,
        dbLocation,
        schemasLocation,
    );

    const drizzle: GenerateFileArgs[] = [
        { fileLocation: drizzlePath!, fileContent: "drizzle config" },
        { fileLocation: dbPath!, fileContent: "db config" },
        { fileLocation: schemasPath!, fileContent: "schemas config" },
    ];

    await Promise.all(
        drizzle.map(async (config) => await generateFile({ ...config })),
    );
}
