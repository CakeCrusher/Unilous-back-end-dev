PGDMP     1                     x           postgres    12.2    12.2 L    }           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ~           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    13318    postgres    DATABASE     �   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';
    DROP DATABASE postgres;
                postgres    false            �           0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                   postgres    false    2944                        3079    16384 	   adminpack 	   EXTENSION     A   CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;
    DROP EXTENSION adminpack;
                   false            �           0    0    EXTENSION adminpack    COMMENT     M   COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';
                        false    1            �            1259    17686 
   imagelinks    TABLE     �   CREATE TABLE public.imagelinks (
    _id integer NOT NULL,
    type character varying(255),
    image_link_id integer NOT NULL
);
    DROP TABLE public.imagelinks;
       public         heap    postgres    false            �            1259    17684    imagelinks_id_seq    SEQUENCE     �   CREATE SEQUENCE public.imagelinks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.imagelinks_id_seq;
       public          postgres    false    214            �           0    0    imagelinks_id_seq    SEQUENCE OWNED BY     H   ALTER SEQUENCE public.imagelinks_id_seq OWNED BY public.imagelinks._id;
          public          postgres    false    213            �            1259    17702    notification    TABLE     �   CREATE TABLE public.notification (
    _id integer NOT NULL,
    message text,
    question text,
    answer text,
    accepted boolean,
    userfrom_id integer NOT NULL,
    userto_id integer NOT NULL,
    post_id integer
);
     DROP TABLE public.notification;
       public         heap    postgres    false            �            1259    17700    notification_id_seq    SEQUENCE     �   CREATE SEQUENCE public.notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.notification_id_seq;
       public          postgres    false    216            �           0    0    notification_id_seq    SEQUENCE OWNED BY     L   ALTER SEQUENCE public.notification_id_seq OWNED BY public.notification._id;
          public          postgres    false    215            �            1259    24587    post_skills    TABLE     �   CREATE TABLE public.post_skills (
    skill_id integer NOT NULL,
    needed integer DEFAULT 0 NOT NULL,
    filled integer DEFAULT 0 NOT NULL,
    post_id integer NOT NULL,
    _id integer NOT NULL
);
    DROP TABLE public.post_skills;
       public         heap    postgres    false            �            1259    24608    post_skills__id_seq    SEQUENCE     �   ALTER TABLE public.post_skills ALTER COLUMN _id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.post_skills__id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    220            �            1259    17713    proposedcontribution    TABLE        CREATE TABLE public.proposedcontribution (
    _id integer NOT NULL,
    type integer,
    notification_id integer NOT NULL
);
 (   DROP TABLE public.proposedcontribution;
       public         heap    postgres    false            �            1259    17711    proposedcontribution_id_seq    SEQUENCE     �   CREATE SEQUENCE public.proposedcontribution_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.proposedcontribution_id_seq;
       public          postgres    false    218            �           0    0    proposedcontribution_id_seq    SEQUENCE OWNED BY     \   ALTER SEQUENCE public.proposedcontribution_id_seq OWNED BY public.proposedcontribution._id;
          public          postgres    false    217            �            1259    24581    skills    TABLE     �   CREATE TABLE public.skills (
    name character varying(50) NOT NULL,
    _id integer NOT NULL,
    uses integer DEFAULT 0 NOT NULL
);
    DROP TABLE public.skills;
       public         heap    postgres    false            �            1259    24612    skills__id_seq    SEQUENCE     �   ALTER TABLE public.skills ALTER COLUMN _id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.skills__id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    219            �            1259    17678    team    TABLE     s   CREATE TABLE public.team (
    _id integer NOT NULL,
    post_id integer NOT NULL,
    user_id integer NOT NULL
);
    DROP TABLE public.team;
       public         heap    postgres    false            �            1259    17676    team_id_seq    SEQUENCE     �   CREATE SEQUENCE public.team_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.team_id_seq;
       public          postgres    false    212            �           0    0    team_id_seq    SEQUENCE OWNED BY     <   ALTER SEQUENCE public.team_id_seq OWNED BY public.team._id;
          public          postgres    false    211            �            1259    17586    user_account    TABLE     2  CREATE TABLE public.user_account (
    _id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(60) NOT NULL,
    email character varying(50),
    interests text,
    created_on timestamp without time zone DEFAULT now() NOT NULL,
    referencelink text NOT NULL
);
     DROP TABLE public.user_account;
       public         heap    postgres    false            �            1259    17584    user_account_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.user_account_id_seq;
       public          postgres    false    204            �           0    0    user_account_id_seq    SEQUENCE OWNED BY     L   ALTER SEQUENCE public.user_account_id_seq OWNED BY public.user_account._id;
          public          postgres    false    203            �            1259    17635 
   user_posts    TABLE     �  CREATE TABLE public.user_posts (
    _id integer NOT NULL,
    title character varying(100) NOT NULL,
    contact_link character varying(255) NOT NULL,
    "time" date DEFAULT now() NOT NULL,
    description text NOT NULL,
    color character varying(20) NOT NULL,
    user_id integer NOT NULL,
    image_links text[] NOT NULL,
    reference_links text[] NOT NULL,
    is_saved boolean DEFAULT true NOT NULL
);
    DROP TABLE public.user_posts;
       public         heap    postgres    false            �            1259    17633    user_posts_post_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_posts_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.user_posts_post_id_seq;
       public          postgres    false    210            �           0    0    user_posts_post_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.user_posts_post_id_seq OWNED BY public.user_posts._id;
          public          postgres    false    209            �            1259    17604    user_primary_skills    TABLE     �   CREATE TABLE public.user_primary_skills (
    _id integer NOT NULL,
    user_id character varying(50) NOT NULL,
    skill_id integer NOT NULL
);
 '   DROP TABLE public.user_primary_skills;
       public         heap    postgres    false            �            1259    17602    user_primary_skills_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_primary_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.user_primary_skills_id_seq;
       public          postgres    false    206            �           0    0    user_primary_skills_id_seq    SEQUENCE OWNED BY     Z   ALTER SEQUENCE public.user_primary_skills_id_seq OWNED BY public.user_primary_skills._id;
          public          postgres    false    205            �            1259    24642    user_saved_posts    TABLE        CREATE TABLE public.user_saved_posts (
    _id integer NOT NULL,
    user_id integer NOT NULL,
    post_id integer NOT NULL
);
 $   DROP TABLE public.user_saved_posts;
       public         heap    postgres    false            �            1259    17614    user_secondary_skills    TABLE     �   CREATE TABLE public.user_secondary_skills (
    _id integer NOT NULL,
    skill_id character varying(50) NOT NULL,
    user_id integer NOT NULL
);
 )   DROP TABLE public.user_secondary_skills;
       public         heap    postgres    false            �            1259    17612    user_secondary_skills_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_secondary_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.user_secondary_skills_id_seq;
       public          postgres    false    208            �           0    0    user_secondary_skills_id_seq    SEQUENCE OWNED BY     ^   ALTER SEQUENCE public.user_secondary_skills_id_seq OWNED BY public.user_secondary_skills._id;
          public          postgres    false    207            �
           2604    17689    imagelinks _id    DEFAULT     o   ALTER TABLE ONLY public.imagelinks ALTER COLUMN _id SET DEFAULT nextval('public.imagelinks_id_seq'::regclass);
 =   ALTER TABLE public.imagelinks ALTER COLUMN _id DROP DEFAULT;
       public          postgres    false    214    213    214            �
           2604    17705    notification _id    DEFAULT     s   ALTER TABLE ONLY public.notification ALTER COLUMN _id SET DEFAULT nextval('public.notification_id_seq'::regclass);
 ?   ALTER TABLE public.notification ALTER COLUMN _id DROP DEFAULT;
       public          postgres    false    215    216    216            �
           2604    17716    proposedcontribution _id    DEFAULT     �   ALTER TABLE ONLY public.proposedcontribution ALTER COLUMN _id SET DEFAULT nextval('public.proposedcontribution_id_seq'::regclass);
 G   ALTER TABLE public.proposedcontribution ALTER COLUMN _id DROP DEFAULT;
       public          postgres    false    218    217    218            �
           2604    17681    team _id    DEFAULT     c   ALTER TABLE ONLY public.team ALTER COLUMN _id SET DEFAULT nextval('public.team_id_seq'::regclass);
 7   ALTER TABLE public.team ALTER COLUMN _id DROP DEFAULT;
       public          postgres    false    211    212    212            �
           2604    17589    user_account _id    DEFAULT     s   ALTER TABLE ONLY public.user_account ALTER COLUMN _id SET DEFAULT nextval('public.user_account_id_seq'::regclass);
 ?   ALTER TABLE public.user_account ALTER COLUMN _id DROP DEFAULT;
       public          postgres    false    204    203    204            �
           2604    17638    user_posts _id    DEFAULT     t   ALTER TABLE ONLY public.user_posts ALTER COLUMN _id SET DEFAULT nextval('public.user_posts_post_id_seq'::regclass);
 =   ALTER TABLE public.user_posts ALTER COLUMN _id DROP DEFAULT;
       public          postgres    false    210    209    210            �
           2604    17607    user_primary_skills _id    DEFAULT     �   ALTER TABLE ONLY public.user_primary_skills ALTER COLUMN _id SET DEFAULT nextval('public.user_primary_skills_id_seq'::regclass);
 F   ALTER TABLE public.user_primary_skills ALTER COLUMN _id DROP DEFAULT;
       public          postgres    false    206    205    206            �
           2604    17617    user_secondary_skills _id    DEFAULT     �   ALTER TABLE ONLY public.user_secondary_skills ALTER COLUMN _id SET DEFAULT nextval('public.user_secondary_skills_id_seq'::regclass);
 H   ALTER TABLE public.user_secondary_skills ALTER COLUMN _id DROP DEFAULT;
       public          postgres    false    207    208    208            �
           2606    17691    imagelinks imagelinks_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.imagelinks
    ADD CONSTRAINT imagelinks_pkey PRIMARY KEY (_id);
 D   ALTER TABLE ONLY public.imagelinks DROP CONSTRAINT imagelinks_pkey;
       public            postgres    false    214            �
           2606    17710    notification notification_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (_id);
 H   ALTER TABLE ONLY public.notification DROP CONSTRAINT notification_pkey;
       public            postgres    false    216            �
           2606    24618    post_skills post_skills_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.post_skills
    ADD CONSTRAINT post_skills_pkey PRIMARY KEY (_id);
 F   ALTER TABLE ONLY public.post_skills DROP CONSTRAINT post_skills_pkey;
       public            postgres    false    220            �
           2606    17718 .   proposedcontribution proposedcontribution_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public.proposedcontribution
    ADD CONSTRAINT proposedcontribution_pkey PRIMARY KEY (_id);
 X   ALTER TABLE ONLY public.proposedcontribution DROP CONSTRAINT proposedcontribution_pkey;
       public            postgres    false    218            �
           2606    24620    skills skills_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (_id);
 <   ALTER TABLE ONLY public.skills DROP CONSTRAINT skills_pkey;
       public            postgres    false    219            �
           2606    17683    team team_pkey 
   CONSTRAINT     M   ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (_id);
 8   ALTER TABLE ONLY public.team DROP CONSTRAINT team_pkey;
       public            postgres    false    212            �
           2606    17599 #   user_account user_account_email_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_email_key UNIQUE (email);
 M   ALTER TABLE ONLY public.user_account DROP CONSTRAINT user_account_email_key;
       public            postgres    false    204            �
           2606    17595    user_account user_account_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_pkey PRIMARY KEY (_id);
 H   ALTER TABLE ONLY public.user_account DROP CONSTRAINT user_account_pkey;
       public            postgres    false    204            �
           2606    17597 &   user_account user_account_username_key 
   CONSTRAINT     e   ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_username_key UNIQUE (username);
 P   ALTER TABLE ONLY public.user_account DROP CONSTRAINT user_account_username_key;
       public            postgres    false    204            �
           2606    17649 %   user_posts user_posts_contactlink_key 
   CONSTRAINT     h   ALTER TABLE ONLY public.user_posts
    ADD CONSTRAINT user_posts_contactlink_key UNIQUE (contact_link);
 O   ALTER TABLE ONLY public.user_posts DROP CONSTRAINT user_posts_contactlink_key;
       public            postgres    false    210            �
           2606    17651 %   user_posts user_posts_description_key 
   CONSTRAINT     g   ALTER TABLE ONLY public.user_posts
    ADD CONSTRAINT user_posts_description_key UNIQUE (description);
 O   ALTER TABLE ONLY public.user_posts DROP CONSTRAINT user_posts_description_key;
       public            postgres    false    210            �
           2606    17645    user_posts user_posts_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.user_posts
    ADD CONSTRAINT user_posts_pkey PRIMARY KEY (_id);
 D   ALTER TABLE ONLY public.user_posts DROP CONSTRAINT user_posts_pkey;
       public            postgres    false    210            �
           2606    17647    user_posts user_posts_title_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.user_posts
    ADD CONSTRAINT user_posts_title_key UNIQUE (title);
 I   ALTER TABLE ONLY public.user_posts DROP CONSTRAINT user_posts_title_key;
       public            postgres    false    210            �
           2606    17611 0   user_primary_skills user_primary_skills_name_key 
   CONSTRAINT     n   ALTER TABLE ONLY public.user_primary_skills
    ADD CONSTRAINT user_primary_skills_name_key UNIQUE (user_id);
 Z   ALTER TABLE ONLY public.user_primary_skills DROP CONSTRAINT user_primary_skills_name_key;
       public            postgres    false    206            �
           2606    17609 ,   user_primary_skills user_primary_skills_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.user_primary_skills
    ADD CONSTRAINT user_primary_skills_pkey PRIMARY KEY (_id);
 V   ALTER TABLE ONLY public.user_primary_skills DROP CONSTRAINT user_primary_skills_pkey;
       public            postgres    false    206            �
           2606    24646 &   user_saved_posts user_saved_posts_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.user_saved_posts
    ADD CONSTRAINT user_saved_posts_pkey PRIMARY KEY (_id);
 P   ALTER TABLE ONLY public.user_saved_posts DROP CONSTRAINT user_saved_posts_pkey;
       public            postgres    false    223            �
           2606    17621 4   user_secondary_skills user_secondary_skills_name_key 
   CONSTRAINT     s   ALTER TABLE ONLY public.user_secondary_skills
    ADD CONSTRAINT user_secondary_skills_name_key UNIQUE (skill_id);
 ^   ALTER TABLE ONLY public.user_secondary_skills DROP CONSTRAINT user_secondary_skills_name_key;
       public            postgres    false    208            �
           2606    17619 0   user_secondary_skills user_secondary_skills_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY public.user_secondary_skills
    ADD CONSTRAINT user_secondary_skills_pkey PRIMARY KEY (_id);
 Z   ALTER TABLE ONLY public.user_secondary_skills DROP CONSTRAINT user_secondary_skills_pkey;
       public            postgres    false    208            �
           2606    17824    imagelinks image_link_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.imagelinks
    ADD CONSTRAINT image_link_id_fkey FOREIGN KEY (image_link_id) REFERENCES public.user_posts(_id) ON UPDATE CASCADE ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.imagelinks DROP CONSTRAINT image_link_id_fkey;
       public          postgres    false    2782    210    214            �
           2606    17844    notification post_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notification
    ADD CONSTRAINT post_id_fkey FOREIGN KEY (post_id) REFERENCES public.user_posts(_id) ON UPDATE CASCADE ON DELETE CASCADE;
 C   ALTER TABLE ONLY public.notification DROP CONSTRAINT post_id_fkey;
       public          postgres    false    210    216    2782            �
           2606    24598    post_skills post_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.post_skills
    ADD CONSTRAINT post_id_fkey FOREIGN KEY (post_id) REFERENCES public.user_posts(_id) ON UPDATE CASCADE ON DELETE CASCADE;
 B   ALTER TABLE ONLY public.post_skills DROP CONSTRAINT post_id_fkey;
       public          postgres    false    210    220    2782            �
           2606    24652    user_saved_posts post_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_saved_posts
    ADD CONSTRAINT post_id_fkey FOREIGN KEY (post_id) REFERENCES public.user_posts(_id) ON UPDATE CASCADE ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.user_saved_posts DROP CONSTRAINT post_id_fkey;
       public          postgres    false    223    2782    210            �
           2606    17799    user_posts posts_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_posts
    ADD CONSTRAINT posts_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_account(_id) ON UPDATE CASCADE ON DELETE CASCADE;
 B   ALTER TABLE ONLY public.user_posts DROP CONSTRAINT posts_id_fkey;
       public          postgres    false    210    204    2766            �
           2606    17784 )   user_primary_skills primary_skill_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_primary_skills
    ADD CONSTRAINT primary_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.user_account(_id) ON UPDATE CASCADE ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.user_primary_skills DROP CONSTRAINT primary_skill_id_fkey;
       public          postgres    false    2766    204    206            �
           2606    17789 -   user_secondary_skills secondary_skill_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_secondary_skills
    ADD CONSTRAINT secondary_skill_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_account(_id) ON UPDATE CASCADE ON DELETE CASCADE;
 W   ALTER TABLE ONLY public.user_secondary_skills DROP CONSTRAINT secondary_skill_id_fkey;
       public          postgres    false    208    204    2766            �
           2606    24621    post_skills skill_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.post_skills
    ADD CONSTRAINT skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(_id) ON UPDATE CASCADE ON DELETE CASCADE;
 C   ALTER TABLE ONLY public.post_skills DROP CONSTRAINT skill_id_fkey;
       public          postgres    false    220    2794    219            �
           2606    17819    team team_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_id_fkey FOREIGN KEY (post_id) REFERENCES public.user_posts(_id) ON UPDATE CASCADE ON DELETE CASCADE;
 ;   ALTER TABLE ONLY public.team DROP CONSTRAINT team_id_fkey;
       public          postgres    false    2782    212    210            �
           2606    24628    user_posts user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_posts
    ADD CONSTRAINT user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_account(_id) ON UPDATE CASCADE ON DELETE CASCADE;
 A   ALTER TABLE ONLY public.user_posts DROP CONSTRAINT user_id_fkey;
       public          postgres    false    210    2766    204            �
           2606    24647    user_saved_posts user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_saved_posts
    ADD CONSTRAINT user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_account(_id) ON UPDATE CASCADE ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.user_saved_posts DROP CONSTRAINT user_id_fkey;
       public          postgres    false    2766    204    223            �
           2606    24657    team user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.team
    ADD CONSTRAINT user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_account(_id) ON UPDATE CASCADE ON DELETE CASCADE;
 ;   ALTER TABLE ONLY public.team DROP CONSTRAINT user_id_fkey;
       public          postgres    false    212    204    2766            �
           2606    17834    notification userfrom_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notification
    ADD CONSTRAINT userfrom_id_fkey FOREIGN KEY (userfrom_id) REFERENCES public.user_account(_id) ON UPDATE CASCADE ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.notification DROP CONSTRAINT userfrom_id_fkey;
       public          postgres    false    204    2766    216            �
           2606    17839    notification userto_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notification
    ADD CONSTRAINT userto_id_fkey FOREIGN KEY (userto_id) REFERENCES public.user_account(_id) ON UPDATE CASCADE ON DELETE CASCADE;
 E   ALTER TABLE ONLY public.notification DROP CONSTRAINT userto_id_fkey;
       public          postgres    false    204    216    2766           