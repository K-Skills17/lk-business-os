import { pgTable, serial, text, boolean, integer, timestamp, json } from "drizzle-orm/pg-core";

export const phases = pgTable("phases", {
  id: serial("id").primaryKey(),
  order: integer("order").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  objective: text("objective"),
  description: text("description"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  phaseId: integer("phase_id").references(() => phases.id),
  text: text("text").notNull(),
  completed: boolean("completed").default(false).notNull(),
  category: text("category"),
  notes: text("notes"),
  sortOrder: integer("sort_order").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const modules = pgTable("os_modules", {
  id: serial("id").primaryKey(),
  order: integer("order").notNull(),
  name: text("name").notNull(),
  purpose: text("purpose").notNull(),
  components: json("components").$type<string[]>().default([]),
  metrics: json("metrics").$type<string[]>().default([]),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  order: integer("order").notNull(),
  name: text("name").notNull(),
  priceMin: integer("price_min"),
  priceMax: integer("price_max"),
  description: text("description"),
  features: json("features").$type<string[]>().default([]),
  isFlagship: boolean("is_flagship").default(false),
});

export const docs = pgTable("docs", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
