### ORM Init CLI Tool

A CLI tool for setting up popular SQL and NoSQL ORMs/ODMs in Node.js projects, with support for both JavaScript and TypeScript.

[![npm version](https://badge.fury.io/js/%40excli%2Form-init.svg)](https://badge.fury.io/js/%40excli%2Form-init)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**Part of the [`excli`](#excli-ecosystem) ecosystem.**

---

## Features

- 🗄️ **SQL** — MySQL, MariaDB, PostgreSQL
- 🍃 **NoSQL** — MongoDB
- 🔗 **ORMs/ODMs** — Prisma, Sequelize, TypeORM, Drizzle, Mongoose
- 🚀 **JS & TS** support
- 📦 **Package managers** — npm, yarn, pnpm, bun
- ⚡ Interactive and flag-based modes

---

## Usage

### Interactive Mode

```bash
npx @excli/orm-init
```

Guides you through selecting database, ORM, language, and package manager.

### Flag-Based Mode

```bash
# TypeScript + PostgreSQL + Prisma + pnpm
npx @excli/orm-init --ts --pnpm --postgres --prisma

# JavaScript + MongoDB + Mongoose + npm
npx @excli/orm-init --js --npm --mongodb --mongoose

# TypeScript + MySQL + TypeORM + yarn
npx @excli/orm-init --ts --yarn --mysql --typeorm

# TypeScript + PostgreSQL + Drizzle + bun
npx @excli/orm-init --ts --bun --postgres --drizzle

# JavaScript + MySQL + Sequelize + pnpm
npx @excli/orm-init --js --pnpm --mysql --sequelize
```

### Global Install

```bash
npm install -g @excli/orm-init
excli-orm-init [flags]
```

### Requirements

- Node.js 20+
- A running database (local or via [`@excli/docker`](https://www.npmjs.com/package/@excli/docker))

---

## Flags

| Category            | Flag                                                          | Description              |
| ------------------- | ------------------------------------------------------------- | ------------------------ |
| **Language**        | `--ts` / `--js`                                               | TypeScript or JavaScript |
| **Database**        | `--mysql` `--mariadb` `--postgres` `--mongodb`                | Target database          |
| **ORM/ODM**         | `--prisma` `--sequelize` `--typeorm` `--drizzle` `--mongoose` | ORM/ODM to configure     |
| **Package Manager** | `--npm` `--yarn` `--pnpm` `--bun`                             | Package manager to use   |

---

## Compatibility Matrix

| ORM / ODM     | MySQL | MariaDB | PostgreSQL | MongoDB |
| ------------- | :---: | :-----: | :--------: | :-----: |
| **Prisma**    |  ✅   |   ✅    |     ✅     |   ✅    |
| **Sequelize** |  ✅   |   ✅    |     ✅     |   ❌    |
| **TypeORM**   |  ✅   |   ✅    |     ✅     |   ✅    |
| **Drizzle**   |  ✅   |   ✅    |     ✅     |   ❌    |
| **Mongoose**  |  ❌   |   ❌    |     ❌     |   ✅    |

Incompatible combinations are caught at runtime — the CLI will prompt you to correct them.

---

## What Gets Generated

- **ORM config file** — pre-configured database connection
- **Schema / Model file** — starter schema or model for your chosen ORM

> **Note:** `.env`, `.env.example`, and `.gitignore` are **not** generated. This is intentional so the tool integrates safely into both new and existing projects. Use [`@excli/docker`](https://www.npmjs.com/package/@excli/docker) to auto-generate a complete `.env`, or create one manually (see below).

## Known Issues & Gotchas

### Sequelize + MariaDB — Connection String Prefix

The `DATABASE_URL` must use the `mariadb://` prefix, not `mysql://`. Using the wrong prefix causes Sequelize to load the wrong driver.

```env
# ❌ Wrong
DATABASE_URL="mysql://root:password@localhost:3306/mydb"

# ✅ Correct
DATABASE_URL="mariadb://root:password@localhost:3306/mydb"
```

### Prisma — Shadow Database Error

During `prisma migrate dev`, Prisma requires a shadow database and needs `CREATE DATABASE` privileges. Use root credentials for local development.

```env
# ✅ Use root credentials for migrations
DATABASE_URL="mysql://root:rootpassword@localhost:3306/mydb"
```

> This only applies to `prisma migrate dev`. Production deployments use `prisma migrate deploy`, which does not require shadow database creation.

### TypeORM — `synchronize: true` in Production

Never enable `synchronize: true` in production — it can drop or alter columns on startup. Always use migrations instead.

```ts
// ❌ Development only
synchronize: true;

// ✅ Production
synchronize: false;
```

### Drizzle — Migration Folder

Drizzle outputs SQL migrations to a `drizzle/` folder. Commit this folder to version control — it serves as your migration history.

### Mongoose — No Migrations

MongoDB is schemaless; existing documents are not updated when your Mongoose schema changes. Handle data migrations manually.

---

## Troubleshooting

| Problem                          | Solution                                                |
| -------------------------------- | ------------------------------------------------------- |
| Prisma shadow database error     | Use root credentials in `DATABASE_URL`                  |
| Incompatible ORM + database      | Check the [compatibility matrix](#compatibility-matrix) |
| `.env` not generated             | Expected — create manually or use `@excli/docker`       |
| TypeORM decorators failing in JS | Use TypeScript; JS decorator support is limited         |
| Prisma Client not found          | Run `npx prisma generate` after setup                   |
| Connection refused               | Ensure your database is running before testing          |

---

## excli Ecosystem

| Package                                                          | Description                       |
| ---------------------------------------------------------------- | --------------------------------- |
| [`@excli/express`](https://www.npmjs.com/package/@excli/express) | Express app generator for JS/TS   |
| [`@excli/docker`](https://www.npmjs.com/package/@excli/docker)   | Docker Compose + `.env` generator |
| `@excli/orm-init`                                                | ORM/ODM setup _(this package)_    |

**Full project setup in one command:**

```bash
npx @excli/express
```

Scaffolds a complete Express app with Docker, a running database, and a configured ORM.

---

## Contributing

Bug reports, feature requests, and pull requests are welcome.

---

## License

ISC — see [LICENSE](./LICENSE) for details.

## Author

**Noman** · [pxycknomdictator@gmail.com](mailto:pxycknomdictator@gmail.com) · [@pxycknomdictator](https://github.com/pxycknomdictator)
