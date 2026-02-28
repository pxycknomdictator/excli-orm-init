import { concatFileExtension, generateFile } from "src/utils";
import { dbLocation, schemasLocation, sequelizeDialectMap } from "src/config";
import type { GenerateFileArgs, ProjectConfig, SQL_DATABASE } from "src/types";

export async function setupSequelize(config: ProjectConfig) {
    const { language } = config;

    const [dbPath, schemasPath] = concatFileExtension(
        language,
        dbLocation,
        schemasLocation,
    );

    const sequelize: GenerateFileArgs[] = [
        { fileLocation: schemasPath!, fileContent: sequelizeSchema() },
        { fileLocation: dbPath!, fileContent: sequelizeConnection(config) },
    ];

    await Promise.all(
        sequelize.map(async (config) => await generateFile({ ...config })),
    );
}

function sequelizeSchema() {
    return `import { DataTypes } from "sequelize";
import { sequelize } from "../index.js";

export const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "users",
        timestamps: true,
    },
);
`;
}

function sequelizeConnection(config: ProjectConfig) {
    const { language, database } = config;
    const db = sequelizeDialectMap[database as SQL_DATABASE];

    return `import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.DATABASE_URL${language === "ts" ? "!" : ""}, {
    dialect: "${db}",
    logging: false,
});

export async function database() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("Database is connected!");
    } catch (error) {
        throw new Error("failed to connect with database: ", { cause: error });
    }
}
`;
}
