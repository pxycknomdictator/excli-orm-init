import { displayBanner } from "./cli";
import { getUserInputs } from "./core";

async function main() {
    displayBanner();

    const config = await getUserInputs();
    console.log(config);
}

main().catch((error) => {
    console.error("❌ Error creating project:", error);
    process.exit(1);
});
