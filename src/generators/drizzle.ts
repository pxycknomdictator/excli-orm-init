import {
    dbLocation,
    dialectMap,
    drizzleConfigLocation,
    schemasLocation,
} from "src/config";
import { concatFileExtension, generateFile } from "src/utils";
import type { GenerateFileArgs, ProjectConfig, SQL_DATABASE } from "src/types";

export async function setupDrizzle({ language, database }: ProjectConfig) {
    const [drizzlePath, dbPath, schemasPath] = concatFileExtension(
        language,
        drizzleConfigLocation,
        dbLocation,
        schemasLocation,
    );

    const drizzle: GenerateFileArgs[] = [
        {
            fileLocation: drizzlePath!,
            fileContent: drizzleConfigContent(database as SQL_DATABASE),
        },
        { fileLocation: dbPath!, fileContent: "db config" },
        { fileLocation: schemasPath!, fileContent: "schemas config" },
    ];

    await Promise.all(
        drizzle.map(async (config) => await generateFile({ ...config })),
    );
}

function drizzleConfigContent(db: SQL_DATABASE) {
    const dialect = dialectMap[db];

    return `import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/models/schemas.ts",
    dialect: "${dialect}",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
`;
}
