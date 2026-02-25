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
    ProjectConfig,
    ScriptConfig,
    SQL_DATABASE,
    SQL_ORMS,
} from "src/types";

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
    Extract<SQL_DATABASE, "mysql" | "postgres">,
    string
> = {
    mysql: "mysql",
    postgres: "postgresql",
};

export const typeOrmDbTypeMap: Record<ProjectConfig["database"], string> = {
    mysql: "mysql",
    mariadb: "mariadb",
    postgres: "postgres",
    mongodb: "mongodb",
};

export const prismaDialectMap: Record<
    Extract<ProjectConfig["database"], "mysql" | "postgres" | "mongodb">,
    string
> = {
    mysql: "mysql",
    postgres: "postgresql",
    mongodb: "mongodb",
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
    const base: Record<"mysql" | "postgres", PackageConfig> = {
        mysql: {
            packages: ["drizzle-orm", "mysql2"],
            devPackages: ["drizzle-kit"],
        },
        postgres: {
            packages: ["drizzle-orm", "pg"],
            devPackages: ["drizzle-kit"],
        },
    };

    const normalizedDb =
        db !== "mariadb" ? (db as "mysql" | "postgres") : "mysql";
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
    const base: Record<"mysql" | "postgres" | "mongodb", PackageConfig> = {
        mysql: {
            packages: ["typeorm", "mysql2", "reflect-metadata"],
            devPackages: [],
        },
        postgres: {
            packages: ["typeorm", "pg", "reflect-metadata"],
            devPackages: [],
        },
        mongodb: {
            packages: ["typeorm", "mongodb", "reflect-metadata"],
            devPackages: [],
        },
    };

    const normalizedDb =
        db !== "mariadb" ? (db as "mysql" | "postgres" | "mongodb") : "mysql";
    const config = base[normalizedDb];

    if (isTs) config.devPackages.push(...TypescriptDevPackages);
    if (normalizedDb === "postgres" && isTs) {
        config.devPackages.push("@types/pg");
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
    const base: Record<"mysql" | "postgres" | "mongodb", PackageConfig> = {
        mysql: {
            packages: ["@prisma/client", "@prisma/adapter-mariadb"],
            devPackages: ["prisma"],
        },
        postgres: {
            packages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
            devPackages: ["prisma"],
        },
        mongodb: {
            packages: ["@prisma/client@6.19"],
            devPackages: ["prisma@6.19"],
        },
    };

    const normalizedDb =
        db !== "mariadb" ? (db as "mysql" | "postgres" | "mongodb") : "mysql";
    const config = base[normalizedDb];

    config.packages.push("dotenv");
    if (isTs) config.devPackages.push(...TypescriptDevPackages);
    if (normalizedDb === "postgres" && isTs)
        config.devPackages.push("@types/pg");

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
