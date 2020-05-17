CREATE TABLE users
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
    (1, current_timestamp, 'A project title', 'A simple description')