import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Database migration helper
export async function checkAndUpdateSchema() {
  try {
    console.log("Checking if database schema needs updates...");
    
    // Check if tables exist
    const checkTableResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'users'
    `);

    if (checkTableResult.rows.length === 0) {
      console.log("Tables not found. You may need to run migrations.");
      return;
    }
    
    // Check if isBlocked column exists in users table
    const checkColumnResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'is_blocked'
    `);
    
    // If the column doesn't exist, add it
    if (checkColumnResult.rows.length === 0) {
      console.log("Adding is_blocked column to users table...");
      await pool.query(`
        ALTER TABLE users
        ADD COLUMN is_blocked BOOLEAN NOT NULL DEFAULT false
      `);
      console.log("Successfully added is_blocked column to users table");
    } else {
      console.log("is_blocked column already exists in users table");
    }
    
    console.log("Database schema check complete");
  } catch (error) {
    console.error("Error checking or updating database schema:", error);
    // Don't throw the error, just log it to allow server to start
    console.log("Will continue starting the server despite schema check error");
  }
}

// Run the migration check
checkAndUpdateSchema().catch(err => {
  console.error("Failed to update database schema:", err);
  // Don't crash the server if schema update fails
  console.log("Will continue starting the server despite schema update error");
});
