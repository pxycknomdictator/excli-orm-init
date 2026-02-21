export type DATABASE_TYPE = "sql" | "no_sql";

export type SQL_DATABASE = "mysql" | "mariadb" | "postgres";
export type SQL_ORMS = "prisma" | "drizzle" | "typeorm" | "sequelize";

export type NO_SQL_DATABASE = "mongodb";
export type NO_SQL_ORMS = "prisma" | "typeorm" | "mongoose";

export type Language = "ts" | "js";

export type PACKAGE_MANAGER = "npm" | "yarn" | "pnpm" | "bun";

export type SQL_DB_CONFIG = {
    name: SQL_DATABASE;
    orms: SQL_ORMS;
};

export type NO_SQL_DB_CONFIG = {
    name: NO_SQL_DATABASE;
    orms: NO_SQL_ORMS;
};

export type ScriptConfig = {
    [key: string]: string;
};

export type ProjectConfig = {
    databaseType: DATABASE_TYPE;
    database: SQL_DATABASE | NO_SQL_DATABASE;
    databaseOrm: SQL_ORMS | NO_SQL_ORMS;
    language: Language;
    pkgManager: PACKAGE_MANAGER;
};

export type GenerateFileArgs = {
    fileLocation: string;
    fileContent: string;
};
