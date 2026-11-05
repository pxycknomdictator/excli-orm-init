## ORM Init CLI Tool

A CLI tool for setting up popular SQL and NoSQL ORMs/ODMs in Node.js projects, with support for JavaScript and TypeScript.

[![npm version](https://badge.fury.io/js/%40excli%2Form-init.svg)](https://badge.fury.io/js/%40excli%2Form-init)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## Features

- SQL: MySQL, MariaDB, PostgreSQL, SQLite
- NoSQL: MongoDB
- ORMs/ODMs: Sequelize, TypeORM, Drizzle, Mongoose, and the native MongoDB driver
- Query builders: Kysely
- TypeScript and JavaScript support
- Works with npm, yarn, pnpm, and bun
- Interactive or flag-based setup

## Requirements

- Node.js 20 or higher
- A running database (local, or via [`@excli/docker`](https://www.npmjs.com/package/@excli/docker))

## Quick Start

### Interactive mode

```bash
npx @excli/orm-init
```

You'll be asked for your language, database, database library category, ORM/ODM
or query builder, and package manager.

### Flag mode

```bash
npx @excli/orm-init --ts --pnpm --postgres --drizzle
```

### Global install

```bash
npm install -g @excli/orm-init
excli-orm-init
```

## Flags

| Category        | Flags                                                                    |
| --------------- | ------------------------------------------------------------------------ |
| Language        | `--ts`, `--js`                                                           |
| Database        | `--mysql`, `--mariadb`, `--postgres`, `--sqlite`, `--mongodb`            |
| ORM/ODM         | `--sequelize`, `--typeorm`, `--drizzle`, `--mongoose`, `--native-driver` |
| Query builder   | `--kysely`                                                               |
| Package manager | `--npm`, `--yarn`, `--pnpm`, `--bun`                                     |

### Examples

```bash
# JavaScript + MongoDB + Mongoose + npm
npx @excli/orm-init --js --npm --mongodb --mongoose

# TypeScript + MySQL + TypeORM + yarn
npx @excli/orm-init --ts --yarn --mysql --typeorm

# TypeScript + PostgreSQL + Drizzle + bun
npx @excli/orm-init --ts --bun --postgres --drizzle

# JavaScript + MySQL + Sequelize + pnpm
npx @excli/orm-init --js --pnpm --mysql --sequelize

# TypeScript + MongoDB + native driver + pnpm
npx @excli/orm-init --ts --pnpm --mongodb --native-driver
```

## Generated Files

- **ORM config file**: pre-configured database connection
- **Schema / model file**: starter schema or model for your chosen ORM
- **`.env`**: development environment variables, including `DATABASE_URL`
- **`.env.production`**: production environment variables

## Compatibility

| ORM / ODM         | MySQL | MariaDB | PostgreSQL | SQLite | MongoDB |
| ----------------- | :---: | :-----: | :--------: | :----: | :-----: |
| **Sequelize**     |  ✅   |   ✅    |     ✅     |   ✅   |   ❌    |
| **TypeORM**       |  ✅   |   ✅    |     ✅     |   ✅   |   ✅    |
| **Drizzle**       |  ✅   |   ✅    |     ✅     |   ✅   |   ❌    |
| **Kysely**        |  ✅   |   ✅    |     ✅     |   ✅   |   ❌    |
| **Mongoose**      |  ❌   |   ❌    |     ❌     |   ❌   |   ✅    |
| **Native driver** |  ❌   |   ❌    |     ❌     |   ❌   |   ✅    |

Incompatible combinations are caught at runtime, and the CLI will prompt you to correct them.

## Known Issues

**Sequelize + MariaDB: connection string prefix**
Use the `mariadb://` prefix, not `mysql://`. The wrong prefix makes Sequelize load the wrong driver.

```env
DATABASE_URL="mariadb://root:password@localhost:3306/mydb"
```

**TypeORM: `synchronize: true`**
Use it in development only, since it can drop or alter columns on startup. Set `synchronize: false` in production and use migrations.

**Drizzle: migration folder**
SQL migrations are written to `drizzle/`. Commit this folder, as it is your migration history.

**Kysely: migration runner**
Kysely migrations are generated under `src/db/migrations/`. Build the project and run
the generated `src/db/migrate` file to apply them.

**Mongoose: no migrations**
Existing documents are not updated when your schema changes, so handle data migrations manually.

## Troubleshooting

| Problem                          | Solution                                                   |
| -------------------------------- | ---------------------------------------------------------- |
| Incompatible ORM + database      | Check the [compatibility table](#compatibility)            |
| pnpm exits during approval       | The CLI automatically allows all dependency build packages |
| TypeORM decorators failing in JS | Use TypeScript, since JS decorator support is limited      |
| Connection refused               | Make sure your database is running                         |

## Contributing

Bug reports, feature requests, and pull requests are welcome. Please read the [Contributing Guide](CONTRIBUTING.md) before opening a PR.

## License

ISC. See [LICENSE](./LICENSE) for details.

## Author

**Noman**
[pxycknomdictator@gmail.com](mailto:pxycknomdictator@gmail.com) | [@pxycknomdictator](https://github.com/pxycknomdictator)
