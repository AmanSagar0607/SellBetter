import { desc } from "drizzle-orm";
import { 
  integer, 
  pgTable, 
  text, 
  varchar, 
  timestamp,
  primaryKey,
  decimal 
} from "drizzle-orm/pg-core";

// Users table schema
export const usersTable = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(), // Clerk user ID
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  image: varchar("image", { length: 1024 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Products table schema
export const productsTable = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  about: text("about"),
  category: varchar("category", { length: 255 }).notNull(),
  imageUrl: text("image_url").notNull(),
  productUrl: text("product_url").notNull(),
  message: text("message"),
  createdBy: varchar("created_by", { length: 255 }).notNull().references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const cartTable = pgTable("cart", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id").notNull().references(() => productsTable.id),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});