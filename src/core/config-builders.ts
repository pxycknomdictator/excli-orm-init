import {
    promptDatabaseType,
    promptDatabase,
    promptDatabaseOrm,
    promptLanguage,
    promptPkgManager,
} from "src/cli";

export async function getUserInputs() {
    const databaseType = await promptDatabaseType();
    const database = await promptDatabase(databaseType);
    const databaseOrm = await promptDatabaseOrm(databaseType);
    const language = await promptLanguage();
    const pkgManager = await promptPkgManager();

    return { database, databaseOrm, language, pkgManager };
}
