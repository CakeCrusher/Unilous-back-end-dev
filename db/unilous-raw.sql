--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

-- Started on 2020-05-17 18:02:49

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 16384)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 2946 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 17686)
-- Name: imagelinks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.imagelinks (
    _id integer NOT NULL,
    type character varying(255),
    image_link_id integer NOT NULL
);


ALTER TABLE public.imagelinks OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 17684)
-- Name: imagelinks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.imagelinks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.imagelinks_id_seq OWNER TO postgres;

--
-- TOC entry 2947 (class 0 OID 0)
-- Dependencies: 215
-- Name: imagelinks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.imagelinks_id_seq OWNED BY public.imagelinks._id;


--
-- TOC entry 218 (class 1259 OID 17702)
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    _id integer NOT NULL,
    message text,
    question text,
    answer text,
    accepted boolean,
    userfrom_id integer NOT NULL,
    userto_id integer NOT NULL,
    post_id integer NOT NULL
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 17700)
-- Name: notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notification_id_seq OWNER TO postgres;

--
-- TOC entry 2948 (class 0 OID 0)
-- Dependencies: 217
-- Name: notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_id_seq OWNED BY public.notification._id;


--
-- TOC entry 222 (class 1259 OID 24587)
-- Name: post_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_skills (
    skill_id integer NOT NULL,
    needed integer DEFAULT 0 NOT NULL,
    filled integer DEFAULT 0 NOT NULL,
    post_id integer NOT NULL,
    _id integer NOT NULL
);


ALTER TABLE public.post_skills OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24608)
-- Name: post_skills__id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.post_skills ALTER COLUMN _id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.post_skills__id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 17713)
-- Name: proposedcontribution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proposedcontribution (
    _id integer NOT NULL,
    type integer,
    notification_id integer NOT NULL
);


ALTER TABLE public.proposedcontribution OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17711)
-- Name: proposedcontribution_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proposedcontribution_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.proposedcontribution_id_seq OWNER TO postgres;

--
-- TOC entry 2949 (class 0 OID 0)
-- Dependencies: 219
-- Name: proposedcontribution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.proposedcontribution_id_seq OWNED BY public.proposedcontribution._id;


--
-- TOC entry 221 (class 1259 OID 24581)
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skills (
    name character varying(50),
    _id integer NOT NULL,
    uses integer DEFAULT 0
);


ALTER TABLE public.skills OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 24612)
-- Name: skills__id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.skills ALTER COLUMN _id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.skills__id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 214 (class 1259 OID 17678)
-- Name: team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team (
    _id integer NOT NULL,
    type character varying(255),
    team_id integer NOT NULL
);


ALTER TABLE public.team OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 17676)
-- Name: team_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.team_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.team_id_seq OWNER TO postgres;

--
-- TOC entry 2950 (class 0 OID 0)
-- Dependencies: 213
-- Name: team_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.team_id_seq OWNED BY public.team._id;


--
-- TOC entry 204 (class 1259 OID 17586)
-- Name: user_account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_account (
    _id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(60) NOT NULL,
    email character varying(50),
    interests text,
    created_on timestamp without time zone DEFAULT now() NOT NULL,
    referencelink text NOT NULL
);


ALTER TABLE public.user_account OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 17584)
-- Name: user_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_account_id_seq OWNER TO postgres;

--
-- TOC entry 2951 (class 0 OID 0)
-- Dependencies: 203
-- Name: user_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_account_id_seq OWNED BY public.user_account._id;


--
-- TOC entry 210 (class 1259 OID 17624)
-- Name: user_interests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_interests (
    _id integer NOT NULL,
    ineterst text,
    user_interest_id integer
);


ALTER TABLE public.user_interests OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 17622)
-- Name: user_interests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_interests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_interests_id_seq OWNER TO postgres;

--
-- TOC entry 2952 (class 0 OID 0)
-- Dependencies: 209
-- Name: user_interests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_interests_id_seq OWNED BY public.user_interests._id;


--
-- TOC entry 212 (class 1259 OID 17635)
-- Name: user_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_posts (
    _id integer NOT NULL,
    title character varying(100) NOT NULL,
    contact_link character varying(255) NOT NULL,
    "time" date DEFAULT now() NOT NULL,
    description text NOT NULL,
    color character varying(20) NOT NULL,
    is_saved integer DEFAULT 0 NOT NULL,
    user_id integer NOT NULL,
    image_links text[] NOT NULL,
    reference_links text[] NOT NULL
);


