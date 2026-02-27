import { dbLocation, schemasLocation } from "src/config";
import type { GenerateFileArgs, Language, ProjectConfig } from "src/types";
import { concatFileExtension, generateFile } from "src/utils";

const schemaMap: Record<string, () => string> = {
    sql_ts: typeOrmSqlTsSchema,
    sql_js: typeOrmSqlJsSchema,
    no_sql_ts: typeOrmNoSqlTsSchema,
    no_sql_js: typeOrmNoSqlJsSchema,
};

export async function setupTypeOrm(config: ProjectConfig) {
    const { language, database, databaseType } = config;

    const [dbPath, schemasPath] = concatFileExtension(
        language,
        dbLocation,
        schemasLocation,
    );

    const typeOrmSchema = schemaMap[`${databaseType}_${language}`];

    if (!typeOrmSchema) {
        throw new Error(`Unsupported combination: ${databaseType}_${language}`);
    }

    const typeorm: GenerateFileArgs[] = [
        { fileLocation: schemasPath!, fileContent: typeOrmSchema() },
        {
            fileLocation: dbPath!,
            fileContent: typeOrmConnection(database, language),
        },
    ];

    await Promise.all(
        typeorm.map(async (config) => await generateFile({ ...config })),
    );
}

function typeOrmSqlTsSchema() {
    return `import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "int" })
    age: number;

    @Index({ unique: true })
    @Column({ type: "varchar", length: 255 })
    email: string;

    @Column({ type: "boolean", default: true })
    isActive: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
`;
}

function typeOrmNoSqlTsSchema() {
    return `import {
    Entity,
    Column,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    ObjectId,
} from "typeorm";

@Entity({ name: "users" })
export class User {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column()
    age: number;

    @Index({ unique: true })
    @Column()
    email: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
`;
}

function typeOrmSqlJsSchema() {
    return `import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            length: 255,
        },
        age: {
            type: "int",
        },
        email: {
            type: "varchar",
            length: 255,
            unique: true,
        },
        isActive: {
            type: "boolean",
            default: true,
        },
        createdAt: {
            name: "created_at",
            type: "timestamp",
            createDate: true,
        },
        updatedAt: {
            name: "updated_at",
            type: "timestamp",
            updateDate: true,
        },
    },
});
`;
}

function typeOrmNoSqlJsSchema() {
    return `import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        _id: {
            primary: true,
            type: "objectid",
            generated: "uuid",
        },
        name: {
            type: String,
        },
        age: {
            type: Number,
        },
        email: {
            type: String,
            unique: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdAt: {
            type: Date,
            createDate: true,
        },
        updatedAt: {
            type: Date,
            updateDate: true,
        },
    },
});
`;
}

function typeOrmConnection(db: ProjectConfig["database"], lang: Language) {
    return `import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/schemas.js";

export const AppDataSource = new DataSource({
    type: "${db}",
    url: process.env.DATABASE_URL${lang === "ts" ? "!" : ""},
    synchronize: true,
    entities: [User],
});

export async function database() {
    try {
        await AppDataSource.initialize();
        console.log("Database is connected!");
    } catch (error) {
        throw new Error("failed to connect with database: ", { cause: error });
    }
}
`;
}
