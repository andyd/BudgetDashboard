/**
 * Database schema using Drizzle ORM.
 *
 * Define your tables here. Run `npx drizzle-kit push` after changes.
 * See: https://orm.drizzle.team/docs/sql-schema-declaration
 */
import { pgTable, text, timestamp, uuid, boolean, numeric, integer, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  emailVerified: boolean("email_verified").default(false),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const budgetItems = pgTable("budget_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  parentId: uuid("parent_id"),
  fiscalYear: integer("fiscal_year").notNull(),
  percentOfParent: real("percent_of_parent"),
  yoyChange: real("yoy_change"),
  level: integer("level").notNull().default(0),
  source: text("source"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const budgetItemsRelations = relations(budgetItems, ({ one, many }) => ({
  parent: one(budgetItems, {
    fields: [budgetItems.parentId],
    references: [budgetItems.id],
    relationName: "parent_child"
  }),
  children: many(budgetItems, {
    relationName: "parent_child"
  }),
  featuredComparisons: many(featuredComparisons),
  spotlightContent: many(spotlightContent),
}));

export const comparisonUnits = pgTable("comparison_units", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  costPerUnit: numeric("cost_per_unit", { precision: 20, scale: 2 }).notNull(),
  source: text("source"),
  sourceUrl: text("source_url"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comparisonUnitsRelations = relations(comparisonUnits, ({ many }) => ({
  featuredComparisons: many(featuredComparisons),
}));

export const featuredComparisons = pgTable("featured_comparisons", {
  id: uuid("id").primaryKey().defaultRandom(),
  budgetItemId: uuid("budget_item_id")
    .notNull()
    .references(() => budgetItems.id, { onDelete: "cascade" }),
  unitId: uuid("unit_id")
    .notNull()
    .references(() => comparisonUnits.id, { onDelete: "cascade" }),
  headline: text("headline").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const featuredComparisonsRelations = relations(featuredComparisons, ({ one }) => ({
  budgetItem: one(budgetItems, {
    fields: [featuredComparisons.budgetItemId],
    references: [budgetItems.id],
  }),
  unit: one(comparisonUnits, {
    fields: [featuredComparisons.unitId],
    references: [comparisonUnits.id],
  }),
}));

export const spotlightContent = pgTable("spotlight_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  budgetItemId: uuid("budget_item_id")
    .notNull()
    .references(() => budgetItems.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const spotlightContentRelations = relations(spotlightContent, ({ one }) => ({
  budgetItem: one(budgetItems, {
    fields: [spotlightContent.budgetItemId],
    references: [budgetItems.id],
  }),
}));
