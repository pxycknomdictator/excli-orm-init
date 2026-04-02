import { join } from "node:path";
import {
    setupDrizzle,
    setupMongoose,
    setupSequelize,
    setupTypeOrm,
    setupPrisma,
} from "../generators";
import type {
    PackageConfig,
    ProjectConfig,
    ScriptConfig,
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
const prismaSchemaFile = "schema.prisma";

export const tsConfigFileLocation = join(rootDir, tsConfigFile);

export const drizzleConfigLocation = join(rootDir, drizzleConfigFile);
export const prismaSchemaLocation = join(rootDir, "prisma", prismaSchemaFile);
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

export const sql_orms: INTERACTIVE_PROMPTS[] = [
    { label: "Prisma", emoji: "📐", value: "prisma" },
    { label: "Drizzle", emoji: "⚡", value: "drizzle" },
    { label: "TypeORM", emoji: "🏗️", value: "typeorm" },
    { label: "Sequelize", emoji: "🐚", value: "sequelize" },
];

export const no_sql_orms: INTERACTIVE_PROMPTS[] = [
    { label: "Prisma", emoji: "📐", value: "prisma" },
    { label: "TypeORM", emoji: "🏗️", value: "typeorm" },
    { label: "Mongoose", emoji: "🦦", value: "mongoose" },
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

export const drizzleScripts: ScriptConfig = {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
};

export const prismaScripts: ScriptConfig = {
    "db:generate": "prisma generate",
    "db:dev": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:reset": "prisma migrate reset",
    "db:push": "prisma db push",
    "db:status": "prisma migrate status",
    "db:studio": "prisma studio",
    "db:format": "prisma format",
};

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

export const prismaDialectMap: Record<
    Extract<
        ProjectConfig["database"],
        "mysql" | "postgres" | "mongodb" | "sqlite"
    >,
    string
> = {
    mysql: "mysql",
    postgres: "postgresql",
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
    pnpm: "add",
    yarn: "add",
    bun: "add",
};

export const ormsList = {
    drizzle: setupDrizzle,
    mongoose: setupMongoose,
    prisma: setupPrisma,
    sequelize: setupSequelize,
    typeorm: setupTypeOrm,
};

export function getDrizzlePackages(
    db: ProjectConfig["database"],
    isTs: boolean,
): PackageConfig {
    const base: Record<"mysql" | "postgres" | "sqlite", PackageConfig> = {
        mysql: {
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

    const normalizedDb =
        db !== "mariadb" ? (db as "mysql" | "postgres" | "sqlite") : "mysql";
    const config = base[normalizedDb];

    if (isTs) config.devPackages.push(...TypescriptDevPackages);
    if (normalizedDb === "postgres" && isTs)
        config.devPackages.push("@types/pg");

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
    const base: Record<
        "mysql" | "postgres" | "mongodb" | "sqlite",
        PackageConfig
    > = {
        mysql: {
            packages: ["typeorm", "mysql2", "reflect-metadata"],
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

    const normalizedDb =
        db !== "mariadb"
            ? (db as "mysql" | "sqlite" | "postgres" | "mongodb")
            : "mysql";
    const config = base[normalizedDb];

    if (isTs) config.devPackages.push(...TypescriptDevPackages);
    if (normalizedDb === "postgres" && isTs) {
        config.devPackages.push("@types/pg");
    }

    if (normalizedDb === "sqlite" && isTs) {
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

export function getPrismaPackages(
    db: ProjectConfig["database"],
    isTs: boolean,
): PackageConfig {
    const base: Record<
        "mysql" | "postgres" | "mongodb" | "sqlite",
        PackageConfig
    > = {
        mysql: {
            packages: ["@prisma/client", "@prisma/adapter-mariadb"],
            devPackages: ["prisma"],
        },
        postgres: {
            packages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
            devPackages: ["prisma"],
        },
        sqlite: {
            packages: ["@prisma/client", "@prisma/adapter-better-sqlite3"],
            devPackages: ["prisma"],
        },
        mongodb: {
            packages: ["@prisma/client@6.19"],
            devPackages: ["prisma@6.19"],
        },
    };

    const normalizedDb =
        db !== "mariadb"
            ? (db as "mysql" | "postgres" | "mongodb" | "sqlite")
            : "mysql";
    const config = base[normalizedDb];

    config.packages.push("dotenv");
    if (isTs) config.devPackages.push(...TypescriptDevPackages);

    if (normalizedDb === "postgres" && isTs) {
        config.devPackages.push("@types/pg");
    }

    if (normalizedDb === "sqlite" && isTs) {
        config.devPackages.push("@types/better-sqlite3");
    }

    return config;
}

type ORMs = "drizzle" | "prisma" | "typeorm" | "sequelize" | "mongoose";

type ORMFn = (db: ProjectConfig["database"], isTs: boolean) => PackageConfig;

export const ormsPackagesList: Record<ORMs, ORMFn> = {
    drizzle: getDrizzlePackages,
    prisma: getPrismaPackages,
    typeorm: getTypeOrmPackages,
    sequelize: getSequelizePackages,
    mongoose: getMongoosePackages,
};

export function generateOptions(options: INTERACTIVE_PROMPTS[]) {
    return options.map(({ label, emoji, value }: INTERACTIVE_PROMPTS) => ({
        label: `${label} ${emoji}`,
        value: value,
    }));
}
