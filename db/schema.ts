import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const batches = sqliteTable("batches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  batchId: text("batch_id").notNull().unique(),
  mixerNo: text("mixer_no"),
  collectedDate: text("collected_date"),
  initialData: text("initial_data").notNull().default("{}"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const observations = sqliteTable("observations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  batchId: text("batch_id").notNull(),
  timestamp: text("timestamp").notNull(),
  elapsedSeconds: text("elapsed_seconds"),
  data: text("data").notNull().default("{}"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
