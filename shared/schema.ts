import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  password: text("password").notNull(),
  photo: text("photo"),
  bio: text("bio"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  portfolioUrl: text("portfolio_url"), 
  isAdmin: boolean("is_admin").default(false).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  isBlocked: boolean("is_blocked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  phone: true,
  password: true,
});

// Blog posts schema
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  coverImage: text("cover_image"),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
});

// Partner companies schema
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  website: text("website"),
});

export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
});

// Contact messages schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  service: text("service"),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  read: true, 
  createdAt: true,
});

// Career opportunities schema
export const careers = pgTable("careers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  department: text("department").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(), // full-time, part-time, contract
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCareerSchema = createInsertSchema(careers).omit({
  id: true,
  createdAt: true,
});

// Job applications schema
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  careerId: integer("career_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  resume: text("resume").notNull(), // PDF resume URL
  coverLetter: text("cover_letter"),
  status: text("status").default("pending").notNull(), // pending, reviewed, interviewing, rejected, hired
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Services schema
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  slug: text("slug").notNull().unique(),
  order: integer("order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

// User projects schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").default("planning").notNull(), // planning, in-progress, review, completed, on-hold
  completionPercentage: integer("completion_percentage").default(0).notNull(),
  startDate: date("start_date").notNull(),
  estimatedEndDate: date("estimated_end_date").notNull(),
  serviceType: text("service_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const projectUpdates = pgTable("project_updates", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  completionPercentage: integer("completion_percentage"),
  status: text("status"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProjectUpdateSchema = createInsertSchema(projectUpdates).omit({
  id: true,
  createdAt: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Career = typeof careers.$inferSelect;
export type InsertCareer = z.infer<typeof insertCareerSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type ProjectUpdate = typeof projectUpdates.$inferSelect;
export type InsertProjectUpdate = z.infer<typeof insertProjectUpdateSchema>;
