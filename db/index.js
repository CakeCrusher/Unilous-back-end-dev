require("dotenv").config({ path: '.env-dev-pg' });
const { Client } = require("pg");

const query = `CREATE TABLE users
(
    ID serial PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    joined TIMESTAMP,
    last_logged_in TIMESTAMP
);

CREATE TABLE project
(
    ID serial PRIMARY KEY,
    creator_id integer NOT NULL,
    created TIMESTAMP NOT NULL,
    title VARCHAR (50),
    description VARCHAR (255),
    CONSTRAINT fk_project_user
		FOREIGN KEY (creator_id)
		REFERENCES users (ID)
);

INSERT INTO users
    (username, email, joined, last_logged_in)
VALUES
    ('HarveyD', 'harvey@email.com', current_timestamp, current_timestamp);

INSERT INTO project
    (creator_id, created, title, description)
VALUES
    (1, current_timestamp, 'A project title', 'A simple description')`

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

client.connect();

client.query(query, (err, res) => {
  console.log(err, res);
});

module.exports = client;
