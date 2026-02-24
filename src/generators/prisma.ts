import type { ProjectConfig } from "src/types";

export async function setupPrisma(_config: ProjectConfig) {}

export function prismaSqlSchema() {
    return `model User {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(255)
  age       Int
  email     String   @unique @db.VarChar(255)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
`;
}

export function prismaNoSqlSchema() {
    return `model User {
  id        String   @id @map("_id") @default(auto())
  name      String
  age       Int
  email     String   @unique
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
`;
}
