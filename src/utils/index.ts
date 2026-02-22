import { dirname } from "node:path";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
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

export const isFileExists = (location: string) => existsSync(location);

export function fireShell(command: string, targetDir: string = process.cwd()) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, {
            cwd: targetDir,
            stdio: "ignore",
            shell: true,
        });

        child.on("close", (code) => {
            if (code !== 0)
                reject(new Error(`Command failed with code ${code}`));
            else resolve("");
        });

        child.on("error", (err) => reject(err));
    });
}

export function terminate(message: string): never {
    cancel(message);
    process.exit(0);
}
