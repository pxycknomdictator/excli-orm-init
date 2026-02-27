#!/usr/bin/env node

import { log, spinner } from "@clack/prompts";
import { prepareProject } from "./core";
import { getUserInputs } from "./cli/inputs";

async function main() {
    const config = await getUserInputs();
    const targetDir = process.cwd();

    const s = spinner();
    s.start("Creating project...");

    await prepareProject(config, targetDir);

    s.stop(`Successfully created project`);
    log.success(`Scaffolding project in ${targetDir}...`);
}

main().catch((error) => {
    console.error("❌ Error creating project:", error);
    process.exit(1);
});
