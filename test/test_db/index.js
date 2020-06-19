require("dotenv").config({ path: ".env-test-pg" });
const { Client } = require("pg");

const client = new Client({
  user: process.env.DATABASE_USERNAME,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  ssl: { rejectUnauthorized: false },
});

client.connect();

module.exports = client;
