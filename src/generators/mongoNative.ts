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
    const globalDeclaration = isJS
        ? "const globalForMongo = globalThis;"
        : `const globalForMongo = globalThis as typeof globalThis & {
    mongoClient?: MongoClient;
    mongoClientPromise?: Promise<MongoClient>;
    mongoDb?: Db;
};`;

    return `import { ${isJS ? "" : "Db, "}MongoClient } from "mongodb";

${globalDeclaration}

export async function client() {
    if (globalForMongo.mongoClient) {
        console.log("Reuse Database connection!");
        return globalForMongo.mongoClient;
    }
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

    try {
        const isNewConnection = !globalForMongo.mongoClientPromise;
        if (!globalForMongo.mongoClientPromise) {
            globalForMongo.mongoClientPromise = new MongoClient(
                process.env.DATABASE_URL,
            ).connect();
        }

        globalForMongo.mongoClient =
            await globalForMongo.mongoClientPromise;
        if (isNewConnection) console.log("Database is connected!");
        else console.log("Reuse Database connection!");
        return globalForMongo.mongoClient;
    } catch (error) {
        globalForMongo.mongoClientPromise = undefined;
        throw new Error("failed to connect with database", { cause: error });
    }
}

export async function database() {
    if (globalForMongo.mongoDb) {
        console.log("Reuse Database connection!");
        return globalForMongo.mongoDb;
    }

    try {
        const mongoClient = await client();
        globalForMongo.mongoDb = mongoClient.db();
        return globalForMongo.mongoDb;
    } catch (error) {
        throw new Error("failed to get Database instance", { cause: error });
    }
}
`;
}