ALTER TABLE public.user_posts OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 17633)
-- Name: user_posts_post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_posts_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_posts_post_id_seq OWNER TO postgres;

--
-- TOC entry 2953 (class 0 OID 0)
-- Dependencies: 211
-- Name: user_posts_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_posts_post_id_seq OWNED BY public.user_posts._id;


--
-- TOC entry 206 (class 1259 OID 17604)
-- Name: user_primary_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_primary_skills (
    _id integer NOT NULL,
    user_id character varying(50) NOT NULL,
    skill_id integer NOT NULL
);


ALTER TABLE public.user_primary_skills OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 17602)
-- Name: user_primary_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_primary_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_primary_skills_id_seq OWNER TO postgres;

--
-- TOC entry 2954 (class 0 OID 0)
-- Dependencies: 205
-- Name: user_primary_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_primary_skills_id_seq OWNED BY public.user_primary_skills._id;


--
-- TOC entry 208 (class 1259 OID 17614)
-- Name: user_secondary_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_secondary_skills (
    _id integer NOT NULL,
    skill_id character varying(50) NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.user_secondary_skills OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 17612)
-- Name: user_secondary_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_secondary_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_secondary_skills_id_seq OWNER TO postgres;

--
-- TOC entry 2955 (class 0 OID 0)
-- Dependencies: 207
-- Name: user_secondary_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_secondary_skills_id_seq OWNED BY public.user_secondary_skills._id;


--
-- TOC entry 2761 (class 2604 OID 17689)
-- Name: imagelinks _id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagelinks ALTER COLUMN _id SET DEFAULT nextval('public.imagelinks_id_seq'::regclass);


--
-- TOC entry 2762 (class 2604 OID 17705)
-- Name: notification _id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification ALTER COLUMN _id SET DEFAULT nextval('public.notification_id_seq'::regclass);


--
-- TOC entry 2763 (class 2604 OID 17716)
-- Name: proposedcontribution _id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proposedcontribution ALTER COLUMN _id SET DEFAULT nextval('public.proposedcontribution_id_seq'::regclass);


--
-- TOC entry 2760 (class 2604 OID 17681)
-- Name: team _id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team ALTER COLUMN _id SET DEFAULT nextval('public.team_id_seq'::regclass);


--
-- TOC entry 2752 (class 2604 OID 17589)
-- Name: user_account _id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account ALTER COLUMN _id SET DEFAULT nextval('public.user_account_id_seq'::regclass);


--
-- TOC entry 2756 (class 2604 OID 17627)
-- Name: user_interests _id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_interests ALTER COLUMN _id SET DEFAULT nextval('public.user_interests_id_seq'::regclass);


--
-- TOC entry 2757 (class 2604 OID 17638)
-- Name: user_posts _id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_posts ALTER COLUMN _id SET DEFAULT nextval('public.user_posts_post_id_seq'::regclass);


--
-- TOC entry 2754 (class 2604 OID 17607)
-- Name: user_primary_skills _id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_primary_skills ALTER COLUMN _id SET DEFAULT nextval('public.user_primary_skills_id_seq'::regclass);


--
-- TOC entry 2755 (class 2604 OID 17617)
-- Name: user_secondary_skills _id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_secondary_skills ALTER COLUMN _id SET DEFAULT nextval('public.user_secondary_skills_id_seq'::regclass);


--
-- TOC entry 2794 (class 2606 OID 17691)
-- Name: imagelinks imagelinks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagelinks
    ADD CONSTRAINT imagelinks_pkey PRIMARY KEY (_id);


--
-- TOC entry 2796 (class 2606 OID 17710)
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (_id);


--
-- TOC entry 2802 (class 2606 OID 24618)
-- Name: post_skills post_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_skills
    ADD CONSTRAINT post_skills_pkey PRIMARY KEY (_id);


--
-- TOC entry 2798 (class 2606 OID 17718)
-- Name: proposedcontribution proposedcontribution_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proposedcontribution
    ADD CONSTRAINT proposedcontribution_pkey PRIMARY KEY (_id);


--
-- TOC entry 2800 (class 2606 OID 24620)
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (_id);


--
-- TOC entry 2792 (class 2606 OID 17683)
-- Name: team team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (_id);


