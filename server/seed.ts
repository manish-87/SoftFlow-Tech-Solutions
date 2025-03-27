import { db } from './db';
import { users } from '@shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { eq } from 'drizzle-orm';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  console.log('Seeding database...');
  
  // Check if admin user already exists
  const existingUsers = await db.select().from(users).where(eq(users.username, 'admin'));
  
  if (existingUsers.length === 0) {
    // Create admin user
    const password = await hashPassword('JMk@475869');
    await db.insert(users).values({
      username: 'admin',
      email: 'admin@softflow.tech',
      phone: '1234567890',
      password,
      isAdmin: true,
      isVerified: true // Admin is verified by default
    });
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }

  console.log('Seeding completed');
  process.exit(0);
}

main().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});