import { getInteractiveInputs } from "src/core";
import { getYargsInputs } from "./yargs";

export async function getUserInputs() {
    const args = process.argv.slice(2);
    if (args.length > 0) return getYargsInputs();
    return getInteractiveInputs();
}
