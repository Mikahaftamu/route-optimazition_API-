const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  // First connect to default postgres database to create our database
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Create the database if it doesn't exist
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '${process.env.DB_DATABASE}') THEN
          CREATE DATABASE ${process.env.DB_DATABASE};
        END IF;
      END $$;
    `);
    
    await client.end();

    // Now connect to our database to create tables
    const dbClient = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    await dbClient.connect();
    console.log(`Connected to database ${process.env.DB_DATABASE}`);

    // Create tables
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        optimized_route JSONB NOT NULL,
        total_distance FLOAT NOT NULL,
        estimated_time VARCHAR(50) NOT NULL,
        waypoints JSONB NOT NULL,
        route_polyline TEXT NOT NULL,
        steps JSONB NOT NULL,
        webhook_url TEXT NOT NULL,
        input_data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS delivery_statuses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        route_id UUID NOT NULL REFERENCES routes(id),
        order_id VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_routes_created_at ON routes(created_at);
      CREATE INDEX IF NOT EXISTS idx_delivery_statuses_route_id ON delivery_statuses(route_id);
      CREATE INDEX IF NOT EXISTS idx_delivery_statuses_order_id ON delivery_statuses(order_id);
      CREATE INDEX IF NOT EXISTS idx_delivery_statuses_created_at ON delivery_statuses(created_at);
    `);

    // Create update timestamp function
    await dbClient.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create triggers
    await dbClient.query(`
      DROP TRIGGER IF EXISTS update_routes_updated_at ON routes;
      CREATE TRIGGER update_routes_updated_at
          BEFORE UPDATE ON routes
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_delivery_statuses_updated_at ON delivery_statuses;
      CREATE TRIGGER update_delivery_statuses_updated_at
          BEFORE UPDATE ON delivery_statuses
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    if (client) await client.end();
  }
}

initializeDatabase(); 