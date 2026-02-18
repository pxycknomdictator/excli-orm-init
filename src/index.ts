async function main() {
    console.log("Hello excli/orm-init");
}

main().catch((error) => {
    console.error("❌ Error creating project:", error);
    process.exit(1);
});
