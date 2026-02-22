import { join } from "node:path";
import {
    setupDrizzle,
    setupMongoose,
    setupSequelize,
    setupTypeOrm,
    setupPrisma,
} from "src/generators";
import type {
    NO_SQL_DATABASE,
    NO_SQL_ORMS,
    PackageConfig,
    ScriptConfig,
    SQL_DATABASE,
    SQL_ORMS,
} from "src/types";

const rootDir = process.cwd();

const drizzleConfigFile = "drizzle.config";
const dbFile = "index";
const schemasFile = "schemas";
const packageJson = "package.json";

export const drizzleConfigLocation = join(rootDir, drizzleConfigFile);
export const dbLocation = join(rootDir, "src", "db", dbFile);
export const schemasLocation = join(
    rootDir,
    "src",
    "db",
    "models",
    schemasFile,
);
export const packageJsonLocation = join(rootDir, packageJson);

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

export const dialectMap: Record<
    Extract<SQL_DATABASE, "mysql" | "postgres">,
    string
> = {
    mysql: "mysql",
    postgres: "postgresql",
};

export const installCmdMap: Record<string, string> = {
    npm: "install",
    pnpm: "add",
    yarn: "add",
    bun: "add",
};

export function getDrizzlePackages(db: SQL_DATABASE, isTs: boolean) {
    const base: Record<
        Extract<SQL_DATABASE, "mysql" | "postgres">,
        PackageConfig
    > = {
        mysql: {
            packages: ["drizzle-orm", "mysql2"],
            devPackages: ["drizzle-kit"],
        },
        postgres: {
            packages: ["drizzle-orm", "pg"],
            devPackages: ["drizzle-kit"],
        },
    };

    const config = db !== "mariadb" ? base[db] : base["mysql"];
    if (isTs) config.devPackages.push("@types/node");
    if (db === "postgres" && isTs) config.devPackages.push("@types/pg");

    return config;
}

export function getSequelizePackages(db: SQL_DATABASE, isTs: boolean) {
    const base: Record<
        Extract<SQL_DATABASE, "mysql" | "postgres">,
        PackageConfig
    > = {
        mysql: {
            packages: ["sequelize", "mysql2"],
            devPackages: [],
        },
        postgres: {
            packages: ["sequelize", "pg", "pg-hstore"],
            devPackages: [],
        },
    };

    const config = db !== "mariadb" ? base[db] : base["mysql"];
    if (isTs) config.devPackages.push("@types/node");
    if (db === "postgres" && isTs) config.devPackages.push("@types/pg");

    return config;
}

export function getTypeOrmPackages(db: SQL_DATABASE, isTs: boolean) {
    const base: Record<
        Extract<SQL_DATABASE, "mysql" | "postgres">,
        PackageConfig
    > = {
        mysql: {
            packages: ["typeorm", "mysql2"],
            devPackages: [],
        },
        postgres: {
            packages: ["typeorm", "pg"],
            devPackages: [],
        },
    };

    const config = db !== "mariadb" ? base[db] : base["mysql"];
    if (isTs) config.devPackages.push("@types/node");
    if (db === "postgres" && isTs) config.devPackages.push("@types/pg");

    return config;
}

export const ormsList = {
    drizzle: setupDrizzle,
    mongoose: setupMongoose,
    prisma: setupPrisma,
    sequelize: setupSequelize,
    typeorm: setupTypeOrm,
};
