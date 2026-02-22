import { dirname } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { cancel } from "@clack/prompts";
import type { GenerateFileArgs, Language } from "src/types";

export async function generateFile(fileArgs: GenerateFileArgs) {
    const { fileLocation, fileContent } = fileArgs;

    try {
        await mkdir(dirname(fileLocation), { recursive: true });
        await writeFile(fileLocation, fileContent, "utf-8");
    } catch (error) {
        console.error("Failed to generate file:", fileLocation);
        throw error;
    }
}

export function concatFileExtension(lang: Language, ...locations: string[]) {
    return locations.map((loc) => loc.concat(lang === "ts" ? ".ts" : ".js"));
}

export function terminate(message: string): never {
    cancel(message);
    process.exit(0);
}
