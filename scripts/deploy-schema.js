const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:@Adity93694@db.kuqljlyywdtztylqjtyn.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function migrate() {
  try {
    await client.connect();
    console.log('Connected to database');

    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema...');
    await client.query(schemaSql);
    console.log('Schema applied successfully!');
  } catch (err) {
    console.error('Error applying schema:', err);
  } finally {
    await client.end();
  }
}

migrate();
