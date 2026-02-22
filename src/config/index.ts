import { join } from "node:path";
import type {
    NO_SQL_DATABASE,
    NO_SQL_ORMS,
    ScriptConfig,
    SQL_DATABASE,
    SQL_ORMS,
} from "src/types";

const rootDir = process.cwd();

const drizzleConfigFile = "drizzle.config";
const dbFile = "index";
const schemasFile = "schemas";

export const drizzleConfigLocation = join(rootDir, drizzleConfigFile);
export const dbLocation = join(rootDir, "src", "db", dbFile);
export const schemasLocation = join(
    rootDir,
    "src",
    "db",
    "models",
    schemasFile,
);

export const BANNER_FONT = "Standard";

export const sql_database: SQL_DATABASE[] = ["mysql", "mariadb", "postgres"];
export const no_sql_database: NO_SQL_DATABASE[] = ["mongodb"];

export const sql_orms: SQL_ORMS[] = [
    "prisma",
    "drizzle",
    "typeorm",
    "sequelize",
];
export const no_sql_orms: NO_SQL_ORMS[] = ["prisma", "typeorm", "mongoose"];

export const drizzleScripts: ScriptConfig = {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
};

export const dialectMap: Record<SQL_DATABASE, string> = {
    mariadb: "mysql",
    mysql: "mysql",
    postgres: "postgresql",
};
