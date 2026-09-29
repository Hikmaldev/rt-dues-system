import fs from "fs";
import { Client } from "@neondatabase/serverless";

const envContent = fs.readFileSync(".env.local", "utf8");
const match = envContent.match(/DATABASE_URL="?([^"\r\n]+)"?/);
if (!match) {
  console.error("No DATABASE_URL found in .env.local");
  process.exit(1);
}

const url = match[1].trim();
console.log("Connecting via Neon Client...");
const client = new Client(url);

async function main() {
  try {
    await client.connect();
    console.log("Connected to Neon Postgres!");

    const schemaSql = fs.readFileSync("neon/schema.sql", "utf8");
    console.log("Executing neon/schema.sql...");
    await client.query(schemaSql);
    console.log("Schema applied successfully!");

    const res = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    console.log("Tables in database:", res.rows.map(r => r.table_name));

    const households = await client.query("SELECT COUNT(*) FROM households");
    console.log("Households count:", households.rows[0].count);

    const bills = await client.query("SELECT COUNT(*) FROM bills");
    console.log("Bills count:", bills.rows[0].count);

    const admins = await client.query("SELECT email, full_name, role FROM admins");
    console.log("Admins:", admins.rows);

    await client.end();
  } catch (err) {
    console.error("Migration error:", err);
    await client.end();
  }
}

main();
