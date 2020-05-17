CREATE TABLE user_account
(
	id serial PRIMARY KEY,
	username VARCHAR (50) UNIQUE NOT NULL,
	password VARCHAR (50) NOT NULL,
	email VARCHAR (50) UNIQUE,
	referenceLink TEXT UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_posts
(
	post_id serial PRIMARY KEY,
	title VARCHAR (100) UNIQUE NOT NULL,
	contactLink VARCHAR (255) UNIQUE NOT NULL,
	time DATE NOT NULL DEFAULT NOW(),
	description TEXT UNIQUE NOT NULL,
	color VARCHAR (20) NOT NULL,
	isSavedPost INTEGER NOT NULL DEFAULT 0,
	user_posts_id INTEGER NOT NULL
);

CREATE TABLE skillNames
(
	id serial PRIMARY KEY,
	type VARCHAR (100) NOT NULL,
	skill_id INTEGER NOT NULL
);

CREATE TABLE skillCapacities
(
	id serial PRIMARY KEY,
	type INTEGER NOT NULL,
	skill_capacity_id INTEGER NOT NULL
);

CREATE TABLE skillFills
(
	id serial PRIMARY KEY,
	type INTEGER NOT NULL,
	skill_fill_id INTEGER NOT NULL
);

CREATE TABLE team
(
	id serial PRIMARY KEY,
	type VARCHAR (255),
	team_id INTEGER NOT NULL
);

CREATE TABLE imageLinks
(
	id serial PRIMARY KEY,
	type VARCHAR (255),
	image_link_id INTEGER NOT NULL
);

CREATE TABLE referenceLinks
(
	id serial PRIMARY KEY,
	type VARCHAR (255),
	reference_link_id INTEGER NOT NULL
);

CREATE TABLE notification
(
	id serial PRIMARY KEY,
	message TEXT,
	quetion TEXT,
	answer TEXT,
	accepted BOOLEAN,
	userFrom_id INTEGER NOT NULL,
	userTo_id INTEGER NOT NULL,
	post_id INTEGER NOT NULL
);

CREATE TABLE proposedContribution
(
	id serial PRIMARY KEY,
	type INTEGER,
	notification_id INTEGER NOT NULL
);

ALTER TABLE user_posts 
	ADD CONSTRAINT posts_id_fkey FOREIGN KEY
	(
		user_posts_id
	) REFERENCES user_account (
		id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE skillNames 
	ADD CONSTRAINT skill_id_fkey FOREIGN KEY
	(
		skill_id
	) REFERENCES user_posts (
		post_id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE skillCapacities 
	ADD CONSTRAINT skill_capacity_id_fkey FOREIGN KEY
	(
		skill_capacity_id
	) REFERENCES user_posts (
		post_id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE skillFills 
	ADD CONSTRAINT skill_fill_id_fkey FOREIGN KEY
	(
		skill_fill_id
	) REFERENCES user_posts (
		post_id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE team 
	ADD CONSTRAINT team_id_fkey FOREIGN KEY
	(
		team_id
	) REFERENCES user_posts (
		post_id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE imageLinks 
	ADD CONSTRAINT image_link_id_fkey FOREIGN KEY
	(
		image_link_id
	) REFERENCES user_posts (
		post_id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE referenceLinks 
	ADD CONSTRAINT reference_link_id_fkey FOREIGN KEY
	(
		reference_link_id
	) REFERENCES user_posts (
		post_id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE notification 
	ADD CONSTRAINT userFrom_id_fkey FOREIGN KEY
	(
		userFrom_id
	) REFERENCES user_account (
		id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE notification 
	ADD CONSTRAINT userTo_id_fkey FOREIGN KEY
	(
		userTo_id
	) REFERENCES user_account (
		id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE notification
	ADD CONSTRAINT post_id_fkey FOREIGN KEY
	(
		post_id
	) REFERENCES user_posts (
		post_id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE proposedContribution 
	ADD CONSTRAINT notification_id_fkey FOREIGN KEY
	(
		notification_id
	) REFERENCES notification (
		id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;