import { join } from "node:path";
import {
    setupDrizzle,
    setupMongoose,
    setupSequelize,
    setupTypeOrm,
    setupMongodbNativeDriver,
    setupKysely,
} from "../generators";
import type {
    PackageConfig,
    ProjectConfig,
    SQL_DATABASE,
    INTERACTIVE_PROMPTS,
} from "../types";

const rootDir = process.cwd();

const TypescriptDevPackages = ["@types/node", "typescript"];

const tsConfigFile = "tsconfig.json";
const drizzleConfigFile = "drizzle.config";
const dbFile = "index";
const schemasFile = "schemas";
const packageJson = "package.json";

export const tsConfigFileLocation = join(rootDir, tsConfigFile);

export const drizzleConfigLocation = join(rootDir, drizzleConfigFile);
export const dbLocation = join(rootDir, "src", "db", dbFile);
export const schemasLocation = join(rootDir, "src", "db", schemasFile);

export const packageJsonLocation = join(rootDir, packageJson);

export const BANNER_FONT = "Standard";

export const database_types: INTERACTIVE_PROMPTS[] = [
    { label: "SQL", emoji: "🗃️", value: "sql" },
    { label: "NoSQL", emoji: "🌿", value: "no_sql" },
];

export const sql_database: INTERACTIVE_PROMPTS[] = [
    { label: "MySQL", emoji: "🐬", value: "mysql" },
    { label: "MariaDB", emoji: "🦭", value: "mariadb" },
    { label: "SQLite", emoji: "🪶", value: "sqlite" },
    { label: "PostgreSQL", emoji: "🐘", value: "postgres" },
];

export const no_sql_database: INTERACTIVE_PROMPTS[] = [
    { label: "MongoDB", emoji: "🍃", value: "mongodb" },
];

export const sql_library_categories: INTERACTIVE_PROMPTS[] = [
    { label: "ORM / ODM", emoji: "🏗️", value: "orm" },
    { label: "Query Builder", emoji: "🧱", value: "query_builder" },
];

export const sql_orms: INTERACTIVE_PROMPTS[] = [
    { label: "Drizzle", emoji: "⚡", value: "drizzle" },
    { label: "TypeORM", emoji: "🏗️", value: "typeorm" },
    { label: "Sequelize", emoji: "🐚", value: "sequelize" },
];

export const sql_query_builders: INTERACTIVE_PROMPTS[] = [
    { label: "Kysely", emoji: "🧩", value: "kysely" },
];

export const no_sql_orms: INTERACTIVE_PROMPTS[] = [
    { label: "TypeORM", emoji: "🏗️", value: "typeorm" },
    { label: "Mongoose", emoji: "🦦", value: "mongoose" },
    { label: "Native Driver", emoji: "🌱", value: "native_driver" },
];

export const languages: INTERACTIVE_PROMPTS[] = [
    { label: "JavaScript", emoji: "🟡", value: "js" },
    { label: "TypeScript", emoji: "🔵", value: "ts" },
];

export const pkg_managers: INTERACTIVE_PROMPTS[] = [
    { label: "npm", emoji: "📦", value: "npm" },
    { label: "yarn", emoji: "🧶", value: "yarn" },
    { label: "pnpm", emoji: "🚀", value: "pnpm" },
    { label: "bun", emoji: "🥟", value: "bun" },
];

export const drizzleDialectMap: Record<
    Extract<SQL_DATABASE, "mysql" | "postgres" | "sqlite">,
    string
> = {
    mysql: "mysql",
    postgres: "postgresql",
    sqlite: "sqlite",
};

export const typeOrmDbTypeMap: Record<ProjectConfig["database"], string> = {
    mysql: "mysql",
    mariadb: "mariadb",
    postgres: "postgres",
    mongodb: "mongodb",
    sqlite: "sqlite",
};

export const sequelizeDialectMap: Record<SQL_DATABASE, string> = {
    mysql: "mysql",
    mariadb: "mariadb",
    postgres: "postgres",
    sqlite: "sqlite",
};

export const installCmdMap: Record<string, string> = {
    npm: "install",
    pnpm: "add --ignore-workspace --config.dangerously-allow-all-builds=true",
    yarn: "add",
    bun: "add",
};

export const ormsList = {
    drizzle: setupDrizzle,
    mongoose: setupMongoose,
    sequelize: setupSequelize,
    typeorm: setupTypeOrm,
    native_driver: setupMongodbNativeDriver,
    kysely: setupKysely,
};

