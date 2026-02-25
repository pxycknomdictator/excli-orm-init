### ORM Init CLI Tool

A CLI tool for setting up popular SQL and NoSQL ORMs/ODMs in Node.js projects, with support for both JavaScript and TypeScript.

[![npm version](https://badge.fury.io/js/%40excli%2Form-init.svg)](https://badge.fury.io/js/%40excli%2Form-init)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

---

### Why Choose This Generator?

A CLI tool for scaffolding ORM and ODM configurations for JavaScript and TypeScript projects — supporting all major SQL and NoSQL databases with the most popular ORMs out of the box.

**Built for modern development:**

- 🚀 TypeScript or JavaScript support
- 🗄️ SQL databases: MySQL, MariaDB, PostgreSQL
- 🍃 NoSQL databases: MongoDB
- 🔗 ORM/ODM support: Prisma, Sequelize, TypeORM, Drizzle, Mongoose
- 📦 Multiple package manager support (npm, yarn, pnpm, bun)
- ⚡ Pre-configured boilerplate ready to use
- 🎯 **Interactive mode** for guided setup
- 🎨 **Simple flag-based CLI** for quick configuration

---

### Getting Started

#### Interactive Mode (Recommended for Beginners)

Simply run the command and follow the prompts:

```bash
npx @excli/orm-init
```

The interactive mode will guide you through selecting:

- Database type (SQL or NOSQL)
- Database (MySQL, MariaDB, PostgreSQL, MongoDB)
- ORM/ODM (Prisma, Sequelize, TypeORM, Drizzle, Mongoose)
- Programming language (TypeScript or JavaScript)
- Package manager (npm, yarn, pnpm, bun)

#### Quick Setup with Flags

For experienced users who know what they want:

```bash
# Prisma with PostgreSQL and pnpm (TypeScript)
npx @excli/orm-init --ts --pnpm --postgres --prisma

# Mongoose with MongoDB and npm (JavaScript)
npx @excli/orm-init --js --npm --mongodb --mongoose
```

**Or install globally:**

```bash
npm install -g @excli/orm-init

# Interactive mode
excli-orm-init

# With flags
excli-orm-init --ts --pnpm --postgres --prisma
```

#### Requirements

- Node.js 20 or higher
- npm, yarn, pnpm or bun
- A running database instance (local or Docker)

> 💡 **Tip:** Use [`@excli/docker`](https://www.npmjs.com/package/@excli/docker) to spin up your database with Docker before running this tool.

---

### Usage

#### Two Ways to Use

**1. Interactive Mode (Easiest)**

```bash
npx @excli/orm-init
```

Just answer the prompts and you're done!

**2. Flag-Based Mode (Fastest)**

```bash
# TypeScript + PostgreSQL + Prisma + pnpm
npx @excli/orm-init --ts --pnpm --postgres --prisma

# TypeScript + MySQL + TypeORM + yarn
npx @excli/orm-init --ts --yarn --mysql --typeorm

# JavaScript + MongoDB + Mongoose + npm
npx @excli/orm-init --js --npm --mongodb --mongoose

# TypeScript + PostgreSQL + Drizzle + bun
npx @excli/orm-init --ts --bun --postgres --drizzle

# JavaScript + MySQL + Sequelize + pnpm
npx @excli/orm-init --js --pnpm --mysql --sequelize
```

---

### Command-Line Flags

#### Language Flags

- `--ts` - TypeScript
- `--js` - JavaScript

#### Database Flags

- `--mysql` - MySQL database
- `--mariadb` - MariaDB database
- `--postgres` - PostgreSQL database
- `--mongodb` - MongoDB database

#### ORM / ODM Flags

- `--prisma` - Prisma ORM
- `--sequelize` - Sequelize ORM
- `--typeorm` - TypeORM
- `--drizzle` - Drizzle ORM
- `--mongoose` - Mongoose ODM (MongoDB only)

#### Package Manager Flags

- `--npm` - npm package manager
- `--yarn` - Yarn package manager
- `--pnpm` - pnpm package manager
- `--bun` - Bun package manager

**Examples:**

```bash
# TypeScript + PostgreSQL + Prisma + pnpm
npx @excli/orm-init --ts --pnpm --postgres --prisma

# JavaScript + MongoDB + Mongoose + yarn
npx @excli/orm-init --js --yarn --mongodb --mongoose

# TypeScript + MySQL + TypeORM + bun
npx @excli/orm-init --ts --bun --mysql --typeorm

# JavaScript + MariaDB + Sequelize + npm
npx @excli/orm-init --js --npm --mariadb --sequelize

# TypeScript + PostgreSQL + Drizzle + pnpm
npx @excli/orm-init --ts --pnpm --postgres --drizzle
```

---

### ORM / Database Compatibility

Not every ORM works with every database. Here's the full compatibility matrix:

| ORM / ODM     | MySQL | MariaDB | PostgreSQL | MongoDB |
| ------------- | ----- | ------- | ---------- | ------- |
| **Prisma**    | ✅    | ✅      | ✅         | ✅      |
| **Sequelize** | ✅    | ✅      | ✅         | ❌      |
| **TypeORM**   | ✅    | ✅      | ✅         | ✅      |
| **Drizzle**   | ✅    | ✅      | ✅         | ❌      |
| **Mongoose**  | ❌    | ❌      | ❌         | ✅      |

> **Note:** Mongoose is MongoDB-only. Drizzle and Sequelize are SQL-only. If you select an incompatible combination, the CLI will warn you and prompt you to correct it.

---

### What's Included

#### Generated Files

- **ORM config file** - Pre-configured connection setup for your chosen ORM
- **Schema / Model file** - Starter schema or model based on your ORM

> **⚠️ Note:** `@excli/orm-init` does **not** generate `.env` or `.gitignore` files. It only sets up your ORM/ODM. You are responsible for managing your own environment variables. See the [No .env Generation](#-no-env-file-generation) section below for your options.

---

### ⚠️ Important Notes

#### Prisma — Shadow Database Issue

When running Prisma migrations (especially with MySQL or MariaDB), you may encounter the following error:

```
Error: P3014 - Prisma Migrate could not create the shadow database.
```

**Why does this happen?**
Prisma requires a **shadow database** during migrations to detect schema drift. By default, it tries to create and drop a temporary database — which requires elevated database privileges.

**How to fix it:**
Use **root credentials** (or a user with `CREATE DATABASE` privileges) in your `.env` connection string instead of a restricted app user:

```env
# ❌ Restricted user — will cause shadow DB error
DATABASE_URL="mysql://appuser:password@localhost:3306/mydb"

# ✅ Root credentials — required for Prisma migrations
DATABASE_URL="mysql://root:rootpassword@localhost:3306/mydb"
```

> This is only required during development migrations (`prisma migrate dev`). In production, you use `prisma migrate deploy` which does **not** require shadow database creation.

If you're using Docker with `@excli/docker`, make sure to use the `MYSQL_ROOT_PASSWORD` / `POSTGRES_PASSWORD` credentials from your `.env` file, not the app-level user credentials.

---

#### TypeORM — `synchronize: true` Warning

TypeORM's `synchronize: true` option automatically syncs your entity schema to the database on every app start. This is convenient in development but **dangerous in production** — it can drop or alter columns unexpectedly.

```ts
// ❌ Never use in production
synchronize: true;

// ✅ Use migrations in production
synchronize: false;
```

Always use TypeORM migrations for production environments.

---

#### Drizzle — Migration Folder

Drizzle generates SQL migration files into a `drizzle/` folder by default. Make sure to commit this folder to version control — it acts as your migration history, similar to Prisma's `migrations/` folder.

---

#### Mongoose — No Migrations

Mongoose (MongoDB) is schemaless by nature, meaning there are no traditional migrations. If you change your schema, existing documents in the database won't be updated automatically. Plan your schema changes carefully and handle data migrations manually if needed.

---

#### 📄 No `.env` or `.gitignore` Generation

`@excli/orm-init` **does not generate `.env`, `.env.example`, or `.gitignore` files**. This is intentional — the tool is designed to be safely dropped into both new and existing projects without touching your environment configuration or git setup.

**You have two options for handling environment variables:**

**Option 1 — Manual Setup**

Create a `.env` file yourself in your project root with the required connection string for your ORM:

```env
# Prisma (MySQL)
DATABASE_URL="mysql://root:password@localhost:3306/mydb"

# Prisma (PostgreSQL)
DATABASE_URL="postgresql://root:password@localhost:5432/mydb"

# Prisma (MongoDB)
DATABASE_URL="mongodb://localhost:27017/mydb"

# Sequelize / TypeORM / Drizzle
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=mydb
```

And manually add `.env` to your `.gitignore`:

```bash
# .gitignore
.env
```

**Option 2 — Recommended: Use `@excli/docker` first**

[`@excli/docker`](https://www.npmjs.com/package/@excli/docker) automatically generates a complete .env file with correct database credentials and connection strings. The order doesn't matter — you can run `@excli/docker` before or after `@excli/orm-init`. Just make sure your .env is in place before starting your application.

---

### Troubleshooting

**Prisma shadow database error?**
Use root credentials in your `DATABASE_URL`. See the [Prisma — Shadow Database Issue](#prisma--shadow-database-issue) section above.

**Wrong ORM + database combination?**
Some ORMs don't support all databases (e.g., Mongoose is MongoDB-only, Drizzle is SQL-only). Check the [compatibility matrix](#orm--database-compatibility) above.

**`.env` file not generated?**
This is expected — `@excli/orm-init` does not create `.env` files. Create one manually or use `@excli/docker` which generates it for you automatically.

**TypeORM entity decorators not working in JavaScript?**
TypeORM's decorator support in plain JavaScript is limited. It's strongly recommended to use TypeScript with TypeORM for the best experience.

**Prisma Client not found after setup?**
Run `npx prisma generate` to generate the Prisma Client after your schema is in place.

**Connection refused errors?**
Make sure your database is running before testing the connection. Use [`@excli/docker`](https://www.npmjs.com/package/@excli/docker) to easily spin up a local database.

**Need help?**
Open an issue on GitHub with details about your problem.

---

### Works Great With

This package is part of the **excli** ecosystem:

| Package                                                          | Description                                                  |
| ---------------------------------------------------------------- | ------------------------------------------------------------ |
| [`@excli/express`](https://www.npmjs.com/package/@excli/express) | Express app generator for JS/TS                              |
| [`@excli/docker`](https://www.npmjs.com/package/@excli/docker)   | Docker Compose & Dockerfile generator with `.env` setup      |
| `@excli/orm-init`                                                | ORM/ODM setup for all SQL & NoSQL databases _(this package)_ |

#### 🚀 Complete App — Recommended Workflow

For a full project setup from scratch, use all three packages together:

```bash
npx @excli/express
```

This gives you a fully structured Express app with Docker, a running database, and a configured ORM — all in three commands.

#### 🔧 Adding to an Existing Project

Both `@excli/docker` and `@excli/orm-init` are safe to run inside an **existing project**. Neither of them will interfere with or overwrite your existing `.env` files, `.gitignore`, or project structure. You can drop them into any project at any time without breaking anything.

---

### Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

### License

ISC License - see LICENSE file for details.

### Author

**Noman**  
📧 [pxycknomdictator@gmail.com](mailto:pxycknomdictator@gmail.com)  
🔗 [@pxycknomdictator](https://github.com/pxycknomdictator)

---

**Happy coding! Built with ❤️ for developers who value productivity.**
