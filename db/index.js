require("dotenv").config({ path: '.env-dev-pg' });
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.CONNECTION_STRING,
  ssl: true,
});

client.connect();

module.exports = client;
