export type SQL_DATABASE = "mysql" | "mariadb" | "postgres";
export type SQL_ORMS = "prisma" | "drizzle" | "typeorm" | "sequelize";

export type NO_SQL_DATABASE = "mongodb";
export type NO_SQL_ORMS = "prisma" | "typeorm" | "mongoose";

export type SQL_DB_CONFIG = {
    name: SQL_DATABASE;
    orms: SQL_ORMS;
};

export type NO_SQL_DB_CONFIG = {
    name: NO_SQL_DATABASE;
    orms: NO_SQL_ORMS;
};

export type Config = {
    language: "ts" | "js";
    packageManager: "npm" | "yarn" | "pnpm" | "bun";
    database: {
        sql?: SQL_DB_CONFIG;
        no_sql?: NO_SQL_DB_CONFIG;
    };
};
