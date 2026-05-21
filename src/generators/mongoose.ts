import { dbLocation, schemasLocation } from "../config";
import { concatFileExtension, generateFile } from "../utils";
import type { GenerateFileArgs, ProjectConfig } from "../types";

export async function setupMongoose(config: ProjectConfig) {
    const { language } = config;

    const [dbPath, schemasPath] = concatFileExtension(
        language,
        dbLocation,
        schemasLocation,
    );

    const mongoose: GenerateFileArgs[] = [
        { fileLocation: dbPath!, fileContent: mongooseConnection() },
        { fileLocation: schemasPath!, fileContent: mongooseSchema() },
    ];

    await Promise.all(mongoose.map((config) => generateFile({ ...config })));
}

function mongooseConnection() {
    return `import mongoose from "mongoose";

export async function database() {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

    if (mongoose.connection.readyState === 1) {
        console.log("Reuse Database connection!");
        return;
    }

    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Database is connected!");
    } catch (error) {
        throw new Error("failed to connect with database: ", { cause: error });
    }
}
`;
}

function mongooseSchema() {
    return `import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        email: { type: String, unique: true, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

export const User = model("User", userSchema);
`;
}
