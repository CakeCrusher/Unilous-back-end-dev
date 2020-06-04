CREATE TABLE user_account
(
	_id serial PRIMARY KEY,
	username character varying(50) UNIQUE NOT NULL,
	password character varying(60) NOT NULL,
	email VARCHAR (50) UNIQUE,
	interests TEXT,
	referenceLink TEXT UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE user_posts
(
	_id serial PRIMARY KEY,
	title VARCHAR (100) UNIQUE NOT NULL,
	contact_link VARCHAR (255) UNIQUE NOT NULL,
	"time" DATE NOT NULL DEFAULT NOW(),
	description TEXT UNIQUE NOT NULL,
	color VARCHAR (20) NOT NULL,
	user_id INTEGER NOT NULL,
	is_saved BOOLEAN DEFAULT true NOT NULL
);

CREATE TABLE imageLinks
(
	_id serial PRIMARY KEY,
	type TEXT,
	post_image_link_id INTEGER NOT NULL
);

CREATE TABLE referenceLinks
(
	id serial PRIMARY KEY,
	type TEXT,
	post_reference_link_id INTEGER NOT NULL
);

CREATE TABLE notification
(
	_id serial PRIMARY KEY,
	message TEXT,
	question TEXT,
	answer TEXT,
	accepted BOOLEAN,
	userfrom_id INTEGER NOT NULL,
	userto_id INTEGER NOT NULL,
	post_id INTEGER NOT NULL
);

CREATE TABLE skills (
	_id serial PRIMARY KEY,
    name VARCHAR (50) NOT NULL,
    uses INTEGER DEFAULT 0 NOT NULL
);

CREATE TABLE post_skills (
	_id serial PRIMARY KEY,
    needed INTEGER DEFAULT 0 NOT NULL,
    filled INTEGER DEFAULT 0 NOT NULL,
	skill_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL
);

CREATE TABLE user_primary_skills (
    _id serial PRIMARY KEY,
    user_id  INTEGER NOT NULL,
    skill_id INTEGER NOT NULL
);

CREATE TABLE user_secondary_skills (
   _id serial PRIMARY KEY,
    skill_id INTEGER NOT NULL,
    user_id integer NOT NULL
);

CREATE TABLE user_saved_posts (
   _id serial PRIMARY KEY,
    user_id integer NOT NULL,
    post_id integer NOT NULL
);



CREATE TABLE proposedContribution
(
	_id serial PRIMARY KEY,
	type INTEGER,
	notification_id INTEGER NOT NULL
);

ALTER TABLE user_posts 
	ADD CONSTRAINT posts_id_fkey FOREIGN KEY
	(
		user_id
	) REFERENCES user_account (
		_id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
	;

ALTER TABLE imageLinks 
	ADD CONSTRAINT image_link_id_fkey FOREIGN KEY
	(
		post_image_link_id
	) REFERENCES user_posts (
		_id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE referenceLinks 
	ADD CONSTRAINT reference_link_id_fkey FOREIGN KEY
	(
		post_reference_link_id
	) REFERENCES user_posts (
		_id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE notification 
	ADD CONSTRAINT userfrom_id_fkey FOREIGN KEY
	(
		userfrom_id
	) REFERENCES user_account (
		_id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE notification 
	ADD CONSTRAINT userto_id_fkey FOREIGN KEY
	(
		userto_id
	) REFERENCES user_account (
		_id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE notification
	ADD CONSTRAINT notification_post_id_fkey FOREIGN KEY
	(
		post_id
	) REFERENCES user_posts (
		_id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE post_skills
    ADD CONSTRAINT posts_skills_id_fkey FOREIGN KEY 
	(
		post_id
    ) REFERENCES user_posts(
		 _id
	) 
	 ON UPDATE CASCADE
	 ON DELETE CASCADE;

ALTER TABLE post_skills
    ADD CONSTRAINT skill_id_fkey FOREIGN KEY 
	(
		skill_id
	) REFERENCES skills(
		_id
	)
	 ON UPDATE CASCADE 
	 ON DELETE CASCADE;

ALTER TABLE user_primary_skills
    ADD CONSTRAINT user_id_fkey FOREIGN KEY 
	(
		user_id
	) REFERENCES user_account(
		_id
	)
	 ON UPDATE CASCADE 
	 ON DELETE CASCADE;

 ALTER TABLE user_primary_skills
    ADD CONSTRAINT primary_skill_id_fkey FOREIGN KEY 
	(
		skill_id
	) REFERENCES skills(
		_id
	)
	 ON UPDATE CASCADE 
	 ON DELETE CASCADE;

 ALTER TABLE user_secondary_skills
    ADD CONSTRAINT secondary_skill_id_fkey FOREIGN KEY 
	(
		user_id
	) REFERENCES user_account(
		_id
	)
	 ON UPDATE CASCADE 
	 ON DELETE CASCADE;

 ALTER TABLE user_secondary_skills
    ADD CONSTRAINT skill_id_fkey FOREIGN KEY 
	(
		skill_id
	) REFERENCES skills(
		_id
	)
	 ON UPDATE CASCADE 
	 ON DELETE CASCADE;

ALTER TABLE user_saved_posts
    ADD CONSTRAINT post_id_fkey FOREIGN KEY 
	(
		post_id
	) REFERENCES user_posts(
		_id
	)
	 ON UPDATE CASCADE 
	 ON DELETE CASCADE;

ALTER TABLE user_saved_posts
    ADD CONSTRAINT user_id_fkey FOREIGN KEY 
	(
		user_id
	) REFERENCES user_account(
		_id
	)
	 ON UPDATE CASCADE 
	 ON DELETE CASCADE;


ALTER TABLE proposedContribution 
	ADD CONSTRAINT notification_id_fkey FOREIGN KEY
	(
		notification_id
	) REFERENCES notification (
		_id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE imageLinks
    ADD COLUMN user_id INTEGER NOT NULL;

ALTER TABLE referenceLinks
    ADD COLUMN user_id INTEGER NOT NULL;

ALTER TABLE imageLinks
    ADD CONSTRAINT user_image_link_id_fkey FOREIGN KEY 
	(
		user_id
	) REFERENCES user_account(
		_id
	)
	 ON UPDATE CASCADE 
	 ON DELETE CASCADE;

ALTER TABLE referenceLinks
    ADD CONSTRAINT user_image_link_id_fkey FOREIGN KEY 
	(
		user_id
	) REFERENCES user_account(
		_id
	)
	 ON UPDATE CASCADE 
	 ON DELETE CASCADE;

ALTER TABLE skills 
DROP  COLUMN if exists uses;

ALTER TABLE  user_primary_skills 
ADD  COLUMN uses INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE  user_secondary_skills 
ADD  COLUMN uses INTEGER DEFAULT 0 NOT NULL;