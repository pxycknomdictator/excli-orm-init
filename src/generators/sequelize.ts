import type { ProjectConfig } from "src/types";

export async function setupSequelize(_config: ProjectConfig) {
    sequelizeSchema();
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
