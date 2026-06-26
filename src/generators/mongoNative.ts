import { dbLocation } from "../config";
import type { GenerateFileArgs, ProjectConfig } from "../types";
import { concatFileExtension, generateFile } from "../utils";

export async function setupMongodbNativeDriver(config: ProjectConfig) {
    const { language } = config;

    const [dbPath] = concatFileExtension(language, dbLocation);

    const mongodbNativeDriver: GenerateFileArgs[] = [
        {
            fileLocation: dbPath!,
            fileContent: mongodbNativeConnection(language),
        },
    ];

    await Promise.all(
        mongodbNativeDriver.map((config) => generateFile({ ...config })),
    );
}

function mongodbNativeConnection(language: ProjectConfig["language"]) {
    const isJS = language === "js";

    return `import { ${isJS ? "" : "Db, "}MongoClient } from "mongodb";

let cachedDb${isJS ? "" : ": Db | null"} = null;
let cachedClient${isJS ? "" : ": MongoClient | null"} = null;

export async function client() {
    if (cachedClient) return cachedClient;
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

    try {
        const clientInstance = new MongoClient(process.env.DATABASE_URL);
        cachedClient = await clientInstance.connect();
        console.log("Database is connected!");
        return cachedClient;
    } catch (error) {
        throw new Error("failed to connect with database", { cause: error });
    }
}

export async function database() {
    if (cachedDb) {
        console.log("Reuse Database connection!");
        return cachedDb;
    }

    try {
        const mongoClient = await client();
        cachedDb = mongoClient.db();
        return cachedDb;
    } catch (error) {
        throw new Error("failed to get Database instance", { cause: error });
    }
}
`;
}