export function getDrizzlePackages(
    db: ProjectConfig["database"],
    isTs: boolean,
): PackageConfig {
    const base: Record<SQL_DATABASE, PackageConfig> = {
        mysql: {
            packages: ["drizzle-orm", "mysql2"],
            devPackages: ["drizzle-kit"],
        },
        mariadb: {
            packages: ["drizzle-orm", "mysql2"],
            devPackages: ["drizzle-kit"],
        },
        postgres: {
            packages: ["drizzle-orm", "pg"],
            devPackages: ["drizzle-kit"],
        },
        sqlite: {
            packages: ["drizzle-orm", "@libsql/client"],
            devPackages: ["drizzle-kit"],
        },
    };

    const config = base[db as SQL_DATABASE];

    if (isTs) config.devPackages.push(...TypescriptDevPackages);
    if (db === "postgres" && isTs) config.devPackages.push("@types/pg");

    return config;
}

export function getSequelizePackages(
    db: ProjectConfig["database"],
    isTs: boolean,
): PackageConfig {
    const base: Record<SQL_DATABASE, PackageConfig> = {
        mysql: { packages: ["sequelize", "mysql2"], devPackages: [] },
        mariadb: { packages: ["sequelize", "mariadb"], devPackages: [] },
        postgres: {
            packages: ["sequelize", "pg", "pg-hstore"],
            devPackages: [],
        },
        sqlite: { packages: ["sequelize", "sqlite3"], devPackages: [] },
    };

    const config = base[db as SQL_DATABASE];

    if (isTs) config.devPackages.push(...TypescriptDevPackages);
    if (db === "postgres" && isTs) config.devPackages.push("@types/pg");

    return config;
}

export function getTypeOrmPackages(
    db: ProjectConfig["database"],
    isTs: boolean,
): PackageConfig {
    const base: Record<ProjectConfig["database"], PackageConfig> = {
        mysql: {
            packages: ["typeorm", "mysql2", "reflect-metadata"],
            devPackages: [],
        },
        mariadb: {
            packages: ["typeorm", "mariadb", "reflect-metadata"],
            devPackages: [],
        },
        postgres: {
            packages: ["typeorm", "pg", "reflect-metadata"],
            devPackages: [],
        },
        sqlite: {
            packages: ["typeorm", "better-sqlite3", "reflect-metadata"],
            devPackages: [],
        },
        mongodb: {
            packages: ["typeorm", "mongodb", "reflect-metadata"],
            devPackages: [],
        },
    };

    const config = base[db as ProjectConfig["database"]];

    if (isTs) config.devPackages.push(...TypescriptDevPackages);
    if (db === "postgres" && isTs) {
        config.devPackages.push("@types/pg");
    }

    if (db === "sqlite" && isTs) {
        config.devPackages.push("@types/better-sqlite3");
    }

    return config;
}

export function getMongoosePackages(
    db: ProjectConfig["database"],
    isTs: boolean,
): PackageConfig {
    const base: Record<"mongodb", PackageConfig> = {
        mongodb: { packages: ["mongoose"], devPackages: [] },
    };

    const config = base[db as "mongodb"];

    if (isTs) config.devPackages.push(...TypescriptDevPackages);

    return config;
}

export function getMongoNativeDriverPackages(
    db: ProjectConfig["database"],
    isTs: boolean,
): PackageConfig {
    const base: Record<"mongodb", PackageConfig> = {
        mongodb: { packages: ["mongodb"], devPackages: [] },
    };

    const config = base[db as "mongodb"];

    if (isTs) config.devPackages.push(...TypescriptDevPackages);

    return config;
}

export function getKyselyPackages(
    db: ProjectConfig["database"],
    isTs: boolean,
): PackageConfig {
    const base: Record<SQL_DATABASE, PackageConfig> = {
        mysql: { packages: ["kysely", "mysql2"], devPackages: [] },
        postgres: { packages: ["kysely", "pg"], devPackages: [] },
        sqlite: { packages: ["kysely", "better-sqlite3"], devPackages: [] },
        mariadb: { packages: ["kysely", "mysql2"], devPackages: [] },
    };

    const config = base[db as SQL_DATABASE];
    if (isTs) config.devPackages.push(...TypescriptDevPackages);
    if (db === "postgres" && isTs) config.devPackages.push("@types/pg");
    if (db === "sqlite" && isTs) {
        config.devPackages.push("@types/better-sqlite3");
    }

    return config;
}

type ORMs =
    | "drizzle"
    | "typeorm"
    | "sequelize"
    | "mongoose"
    | "native_driver"
    | "kysely";

type ORMFn = (db: ProjectConfig["database"], isTs: boolean) => PackageConfig;

export const ormsPackagesList: Record<ORMs, ORMFn> = {
    drizzle: getDrizzlePackages,
    typeorm: getTypeOrmPackages,
    sequelize: getSequelizePackages,
    mongoose: getMongoosePackages,
    native_driver: getMongoNativeDriverPackages,
    kysely: getKyselyPackages,
};

export function generateOptions(options: INTERACTIVE_PROMPTS[]) {
    return options.map(({ label, emoji, value }: INTERACTIVE_PROMPTS) => ({
        label: `${label} ${emoji}`,
        value: value,
    }));
}