--
-- TOC entry 2768 (class 2606 OID 17599)
-- Name: user_account user_account_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_email_key UNIQUE (email);


--
-- TOC entry 2770 (class 2606 OID 17595)
-- Name: user_account user_account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_pkey PRIMARY KEY (_id);


--
-- TOC entry 2772 (class 2606 OID 17597)
-- Name: user_account user_account_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_username_key UNIQUE (username);


--
-- TOC entry 2782 (class 2606 OID 17632)
-- Name: user_interests user_interests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_interests
    ADD CONSTRAINT user_interests_pkey PRIMARY KEY (_id);


--
-- TOC entry 2784 (class 2606 OID 17649)
-- Name: user_posts user_posts_contactlink_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_posts
    ADD CONSTRAINT user_posts_contactlink_key UNIQUE (contact_link);


--
-- TOC entry 2786 (class 2606 OID 17651)
-- Name: user_posts user_posts_description_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_posts
    ADD CONSTRAINT user_posts_description_key UNIQUE (description);


--
-- TOC entry 2788 (class 2606 OID 17645)
-- Name: user_posts user_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_posts
    ADD CONSTRAINT user_posts_pkey PRIMARY KEY (_id);


--
-- TOC entry 2790 (class 2606 OID 17647)
-- Name: user_posts user_posts_title_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_posts
    ADD CONSTRAINT user_posts_title_key UNIQUE (title);


--
-- TOC entry 2774 (class 2606 OID 17611)
-- Name: user_primary_skills user_primary_skills_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_primary_skills
    ADD CONSTRAINT user_primary_skills_name_key UNIQUE (user_id);


--
-- TOC entry 2776 (class 2606 OID 17609)
-- Name: user_primary_skills user_primary_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_primary_skills
    ADD CONSTRAINT user_primary_skills_pkey PRIMARY KEY (_id);


--
-- TOC entry 2778 (class 2606 OID 17621)
-- Name: user_secondary_skills user_secondary_skills_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_secondary_skills
    ADD CONSTRAINT user_secondary_skills_name_key UNIQUE (skill_id);


--
-- TOC entry 2780 (class 2606 OID 17619)
-- Name: user_secondary_skills user_secondary_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_secondary_skills
    ADD CONSTRAINT user_secondary_skills_pkey PRIMARY KEY (_id);


--
-- TOC entry 2809 (class 2606 OID 17824)
-- Name: imagelinks image_link_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagelinks
    ADD CONSTRAINT image_link_id_fkey FOREIGN KEY (image_link_id) REFERENCES public.user_posts(_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2805 (class 2606 OID 17794)
-- Name: user_interests ineterst_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_interests
    ADD CONSTRAINT ineterst_id_fkey FOREIGN KEY (user_interest_id) REFERENCES public.user_account(_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2812 (class 2606 OID 17844)
-- Name: notification post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT post_id_fkey FOREIGN KEY (post_id) REFERENCES public.user_posts(_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2813 (class 2606 OID 24598)
-- Name: post_skills post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_skills
    ADD CONSTRAINT post_id_fkey FOREIGN KEY (post_id) REFERENCES public.user_posts(_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2806 (class 2606 OID 17799)
-- Name: user_posts posts_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_posts
    ADD CONSTRAINT posts_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_account(_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2803 (class 2606 OID 17784)
-- Name: user_primary_skills primary_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_primary_skills
    ADD CONSTRAINT primary_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.user_account(_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2804 (class 2606 OID 17789)
-- Name: user_secondary_skills secondary_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_secondary_skills
    ADD CONSTRAINT secondary_skill_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_account(_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2814 (class 2606 OID 24621)
-- Name: post_skills skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_skills
    ADD CONSTRAINT skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2808 (class 2606 OID 17819)
-- Name: team team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_id_fkey FOREIGN KEY (team_id) REFERENCES public.user_posts(_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2807 (class 2606 OID 24628)
-- Name: user_posts user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_posts
    ADD CONSTRAINT user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_account(_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2810 (class 2606 OID 17834)
-- Name: notification userfrom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT userfrom_id_fkey FOREIGN KEY (userfrom_id) REFERENCES public.user_account(_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2811 (class 2606 OID 17839)
-- Name: notification userto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT userto_id_fkey FOREIGN KEY (userto_id) REFERENCES public.user_account(_id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2020-05-17 18:02:49

--
-- PostgreSQL database dump complete
--

