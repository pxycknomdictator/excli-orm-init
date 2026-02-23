import { dbLocation, schemasLocation } from "src/config";
import type { GenerateFileArgs, Language, ProjectConfig } from "src/types";
import { concatFileExtension, generateFile } from "src/utils";

export async function setupTypeOrm(config: ProjectConfig) {
    const { language, database } = config;

    const [dbPath, schemasPath] = concatFileExtension(
        language,
        dbLocation,
        schemasLocation,
    );

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

function typeOrmSchema() {
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

function typeOrmConnection(db: ProjectConfig["database"], lang: Language) {
    return `import { DataSource } from "typeorm";
import { User } from "./models/schemas.js";

export const AppDataSource = new DataSource({
    type: "${db}",
    url: process.env.DATABASE_URL${lang === "ts" ? "!" : ""},
    synchronize: true,
    entities: [User],
});
`;
}
