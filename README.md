### ORM Init CLI Tool

A CLI tool for setting up popular SQL and NoSQL ORMs/ODMs in Node.js projects, with support for both JavaScript and TypeScript.

[![npm version](https://badge.fury.io/js/%40excli%2Form-init.svg)](https://badge.fury.io/js/%40excli%2Form-init)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**Part of the [`excli`](#excli-ecosystem) ecosystem.**

---

### Why Choose This Tool?

Stop wiring ORM boilerplate manually. `@excli/orm-init` gets your database layer production-ready in seconds, whether you're starting fresh or dropping into an existing project.

**Built for modern development:**

- 🗄️ **SQL** — MySQL, MariaDB, PostgreSQL, SQLite
- 🍃 **NoSQL** — MongoDB
- 🔗 **ORMs/ODMs** — Prisma, Sequelize, TypeORM, Drizzle, Mongoose
- 🚀 TypeScript & JavaScript support
- 📦 Works with npm, yarn, pnpm, and bun
- ⚡ Interactive and flag-based modes

---

### Getting Started

No installation needed! Just run:

```bash
npx @excli/orm-init
```

**Or install globally:**

```bash
npm install -g @excli/orm-init
excli-orm-init [flags]
```

#### Requirements

- Node.js 20 or higher
- A running database (local or via [`@excli/docker`](https://www.npmjs.com/package/@excli/docker))

---

### Usage

#### Interactive Mode

Run the CLI and follow the prompts:

```bash
npx @excli/orm-init
```

**You'll be asked about:**

1. **Language** — TypeScript or JavaScript
2. **Database** — MySQL, MariaDB, PostgreSQL, SQLite, or MongoDB
3. **ORM/ODM** — Your preferred ORM for the chosen database
4. **Package Manager** — npm, yarn, pnpm, or bun

#### Flag-Based Mode

Skip the prompts and pass everything directly:

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

# TypeScript + SQLite + Drizzle + pnpm
npx @excli/orm-init --ts --pnpm --sqlite --drizzle
```

---

### Flags

| Category            | Flag                                                          | Description              |
| ------------------- | ------------------------------------------------------------- | ------------------------ |
| **Language**        | `--ts` / `--js`                                               | TypeScript or JavaScript |
| **Database**        | `--mysql` `--mariadb` `--postgres` `--mongodb` `--sqlite`     | Target database          |
| **ORM/ODM**         | `--prisma` `--sequelize` `--typeorm` `--drizzle` `--mongoose` | ORM/ODM to configure     |
| **Package Manager** | `--npm` `--yarn` `--pnpm` `--bun`                             | Package manager to use   |

---

### What's Included

#### Generated Files

After running the CLI, you get:

- **ORM config file** — pre-configured database connection
- **Schema / Model file** — starter schema or model for your chosen ORM

> **Note:** `.env`, `.env.example`, and `.gitignore` are **not** generated. This is intentional so the tool integrates safely into both new and existing projects. Use [`@excli/docker`](https://www.npmjs.com/package/@excli/docker) to auto-generate a complete `.env`, or create one manually.

#### Compatibility Matrix

| ORM / ODM     | MySQL | MariaDB | PostgreSQL | SQLite | MongoDB |
| ------------- | :---: | :-----: | :--------: | :----: | :-----: |
| **Prisma**    |  ✅   |   ✅    |     ✅     |   ✅   |   ✅    |
| **Sequelize** |  ✅   |   ✅    |     ✅     |   ✅   |   ❌    |
| **TypeORM**   |  ✅   |   ✅    |     ✅     |   ✅   |   ✅    |
| **Drizzle**   |  ✅   |   ✅    |     ✅     |   ✅   |   ❌    |
| **Mongoose**  |  ❌   |   ❌    |     ❌     |   ❌   |   ✅    |

Incompatible combinations are caught at runtime — the CLI will prompt you to correct them.

---

### Known Issues & Gotchas

#### Sequelize + MariaDB — Connection String Prefix

The `DATABASE_URL` must use the `mariadb://` prefix, not `mysql://`. Using the wrong prefix causes Sequelize to load the wrong driver.

```env
# ❌ Wrong
DATABASE_URL="mysql://root:password@localhost:3306/mydb"

# ✅ Correct
DATABASE_URL="mariadb://root:password@localhost:3306/mydb"
```

#### Prisma — Shadow Database Error

During `prisma migrate dev`, Prisma requires a shadow database and needs `CREATE DATABASE` privileges. Use root credentials for local development.

```env
# ✅ Use root credentials for migrations
DATABASE_URL="mysql://root:rootpassword@localhost:3306/mydb"
```

> This only applies to `prisma migrate dev`. Production deployments use `prisma migrate deploy`, which does not require shadow database creation.

#### TypeORM — `synchronize: true` in Production

Never enable `synchronize: true` in production — it can drop or alter columns on startup. Always use migrations instead.

```ts
// ❌ Development only
synchronize: true;

// ✅ Production
synchronize: false;
```

#### Drizzle — Migration Folder

Drizzle outputs SQL migrations to a `drizzle/` folder. Commit this folder to version control — it serves as your migration history.

#### Mongoose — No Migrations

MongoDB is schemaless; existing documents are not updated when your Mongoose schema changes. Handle data migrations manually.

---

### Troubleshooting

| Problem                          | Solution                                                |
| -------------------------------- | ------------------------------------------------------- |
| Prisma shadow database error     | Use root credentials in `DATABASE_URL`                  |
| Incompatible ORM + database      | Check the [compatibility matrix](#compatibility-matrix) |
| `.env` not generated             | Expected — create manually or use `@excli/docker`       |
| TypeORM decorators failing in JS | Use TypeScript; JS decorator support is limited         |
| Prisma Client not found          | Run `npx prisma generate` after setup                   |
| Connection refused               | Ensure your database is running before testing          |

---

### excli Ecosystem

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

### Contributing

Bug reports, feature requests, and pull requests are welcome. Please read the [Contributing Guide](CONTRIBUTING.md) before opening a PR.

---

### License

ISC License — see [LICENSE](./LICENSE) for details.

### Author

**Noman**  
📧 [pxycknomdictator@gmail.com](mailto:pxycknomdictator@gmail.com)  
🐙 [@pxycknomdictator](https://github.com/pxycknomdictator)

---

**Happy coding! Built with ❤️ for developers who value productivity.**
