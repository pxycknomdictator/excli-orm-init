import { dbLocation, schemasLocation } from "src/config";
import { concatFileExtension, generateFile } from "src/utils";
import type { GenerateFileArgs, ProjectConfig } from "src/types";

export async function setupMongoose(config: ProjectConfig) {
    const { language } = config;

    const [dbPath, schemasPath] = concatFileExtension(
        language,
        dbLocation,
        schemasLocation,
    );

    const mongoose: GenerateFileArgs[] = [
        { fileLocation: dbPath!, fileContent: mongooseConnection(config) },
        { fileLocation: schemasPath!, fileContent: mongooseSchema() },
    ];

    await Promise.all(
        mongoose.map(async (config) => await generateFile({ ...config })),
    );
}

function mongooseConnection(config: ProjectConfig) {
    const { language } = config;

    return `import mongoose from "mongoose";

export async function database() {
    try {
        await mongoose.connect(process.env.DATABASE_URL${language === "ts" ? "!" : ""});
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
