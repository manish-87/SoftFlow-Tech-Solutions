import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Database migration helper
export async function checkAndUpdateSchema() {
  try {
    console.log("Checking if database schema needs updates...");
    
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
    throw error;
  }
}

// Run the migration check
checkAndUpdateSchema().catch(err => {
  console.error("Failed to update database schema:", err);
});
