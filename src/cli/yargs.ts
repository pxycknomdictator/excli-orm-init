import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type { ProjectConfig } from "src/types";

export function getYargsInputs(): ProjectConfig {
    const argv = yargs(hideBin(process.argv))
        .option("ts", {
            type: "boolean",
            description: "Use TypeScript",
            conflicts: "js",
        })
        .option("js", {
            type: "boolean",
            description: "Use JavaScript",
            conflicts: "ts",
        })
        .option("mysql", {
            type: "boolean",
            description: "Use MySQL",
            conflicts: ["mariadb", "postgres", "mongodb"],
        })
        .option("mariadb", {
            type: "boolean",
            description: "Use MariaDB",
            conflicts: ["mysql", "postgres", "mongodb"],
        })
        .option("postgres", {
            type: "boolean",
            description: "Use PostgreSQL",
            conflicts: ["mysql", "mariadb", "mongodb"],
        })
        .option("mongodb", {
            type: "boolean",
            description: "Use MongoDB",
            conflicts: ["mysql", "mariadb", "postgres"],
        })
        .option("prisma", {
            type: "boolean",
            description: "Use Prisma (MySQL, MariaDB, PostgreSQL, MongoDB)",
            conflicts: ["drizzle", "typeorm", "sequelize", "mongoose"],
        })
        .option("drizzle", {
            type: "boolean",
            description: "Use Drizzle (MySQL, MariaDB, PostgreSQL only)",
            conflicts: ["prisma", "typeorm", "sequelize", "mongoose"],
        })
        .option("typeorm", {
            type: "boolean",
            description: "Use TypeORM (MySQL, MariaDB, PostgreSQL, MongoDB)",
            conflicts: ["prisma", "drizzle", "sequelize", "mongoose"],
        })
        .option("sequelize", {
            type: "boolean",
            description: "Use Sequelize (MySQL, MariaDB, PostgreSQL only)",
            conflicts: ["prisma", "drizzle", "typeorm", "mongoose"],
        })
        .option("mongoose", {
            type: "boolean",
            description: "Use Mongoose (MongoDB only)",
            conflicts: ["prisma", "drizzle", "typeorm", "sequelize"],
        })
        .option("npm", {
            type: "boolean",
            description: "Use npm",
            conflicts: ["yarn", "pnpm", "bun"],
        })
        .option("yarn", {
            type: "boolean",
            description: "Use Yarn",
            conflicts: ["npm", "pnpm", "bun"],
        })
        .option("pnpm", {
            type: "boolean",
            description: "Use pnpm",
            conflicts: ["npm", "yarn", "bun"],
        })
        .option("bun", {
            type: "boolean",
            description: "Use Bun",
            conflicts: ["npm", "yarn", "pnpm"],
        })
        .check((argv) => {
            if (!argv.ts && !argv.js)
                throw new Error("You must specify a language: --ts or --js");

            if (!argv.mysql && !argv.mariadb && !argv.postgres && !argv.mongodb)
                throw new Error(
                    "You must specify a database: --mysql, --mariadb, --postgres, or --mongodb",
                );

            if (
                !argv.prisma &&
                !argv.drizzle &&
                !argv.typeorm &&
                !argv.sequelize &&
                !argv.mongoose
            )
                throw new Error(
                    "You must specify an ORM: --prisma, --drizzle, --typeorm, --sequelize, or --mongoose",
                );

            const isSql = argv.mysql || argv.mariadb || argv.postgres;
            const isNoSql = argv.mongodb;

            if (isNoSql && argv.drizzle)
                throw new Error(
                    "Drizzle does not support MongoDB. Use --prisma, --typeorm, or --mongoose",
                );

            if (isNoSql && argv.sequelize)
                throw new Error(
                    "Sequelize does not support MongoDB. Use --prisma, --typeorm, or --mongoose",
                );

            if (isSql && argv.mongoose)
                throw new Error(
                    "Mongoose only supports MongoDB. Use --prisma, --drizzle, --typeorm, or --sequelize",
                );

            if (!argv.npm && !argv.yarn && !argv.pnpm && !argv.bun)
                throw new Error(
                    "You must specify a package manager: --npm, --yarn, --pnpm, or --bun",
                );

            return true;
        })
        .help()
        .alias("help", "h")
        .parseSync();

    let language: ProjectConfig["language"];
    if (argv.ts) language = "ts";
    else if (argv.js) language = "js";
    else throw new Error("Invalid language");

    let database: ProjectConfig["database"];
    let databaseType: ProjectConfig["databaseType"];

    if (argv.mysql) {
        database = "mysql";
        databaseType = "sql";
    } else if (argv.mariadb) {
        database = "mariadb";
        databaseType = "sql";
    } else if (argv.postgres) {
        database = "postgres";
        databaseType = "sql";
    } else if (argv.mongodb) {
        database = "mongodb";
        databaseType = "no_sql";
    } else throw new Error("Invalid database");

    let databaseOrm: ProjectConfig["databaseOrm"];
    if (argv.prisma) databaseOrm = "prisma";
    else if (argv.drizzle) databaseOrm = "drizzle";
    else if (argv.typeorm) databaseOrm = "typeorm";
    else if (argv.sequelize) databaseOrm = "sequelize";
    else if (argv.mongoose) databaseOrm = "mongoose";
    else throw new Error("Invalid ORM");

    let pkgManager: ProjectConfig["pkgManager"];
    if (argv.npm) pkgManager = "npm";
    else if (argv.yarn) pkgManager = "yarn";
    else if (argv.pnpm) pkgManager = "pnpm";
    else if (argv.bun) pkgManager = "bun";
    else throw new Error("Invalid package manager");

    return {
        databaseType,
        database,
        databaseOrm,
        language,
        pkgManager,
    };
}
