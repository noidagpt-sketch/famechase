import { query } from "./db.js";
import bcrypt from "bcryptjs";

export async function initializeDatabase() {
  console.log("Initializing database tables...");

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(50),
      password_hash VARCHAR(255) NOT NULL,
      city VARCHAR(255),
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) DEFAULT 'Admin',
      role VARCHAR(50) DEFAULT 'admin',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS quiz_data (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      guest_email VARCHAR(255),
      name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(50),
      age VARCHAR(50),
      city VARCHAR(255),
      primary_platform VARCHAR(100),
      secondary_platforms TEXT[],
      follower_count VARCHAR(100),
      engagement_rate VARCHAR(100),
      niche VARCHAR(255),
      content_type VARCHAR(255),
      posting_frequency VARCHAR(100),
      experience TEXT[],
      monthly_income VARCHAR(100),
      biggest_challenge TEXT[],
      goals TEXT[],
      social_links JSONB DEFAULT '{}',
      bio TEXT,
      language VARCHAR(50) DEFAULT 'english',
      analysis_data JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS downloads (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      guest_email VARCHAR(255),
      download_type VARCHAR(100),
      file_name VARCHAR(500),
      product_id VARCHAR(255),
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      guest_email VARCHAR(255),
      form_type VARCHAR(100) NOT NULL,
      form_data JSONB NOT NULL,
      ip_address VARCHAR(100),
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS purchases (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      guest_email VARCHAR(255),
      product_id VARCHAR(255) NOT NULL,
      product_name VARCHAR(500),
      amount DECIMAL(10,2) NOT NULL,
      payment_status VARCHAR(50) DEFAULT 'pending',
      payment_id VARCHAR(255),
      payment_method VARCHAR(100),
      customer_name VARCHAR(255),
      customer_email VARCHAR(255),
      customer_phone VARCHAR(50),
      customer_city VARCHAR(255),
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS traffic_log (
      id SERIAL PRIMARY KEY,
      ip_address VARCHAR(100),
      city VARCHAR(255),
      region VARCHAR(255),
      country VARCHAR(255),
      user_agent TEXT,
      path VARCHAR(255),
      referrer TEXT,
      is_bot BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await query(`
    ALTER TABLE traffic_log ADD COLUMN IF NOT EXISTS is_bot BOOLEAN DEFAULT FALSE
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS product_settings (
      id SERIAL PRIMARY KEY,
      product_id VARCHAR(255) UNIQUE NOT NULL,
      is_visible BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await query(`
    ALTER TABLE product_settings ADD COLUMN IF NOT EXISTS product_name VARCHAR(500)
  `);
  await query(`
    ALTER TABLE product_settings ADD COLUMN IF NOT EXISTS price DECIMAL(10,2)
  `);
  await query(`
    ALTER TABLE product_settings ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2)
  `);
  await query(`
    ALTER TABLE product_settings ADD COLUMN IF NOT EXISTS description TEXT
  `);
  await query(`
    ALTER TABLE product_settings ADD COLUMN IF NOT EXISTS category VARCHAR(100)
  `);
  await query(`
    ALTER TABLE product_settings ADD COLUMN IF NOT EXISTS features TEXT
  `);

  console.log("All database tables created successfully.");

  await seedAdminAccount();
}

async function seedAdminAccount() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("ADMIN_EMAIL or ADMIN_PASSWORD not set. Skipping admin seed.");
    return;
  }

  const existing = await query("SELECT id FROM admins WHERE email = $1", [adminEmail]);
  if (existing.rows.length > 0) {
    console.log(`Admin account already exists: ${adminEmail}`);
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  await query(
    "INSERT INTO admins (email, password_hash, name, role) VALUES ($1, $2, $3, $4)",
    [adminEmail, passwordHash, "FameChase Admin", "admin"]
  );

  console.log(`Admin account created: ${adminEmail}`);
}
