# Prisma Seeding & Migrations — Kenyan Blog and E-Commerce Store

A Prisma ORM 7 + PostgreSQL project that seeds a **blog platform** and an **e-commerce store** with realistic Kenyan data, and walks through a schema-migration workflow. Seed data is generated with [`@faker-js/faker`](https://fakerjs.dev/) on top of hand-curated catalogs, so it is varied but always meaningful, and reproducible between runs.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Data Model](#data-model)
- [Task 1: Blog Platform Seed](#task-1-blog-platform-seed)
- [Task 2: E-Commerce Store Seed](#task-2-e-commerce-store-seed)
- [Task 3: Schema Migration](#task-3-schema-migration)
- [Bonus: Realistic Data with Faker](#bonus-realistic-data-with-faker)
- [Useful Commands](#useful-commands)
- [Troubleshooting](#troubleshooting)

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | 22.x | Runtime |
| [Prisma ORM](https://www.prisma.io/) | 7.10 | Schema, migrations, client |
| [`@prisma/adapter-pg`](https://www.prisma.io/docs/orm/overview/databases/postgresql) | 7.10 | PostgreSQL driver adapter (required in Prisma 7) |
| [PostgreSQL](https://www.postgresql.org/) | — | Database (hosted on Supabase) |
| [`@faker-js/faker`](https://fakerjs.dev/) | 10.x | Seed data generation |
| [`dotenv`](https://github.com/motdotla/dotenv) | 18.x | Loads `DATABASE_URL` from `.env` |

---

## Project Structure

```text
.
├── prisma/
│   ├── migrations/
│   │   ├── 20261114174449_init/                        # Initial schema
│   │   ├── 20261114181256_add_likes_and_rating/        # Task 3a & 3b
│   │   └── 20261114183624_fix_product_rating_precision/ # rating -> DECIMAL(2,1)
│   ├── schema.prisma                                   # Data model
│   └── seed.js                                         # Blog + e-commerce seed script
├── screenshots/                                        # Evidence for each task
├── prisma7.config.ts                                   # Prisma config (schema, migrations, seed)
├── package.json
└── .env                                                # DATABASE_URL (not committed)
```

---

## Getting Started

### Prerequisites

- Node.js 20.19+ (22.x recommended)
- A PostgreSQL database and its connection string

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the database

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

> `.env` is listed in `.gitignore` — never commit real credentials.

### 3. Apply migrations and generate the client

```bash
npx prisma migrate dev --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
```

> **Prisma 7 note:** `migrate dev` and `migrate reset` no longer run `prisma generate` automatically. Run it after every schema change, otherwise Prisma Client will not know about new fields.

### 4. Seed the database

```bash
npx prisma db seed --config prisma7.config.ts
```

The seed command is configured in `prisma7.config.ts` (`node prisma/seed.js`). The script **clears all existing data first**, so it can be re-run safely at any time.

---

## Data Model

The schema in [`prisma/schema.prisma`](prisma/schema.prisma) has two domains that share the `User` table:

| Domain | Models | Relationships |
|---|---|---|
| Blog | `User`, `Post`, `Comment`, `Tag` | A user writes many posts and comments; posts ↔ tags is many-to-many (`_PostToTag`) |
| E-commerce | `Category`, `Product`, `Order`, `OrderItem` | A category has many products; a user (customer) has many orders; an order has many items, each pointing to a product |

```text
User ─┬─< Post >─< Tag
      ├─< Comment >── Post
      └─< Order ─< OrderItem >── Product >── Category
```

---

## Task 1: Blog Platform Seed

The seed creates the blog data in foreign-key-safe order after clearing existing rows (`Comment → OrderItem → Order → Post → Product → Category → Tag → User`).

| Data | Count | Details |
|---|---|---|
| Users | 10 | Kenyan names and bios, e.g. *Wanjiku Kamau — Tech writer from Westlands, Nairobi* |
| Tags | 8 | `javascript`, `react`, `nodejs`, `prisma`, `career`, `tutorial`, `kenya-tech`, `ai` |
| Posts | 30 | 25 published, 5 drafts; 1–3 tags each; `createdAt` spread across the last 3 months |
| Comments | 50 | Only on published posts; never written by the post's own author; dated after the post |

Example post titles: *Integrating M-Pesa Daraja API with Node.js*, *From Jua Kali to JavaScript: My Coding Journey*, *How I Built My First SaaS Product from Kibera*, *The State of AI Startups in East Africa*.

**Seed output**

![Task 1 — blog seed output](screenshots/Task%201.png)

---

## Task 2: E-Commerce Store Seed

The blog users are reused as customers, so both domains share one `User` table.

| Data | Count | Details |
|---|---|---|
| Categories | 5 | Electronics, Clothing, Food & Groceries, Home & Kitchen, Books & Stationery |
| Products | 20 | 4 per category, realistic KES prices (e.g. *Tecno Spark 20*, *Jogoo Maize Flour 2kg*, *Weep Not Child — Ngugi*); 3 out of stock |
| Users updated | 10 | A Kenyan phone number (`07XXXXXXXX` / `01XXXXXXXX`) is appended to each bio |
| Orders | 15 | 6 delivered, 3 shipped, 4 pending, 2 cancelled; every customer has at least one order |
| Order items | 38 | 1–4 per order; each stores the product price at the time of purchase; order totals are computed from items |

Business rules enforced by the seed:

- Pending and shipped orders only contain **in-stock** products.
- Groceries are bought in larger quantities (1–6); other items 1–2 at a time.
- Order dates match their status — delivered orders are older, pending orders are from the last couple of days.

**Seed output**

![Task 2 — e-commerce seed output](screenshots/Task%202.png)

---

## Task 3: Schema Migration

### 3a & 3b — Add `likes` and `rating`

```prisma
model Post {
  // ...existing fields
  likes  Int      @default(0)
}

model Product {
  // ...existing fields
  rating Decimal? @db.Decimal(2, 1) // 0.0 to 5.0
}
```

```bash
npx prisma migrate dev --name add_likes_and_rating --config prisma7.config.ts
```

Generated SQL ([`20261114181256_add_likes_and_rating`](prisma/migrations/20261114181256_add_likes_and_rating/migration.sql)):

```sql
ALTER TABLE "Post"    ADD COLUMN "likes"  INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN "rating" DECIMAL(65,30);
```

![Task 3a & 3b — migration applied](screenshots/Task%203a%26b.png)

A follow-up migration ([`20261114183624_fix_product_rating_precision`](prisma/migrations/20261114183624_fix_product_rating_precision/migration.sql)) narrows `rating` to `DECIMAL(2,1)` so ratings are stored with exactly one decimal place (e.g. `4.7`):

```sql
ALTER TABLE "Product" ALTER COLUMN "rating" SET DATA TYPE DECIMAL(2,1);
```

> A new migration was added rather than editing the applied one — changing an already-applied migration breaks the migration history and forces a database reset.

### 3c — Seed the new fields

- `Post.likes` — random integer between **0 and 100**
- `Product.rating` — random value between **1.0 and 5.0** (one decimal place)

```bash
npx prisma migrate reset --config prisma7.config.ts   # drops, re-applies all migrations
npx prisma generate --config prisma7.config.ts
npx prisma db seed --config prisma7.config.ts
```

### Verification in Prisma Studio

`Post` table with the new `likes` column:

![Task 3 — Post likes column in Prisma Studio](screenshots/Task%203.2.png)

`Product` table with the new `rating` column:

![Task 3 — Product rating column in Prisma Studio](screenshots/Task%203.1.png)

---

## Bonus: Realistic Data with Faker

The seed uses `@faker-js/faker` plus Kenyan-specific helpers (`generateKenyanName()`, `generateKenyanPhone()`, Nairobi neighbourhoods and Kenyan towns) to generate varied data **without producing gibberish**:

| Hand-curated (meaning) | Generated with faker (variety) |
|---|---|
| The 10 required users | Phone numbers via `generateKenyanPhone()` |
| Post titles, content and tags | Draft selection, `createdAt` (last 90 days), `likes` (0–100) |
| Comment templates | Names, towns and neighbourhoods filled into templates; commenter; date after the post |
| Product names, descriptions, KES price ranges | Price within range (rounded like shop prices), stock, out-of-stock items, rating |
| Order status mix and item total (to match expected output) | Customers, products, quantities, order dates by status |

Design decisions:

- **Reproducible:** `faker.seed(2026)` makes every run produce the same data. The provided helpers were adapted to use faker instead of `Math.random()` so the seed applies to them too.
- **No lorem ipsum:** `faker.lorem` produces Latin placeholder text, so titles, content and comments come from curated text instead.
- **Stable counts:** totals (30 posts, 50 comments, 15 orders, 38 items) are fixed, so the seed summary always matches the assignment.

### Prisma Studio — seeded data

**Posts** — curated titles with faker-generated dates, likes and draft status:

![Bonus — seeded posts in Prisma Studio](screenshots/Seeded%20Posts.png)

**Comments** — templates filled with generated Kenyan names and places:

![Bonus — seeded comments in Prisma Studio](screenshots/Comments.png)

**Products** — faker-generated KES prices, stock (including out-of-stock) and ratings:

![Bonus — seeded products in Prisma Studio](screenshots/Products.png)

**Tags**:

![Bonus — seeded tags in Prisma Studio](screenshots/Tags.png)

---

## Useful Commands

| Command | Description |
|---|---|
| `npx prisma migrate dev --name <name> --config prisma7.config.ts` | Create and apply a migration from schema changes |
| `npx prisma migrate reset --config prisma7.config.ts` | Drop the database and re-apply all migrations |
| `npx prisma generate --config prisma7.config.ts` | Regenerate Prisma Client after schema changes |
| `npx prisma db seed --config prisma7.config.ts` | Run `prisma/seed.js` |
| `npx prisma studio --config prisma7.config.ts` | Browse the data in Prisma Studio |
| `npx prisma validate --config prisma7.config.ts` | Validate `schema.prisma` |

---

## Troubleshooting

**`Unknown argument 'likes'` when seeding**
Prisma Client is out of date. Run `npx prisma generate` — in Prisma 7 migrations do not regenerate the client automatically.

**`injected env (0) from .env` in the seed output**
Not an error. `prisma7.config.ts` already loads `.env`, and the seed process inherits `DATABASE_URL`. When `seed.js` calls `dotenv` again, the variable is already set, so dotenv skips it and reports 0 newly injected variables.

**Migration asks to reset the database**
The migration history no longer matches the files in `prisma/migrations` (usually because an applied migration was edited). Restore the original file, or add a new migration for the change instead.
