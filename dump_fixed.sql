--
-- PostgreSQL database dump
--

\restrict CsuRXBpF59JP2ZIhsZKDw4wBd0onW3ShPPKVLz5NZOpnVSBN1CBPllCXSkaOBu2

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: transactions_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transactions_status_enum AS ENUM (
    'INITIATED',
    'SUCCESS',
    'FAILED'
);


ALTER TYPE public.transactions_status_enum OWNER TO postgres;

--
-- Name: transactions_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transactions_type_enum AS ENUM (
    'PREAUTH',
    'CHARGE',
    'REFUND'
);


ALTER TYPE public.transactions_type_enum OWNER TO postgres;

--
-- Name: user_settings_notificationlevel_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_settings_notificationlevel_enum AS ENUM (
    'none',
    'summary',
    'instant'
);


ALTER TYPE public.user_settings_notificationlevel_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    admin_id uuid NOT NULL,
    action character varying(255) NOT NULL,
    target_type character varying(50) NOT NULL,
    target_id uuid NOT NULL,
    details jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    "iconUrl" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    content text NOT NULL,
    "userId" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "productId" uuid
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: group_memberships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_memberships (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    group_id uuid NOT NULL,
    user_id uuid NOT NULL,
    status character varying(50) NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    cancelled_at timestamp with time zone,
    amount_group_price numeric(12,2) NOT NULL,
    transaction_id uuid
);


ALTER TABLE public.group_memberships OWNER TO postgres;

--
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description text,
    status character varying(20) DEFAULT 'OPEN'::character varying NOT NULL,
    active_group boolean DEFAULT true NOT NULL,
    product_id uuid NOT NULL,
    joined_count integer DEFAULT 0 NOT NULL,
    target_members integer DEFAULT 10 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deadline timestamp without time zone,
    "productIds" text
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- Name: homepage_metrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.homepage_metrics (
    id integer NOT NULL,
    week_start timestamp without time zone NOT NULL,
    joins_count integer NOT NULL,
    gmv numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    category_id integer
);


ALTER TABLE public.homepage_metrics OWNER TO postgres;

--
-- Name: homepage_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.homepage_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.homepage_metrics_id_seq OWNER TO postgres;

--
-- Name: homepage_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.homepage_metrics_id_seq OWNED BY public.homepage_metrics.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    body text NOT NULL,
    payload jsonb,
    channel character varying(50) NOT NULL,
    status character varying(50) NOT NULL,
    error_message text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    sent_at timestamp with time zone
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    product_id uuid NOT NULL,
    image_url text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_images_id_seq OWNER TO postgres;

--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: product_performance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_performance (
    product_id uuid NOT NULL,
    views_7d integer DEFAULT 0 NOT NULL,
    joins_7d integer DEFAULT 0 NOT NULL,
    wishlist_adds_7d integer DEFAULT 0 NOT NULL,
    conversion_rate numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    "lastUpdate" timestamp with time zone
);


ALTER TABLE public.product_performance OWNER TO postgres;

--
-- Name: product_specs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_specs (
    id integer NOT NULL,
    product_id uuid NOT NULL,
    spec_key character varying(255) NOT NULL,
    spec_value character varying(255),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_specs OWNER TO postgres;

--
-- Name: product_specs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_specs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_specs_id_seq OWNER TO postgres;

--
-- Name: product_specs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_specs_id_seq OWNED BY public.product_specs.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    slug character varying(255),
    price_regular numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    price_group numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    description text,
    min_members integer DEFAULT 1 NOT NULL,
    max_members integer,
    is_active boolean DEFAULT true NOT NULL,
    supplier_id uuid,
    category_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: search_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.search_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    keyword character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.search_history OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency character varying(10) DEFAULT 'ILS'::character varying NOT NULL,
    type public.transactions_type_enum NOT NULL,
    status public.transactions_status_enum DEFAULT 'INITIATED'::public.transactions_status_enum NOT NULL,
    provider character varying(50) DEFAULT 'stripe'::character varying NOT NULL,
    provider_ref character varying(255) NOT NULL,
    idempotency_key uuid NOT NULL,
    error_code character varying(100),
    error_message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid,
    group_id uuid
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: user_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_settings (
    user_id uuid NOT NULL,
    "notificationLevel" public.user_settings_notificationlevel_enum DEFAULT 'summary'::public.user_settings_notificationlevel_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_settings OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: wishlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    product_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.wishlist OWNER TO postgres;

--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: homepage_metrics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.homepage_metrics ALTER COLUMN id SET DEFAULT nextval('public.homepage_metrics_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: product_specs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_specs ALTER COLUMN id SET DEFAULT nextval('public.product_specs_id_seq'::regclass);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, user_id, role, created_at) FROM stdin;
aafed268-6e7f-4f09-9ad3-1d84b092d3d3	09987083-ea8d-4a1d-b4c2-ed56cd3a79e2	SUPER_ADMIN	2025-12-27 20:29:06.398142
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, admin_id, action, target_type, target_id, details, created_at) FROM stdin;
e2a1aaa3-58f2-4a71-b945-7ba2708e481f	aafed268-6e7f-4f09-9ad3-1d84b092d3d3	PRODUCT_CREATE	PRODUCT	0ea39696-e698-43dc-993f-656897b56584	{"newValues": {"name": "Gaming Laptop RTX 4070"}}	2025-12-27 20:29:06.410121
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, "iconUrl", "sortOrder", created_at, updated_at) FROM stdin;
1	Electronics	electronics	\N	10	2025-12-27 20:29:06.23411+02	2025-12-27 20:29:06.23411+02
2	Home Appliances	home-appliances	\N	20	2025-12-27 20:29:06.23411+02	2025-12-27 20:29:06.23411+02
3	Phones	phones	\N	30	2025-12-27 20:29:06.23411+02	2025-12-27 20:29:06.23411+02
4	Headphones	headphones	\N	40	2025-12-27 20:29:06.23411+02	2025-12-27 20:29:06.23411+02
5	Laptops	laptops	\N	50	2025-12-27 20:29:06.23411+02	2025-12-27 20:29:06.23411+02
6	Mixed (כללי)	mixed	\N	60	2025-12-27 20:29:06.23411+02	2025-12-27 20:29:06.23411+02
7	Fashion	fashion	\N	70	2025-12-27 20:29:06.23411+02	2025-12-27 20:29:06.23411+02
8	Gadgets	gadgets	\N	80	2025-12-27 20:29:06.23411+02	2025-12-27 20:29:06.23411+02
9	Seasonal Items	seasonal-items	\N	90	2025-12-27 20:29:06.23411+02	2025-12-27 20:29:06.23411+02
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, content, "userId", "createdAt", "productId") FROM stdin;
\.


--
-- Data for Name: group_memberships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_memberships (id, group_id, user_id, status, joined_at, cancelled_at, amount_group_price, transaction_id) FROM stdin;
55687a34-2484-45c4-81da-4c2b38a8b70b	dfc64f7d-3fad-4a2a-a751-4965a0a74652	da9ede3d-e916-4f71-b6af-e0dd50a240ae	PAID	2025-12-27 20:29:06.451824+02	\N	1400.00	\N
e3b6f9cb-2c3b-42b0-95f7-a39188bd01cb	9ff62702-ee2e-4aa0-9197-dca12e8d71dc	5556871b-2d1b-4d1c-bdfd-e35b25f12bde	PAID	2025-12-27 20:29:06.451824+02	\N	3800.00	\N
ea5436f8-623c-410e-b504-1256f594879a	95bf6db0-e49a-4eed-bf0c-a3eab0532f48	5556871b-2d1b-4d1c-bdfd-e35b25f12bde	REFUNDED	2025-12-27 20:29:06.451824+02	\N	8800.00	\N
7a1d3548-92bd-4252-ae92-29b0bcb9a000	371f5a37-0788-495c-9ebd-ee6910bec88d	99bb4b78-b881-405a-ade6-80318bbe7cbc	JOINED	2025-12-30 10:52:34.090135+02	\N	1750.00	\N
61f1e1a8-6f6c-4c72-aa5c-12135b0a27fd	dfc64f7d-3fad-4a2a-a751-4965a0a74652	09987083-ea8d-4a1d-b4c2-ed56cd3a79e2	CANCELLED	2025-12-28 10:12:07.974145+02	\N	890.00	\N
d1df29e3-4960-4999-bfff-876ea197ad10	dfc64f7d-3fad-4a2a-a751-4965a0a74652	99bb4b78-b881-405a-ade6-80318bbe7cbc	JOINED	2025-12-30 12:15:27.739055+02	\N	890.00	\N
0633c301-e1b3-474e-988e-0d53854ef072	545e0907-350b-433f-921c-e9ce2fe25773	99bb4b78-b881-405a-ade6-80318bbe7cbc	JOINED	2025-12-30 12:42:13.196233+02	\N	3400.00	\N
5b10a20c-2dce-491d-ac48-13d89ed83681	371f5a37-0788-495c-9ebd-ee6910bec88d	09987083-ea8d-4a1d-b4c2-ed56cd3a79e2	CANCELLED	2025-12-29 12:51:46.077866+02	2025-12-29 13:52:32.514+02	1750.00	\N
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (id, name, description, status, active_group, product_id, joined_count, target_members, created_at, updated_at, deadline, "productIds") FROM stdin;
9ff62702-ee2e-4aa0-9197-dca12e8d71dc	קבוצת טלפון דגל X90	הזדמנות אחרונה לטלפון החדש	COMPLETED	t	b7d45476-02c7-4ce2-92c0-d0fd4f90a740	10	10	2025-12-27 20:29:06.430488+02	2025-12-27 20:29:06.430488+02	\N	\N
95bf6db0-e49a-4eed-bf0c-a3eab0532f48	קבוצת לפטופ גיימינג	מחשב חזק במיוחד לגיימרים	FAILED	t	0ea39696-e698-43dc-993f-656897b56584	2	6	2025-12-27 20:29:06.430488+02	2025-12-27 20:29:06.430488+02	\N	\N
1f44e814-2b5a-4e50-bd99-ba0e39e3e548	BBB	 | Data: {"allProductIds":["f32e6d4f-b3e5-4437-87ec-377f9cf154ea","a99d7190-200a-47da-b2f5-b4720865fce7"]}	OPEN	t	f32e6d4f-b3e5-4437-87ec-377f9cf154ea	0	10	2025-12-29 09:43:52.48554+02	2025-12-30 10:01:52.701368+02	2026-01-07 09:43:00	\N
25f1eae1-af0d-42f3-bb9a-57b16e9de82a	1998		OPEN	t	ce2b9dff-9a2a-4571-aac0-3a56b8c742bd	0	10	2025-12-30 10:41:48.787419+02	2025-12-30 10:41:48.787419+02	2026-01-06 10:41:00	ce2b9dff-9a2a-4571-aac0-3a56b8c742bd,09c62ecb-987b-4200-8eae-b9750727522f
e767df56-2b11-41b8-ac9f-aaa0e5cd0267	bbb	Data: {"allProductIds":["19485961-aa51-4521-bc3f-2c4f261d7daa","eea58b6c-065a-4c03-9515-b6e6e90ee46a"]}	FAILED	t	19485961-aa51-4521-bc3f-2c4f261d7daa	0	10	2025-12-27 20:55:52.072936+02	2025-12-27 21:00:00.243861+02	\N	\N
64782071-fe74-48ff-8b98-9fab52afb530	KO		FAILED	t	f32e6d4f-b3e5-4437-87ec-377f9cf154ea	0	10	2025-12-29 14:15:26.851704+02	2025-12-29 15:00:00.304368+02	2025-12-24 14:15:00	f32e6d4f-b3e5-4437-87ec-377f9cf154ea,e22195c2-8a3e-4607-9e3d-c3f927bac328
371f5a37-0788-495c-9ebd-ee6910bec88d	v	1 | Data: {"allProductIds":["b225e69d-d7ba-486a-99bf-c13e11b9ec5e","87487da1-d6e1-457a-8108-05c01f354e36"]}	OPEN	t	b225e69d-d7ba-486a-99bf-c13e11b9ec5e	1	5	2025-12-28 12:34:42.281889+02	2025-12-30 10:52:34.130203+02	\N	\N
d6c9904c-114d-48e0-8f25-987041c09df0	15	10 | Data: {"allProductIds":["b225e69d-d7ba-486a-99bf-c13e11b9ec5e","e9dbf2d9-922c-4481-9b69-4db6ba0dffc9"]}	LOCKED	f	b225e69d-d7ba-486a-99bf-c13e11b9ec5e	0	5	2025-12-28 09:13:08.795308+02	2025-12-28 09:13:08.795308+02	\N	\N
eea24b6c-6475-452b-be78-eef7ad537192	20		OPEN	t	22881417-0328-4426-aa50-200dce6e7039	0	10	2025-12-29 15:32:56.052524+02	2025-12-30 11:09:41.711837+02	2025-12-31 15:32:00	22881417-0328-4426-aa50-200dce6e7039,a99d7190-200a-47da-b2f5-b4720865fce7
b8a6b866-e36c-460a-8893-d7680c0eb287	nadv		OPEN	t	09c62ecb-987b-4200-8eae-b9750727522f	0	10	2025-12-30 09:14:53.50512+02	2025-12-30 11:09:44.848394+02	2026-01-22 09:14:00	09c62ecb-987b-4200-8eae-b9750727522f,c0bfbbb3-f904-4015-9914-1a26f0a17e74,bd057437-ba63-4aea-9c5a-2d845b8c4368
9b9f617b-ec5a-4178-809f-d974c53e3bd1	קבוצת אוזניות ANC	רכישה קבוצתית לאוזניות המבטלות רעשים	OPEN	t	09c62ecb-987b-4200-8eae-b9750727522f	4	15	2025-12-27 20:29:06.430488+02	2025-12-30 11:09:47.704829+02	\N	\N
eff58675-1057-4d3e-8cc6-778a967737d5	56	 | Data: {"allProductIds":["a99d7190-200a-47da-b2f5-b4720865fce7","516a4bf1-0750-4f2d-ae96-9987a727fd96"]}	OPEN	t	a99d7190-200a-47da-b2f5-b4720865fce7	0	10	2025-12-29 12:57:15.458299+02	2025-12-30 11:09:50.551621+02	2025-12-30 18:57:00	\N
569a9300-dd0a-4170-b504-86fd25b05dd3	fta	bbb	OPEN	t	ce2b9dff-9a2a-4571-aac0-3a56b8c742bd	0	10	2025-12-30 12:41:25.690268+02	2025-12-30 12:42:00.70818+02	2026-01-06 12:41:00	ce2b9dff-9a2a-4571-aac0-3a56b8c742bd,e5d409e0-9e8e-4662-8a06-e5c796b64aac
97a48720-c5f1-4a1f-9e1b-18a6f5a21f62	LLL	 | Data: {"allProductIds":["f32e6d4f-b3e5-4437-87ec-377f9cf154ea","a99d7190-200a-47da-b2f5-b4720865fce7"]}	FAILED	t	f32e6d4f-b3e5-4437-87ec-377f9cf154ea	0	10	2025-12-29 12:04:19.288716+02	2025-12-30 12:08:57.251622+02	2025-12-30 12:04:00	\N
545e0907-350b-433f-921c-e9ce2fe25773	flash		OPEN	t	a99d7190-200a-47da-b2f5-b4720865fce7	1	10	2025-12-30 12:41:10.050273+02	2025-12-30 12:42:13.208982+02	2026-01-28 12:40:00	a99d7190-200a-47da-b2f5-b4720865fce7,2e964386-10f3-4aff-9f1e-9dd86f81ff00
cebb6ff1-9953-492d-b627-f2e8da9ae451	LLL		FAILED	t	a99d7190-200a-47da-b2f5-b4720865fce7	0	10	2025-12-30 12:16:54.452927+02	2025-12-30 13:00:00.174247+02	2025-12-16 12:16:00	a99d7190-200a-47da-b2f5-b4720865fce7
dfc64f7d-3fad-4a2a-a751-4965a0a74652	קבוצת שעונים חכמים	הדור הבא של השעונים החכמים במחיר קבוצתי	OPEN	t	19485961-aa51-4521-bc3f-2c4f261d7daa	13	15	2025-12-27 20:29:06.430488+02	2025-12-30 12:15:27.750042+02	\N	\N
d6a530a5-8c02-4967-b68b-42b20cad8ac2	QQQ		OPEN	t	bd057437-ba63-4aea-9c5a-2d845b8c4368	0	10	2025-12-30 12:16:27.255232+02	2025-12-30 12:16:27.255232+02	2026-01-28 12:16:00	bd057437-ba63-4aea-9c5a-2d845b8c4368
23537449-0903-4091-b335-70e30d3dd9da	KKK	Data: {"allProductIds":["19485961-aa51-4521-bc3f-2c4f261d7daa","eea58b6c-065a-4c03-9515-b6e6e90ee46a","4cf36529-30ef-4c6a-a370-5b3362f959c6"]}	FAILED	t	19485961-aa51-4521-bc3f-2c4f261d7daa	0	10	2025-12-28 16:19:34.509708+02	2025-12-28 16:54:40.818934+02	2025-12-19 16:19:00	\N
05c83fe4-c949-4855-a590-be53387d9c0a	1256		LOCKED	f	9638503c-1a4f-4448-82fb-af18b39d4a03	0	10	2025-12-30 09:15:13.779886+02	2025-12-30 09:15:13.779886+02	2025-12-31 09:15:00	9638503c-1a4f-4448-82fb-af18b39d4a03,e5d409e0-9e8e-4662-8a06-e5c796b64aac
49e43e83-20ac-4f90-938d-0128bdba4964	MMM	 | IDs: ["eea58b6c-065a-4c03-9515-b6e6e90ee46a","19485961-aa51-4521-bc3f-2c4f261d7daa"]	OPEN	t	eea58b6c-065a-4c03-9515-b6e6e90ee46a	0	10	2025-12-27 21:33:03.104918+02	2025-12-30 10:01:48.326105+02	\N	\N
d61f20b4-13be-4de4-bc9f-0a53603099a9	169		OPEN	t	22881417-0328-4426-aa50-200dce6e7039	0	10	2025-12-30 10:41:00.872196+02	2025-12-30 10:41:00.872196+02	2025-12-31 10:40:00	22881417-0328-4426-aa50-200dce6e7039,2e964386-10f3-4aff-9f1e-9dd86f81ff00
e415b2f9-a8aa-4ecf-bdad-c88e8fb62a35	AAA		OPEN	t	bd057437-ba63-4aea-9c5a-2d845b8c4368	0	10	2025-12-30 10:41:23.335001+02	2025-12-30 10:41:23.335001+02	2025-12-31 10:41:00	bd057437-ba63-4aea-9c5a-2d845b8c4368,e5d409e0-9e8e-4662-8a06-e5c796b64aac
d5ab7373-1837-4675-b3bc-6adc0a601005	XXL	 | Data: {"allProductIds":["a99d7190-200a-47da-b2f5-b4720865fce7"]}	OPEN	t	a99d7190-200a-47da-b2f5-b4720865fce7	0	10	2025-12-29 11:24:41.460691+02	2025-12-30 10:01:51.037313+02	2026-01-27 11:24:00	\N
0fe1f4b4-91ad-4f89-9029-0a689d5c46b8	light		OPEN	t	a99d7190-200a-47da-b2f5-b4720865fce7	0	10	2025-12-30 12:31:21.516858+02	2025-12-30 12:31:21.516858+02	2026-01-06 12:31:00	a99d7190-200a-47da-b2f5-b4720865fce7
\.


--
-- Data for Name: homepage_metrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.homepage_metrics (id, week_start, joins_count, gmv, created_at, category_id) FROM stdin;
1	2025-12-20 20:29:06.465	320	48999.00	2025-12-27 20:29:06.467204	\N
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, type, title, body, payload, channel, status, error_message, created_at, sent_at) FROM stdin;
44400d40-afb2-4043-a95e-b4c8d73f044d	a4887695-9203-46a4-ba9d-7224a8a1b78d	GROUP_REACHED_TARGET	קבוצת הטלפון הושלמה!	קבוצת רכישה לטלפון הדגל הגיעה ליעד.	{"groupId": "9ff62702-ee2e-4aa0-9197-dca12e8d71dc"}	push	SENT	\N	2025-12-27 20:29:06.474029	2025-12-27 20:29:06.472+02
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, product_id, image_url, sort_order, created_at) FROM stdin;
1	a9760805-e543-4575-997b-63b5d7ac7059	https://your-real-cdn.com/images/tshirt-black-main.jpg	10	2025-12-27 20:29:06.483087
2	19485961-aa51-4521-bc3f-2c4f261d7daa	https://your-real-cdn.com/images/smartwatch-main-v2.jpg	10	2025-12-27 20:29:06.483087
\.


--
-- Data for Name: product_performance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_performance (product_id, views_7d, joins_7d, wishlist_adds_7d, conversion_rate, "lastUpdate") FROM stdin;
b7d45476-02c7-4ce2-92c0-d0fd4f90a740	12000	80	55	0.66	2025-12-27 20:29:06.524+02
\.


--
-- Data for Name: product_specs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_specs (id, product_id, spec_key, spec_value, created_at) FROM stdin;
1	a9760805-e543-4575-997b-63b5d7ac7059	Material	100% Organic Cotton	2025-12-27 20:29:06.48875
2	19485961-aa51-4521-bc3f-2c4f261d7daa	Battery Life	Up to 7 days	2025-12-27 20:29:06.48875
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, slug, price_regular, price_group, stock, description, min_members, max_members, is_active, supplier_id, category_id, created_at, updated_at) FROM stdin;
f32e6d4f-b3e5-4437-87ec-377f9cf154ea	Air Fryer XL	air-fryer-xl	950.00	750.00	0	מטגן אוויר בנפח גדול.	20	20	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	2	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
66fb05d2-6d92-4513-82cc-e31801a835d1	Smart Refrigerator 2025	smart-refrigerator-2025	12000.00	9500.00	0	מקרר חכם עם מסך.	5	5	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	2	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
a99d7190-200a-47da-b2f5-b4720865fce7	Dishwasher Silent 2.0	dishwasher-silent	4200.00	3400.00	0	מדיח כלים שקט.	8	8	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	2	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
b7d45476-02c7-4ce2-92c0-d0fd4f90a740	Flagship Smartphone X90	flagship-smartphone-x90	4500.00	3800.00	0	טלפון דגל 2025.	10	10	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	3	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
22881417-0328-4426-aa50-200dce6e7039	Mid-Range Phone Plus	mid-range-phone-plus	2800.00	2200.00	0	טלפון ביניים עם מצלמה טובה.	15	15	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	3	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
c0bfbbb3-f904-4015-9914-1a26f0a17e74	Budget Smart Phone Z	budget-smart-phone-z	1200.00	950.00	0	טלפון חכם בתקציב נמוך.	25	25	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	3	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
2e964386-10f3-4aff-9f1e-9dd86f81ff00	Phone Lite Edition	phone-lite-edition	3200.00	2700.00	0	גרסה קלה וקומפקטית.	12	12	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	3	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
09c62ecb-987b-4200-8eae-b9750727522f	ANC Over-Ear Pro	anc-over-ear-pro	1800.00	1400.00	0	אוזניות קשת עם סינון רעשים מתקדם.	15	15	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	4	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
bd057437-ba63-4aea-9c5a-2d845b8c4368	True Wireless Sport	true-wireless-sport	650.00	480.00	0	אוזניות ספורט אלחוטיות.	30	30	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	4	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
9638503c-1a4f-4448-82fb-af18b39d4a03	Budget Wireless Earbuds	budget-wireless-earbuds	250.00	190.00	0	אוזניות אלחוטיות בסיסיות.	50	50	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	4	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
e5d409e0-9e8e-4662-8a06-e5c796b64aac	Studio Monitoring Headphones	studio-monitoring-headphones	1100.00	850.00	0	אוזניות סטודיו.	20	20	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	4	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
ce2b9dff-9a2a-4571-aac0-3a56b8c742bd	Kids Safe Headphones	kids-safe-headphones	300.00	220.00	0	אוזניות עם הגבלת ווליום לילדים.	40	40	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	4	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
0ea39696-e698-43dc-993f-656897b56584	Gaming Laptop RTX 4070	gaming-laptop-rtx4070	11000.00	8800.00	0	מחשב נייד לגיימינג.	6	6	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	5	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
8f94c7a3-7ed2-47fa-ae56-2518951a5eb4	Ultra Slim Workstation	ultra-slim-workstation	7500.00	6200.00	0	מחשב דק לעבודה.	8	8	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	5	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
2a808511-7fef-4ec4-8fde-856ff36f0fa5	Budget Student Laptop	budget-student-laptop	2800.00	2100.00	0	מחשב לתלמידים.	15	15	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	5	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
908081af-143e-4705-86e8-caf045337c55	2-in-1 Touchscreen Laptop	2-in-1-touchscreen-laptop	4800.00	3900.00	0	מחשב היברידי.	10	10	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	5	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
eea58b6c-065a-4c03-9515-b6e6e90ee46a	MacBook Pro Clone	macbook-pro-clone	9000.00	7500.00	0	מחשב דמוי מקבוק.	7	7	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	5	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
a74e8d54-35b1-4790-94f0-9094a0951a5a	Universal Car Mount	universal-car-mount	150.00	110.00	0	מתקן אוניברסלי לרכב.	50	50	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	6	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
fe9865c2-5158-4294-94a8-f95a38acb35f	Portable Bluetooth Speaker	portable-bluetooth-speaker	400.00	300.00	0	רמקול בלוטות' קטן.	35	35	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	6	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
11559dd0-8bed-4573-af99-b50690e1e7cd	Wireless Charging Pad	wireless-charging-pad	180.00	135.00	0	משטח טעינה אלחוטי.	40	40	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	6	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
8cec5c1b-9617-4bcc-87af-6a8d0f5ae0bd	Set of Reusable Bags	set-of-reusable-bags	90.00	65.00	0	סט תיקים רב-פעמיים.	100	100	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	6	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
57afd9f6-be2b-4c8e-8a76-652d44f71176	High-Speed HDMI Cable	high-speed-hdmi-cable	50.00	35.00	0	כבל HDMI ארוך.	120	120	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	6	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
a9760805-e543-4575-997b-63b5d7ac7059	Organic Cotton T-Shirt	organic-cotton-t-shirt	120.00	95.00	0	חולצת טי מכותנה אורגנית.	30	30	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	7	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
9617fb3c-f70f-4026-8709-a7aa79d844e4	Slim Fit Denim Jeans	slim-fit-denim-jeans	380.00	290.00	0	ג'ינס דנים בגזרה צרה.	20	20	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	7	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
8130f270-2e55-4561-9eea-178b5416d8e2	Classic Leather Belt	classic-leather-belt	220.00	170.00	0	חגורת עור קלאסית.	25	25	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	7	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
1c9efaea-8a52-48ef-bf6c-4f98f65e5d12	Minimalist Wrist Watch	minimalist-wrist-watch	450.00	360.00	0	שעון יד מינימליסטי.	15	15	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	7	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
11ab7ba5-e2d1-4a9b-8748-6a8d8cc6fa55	Sport Running Shoes	sport-running-shoes	550.00	420.00	0	נעלי ריצה קלות.	18	18	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	7	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
19485961-aa51-4521-bc3f-2c4f261d7daa	Ultra Slim Smart Watch V2	ultra-slim-smart-watch-v2	1200.00	890.00	0	שעון חכם דק במיוחד.	15	15	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	8	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
4cf7484a-dd48-4fec-898b-f64b9372e6dc	Drone Mini 4K	drone-mini-4k	1900.00	1550.00	0	רחפן קטן עם מצלמת 4K.	10	10	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	8	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
558cf6f3-f373-4701-a3f3-d01c33393339	Portable Mini Projector	portable-mini-projector	950.00	750.00	0	מקרן כיס נייד.	12	12	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	8	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
88703419-3eb1-413b-800f-3614e7ec3ad8	GPS Tracker Personal	gps-tracker-personal	320.00	250.00	0	מכשיר איתור אישי.	20	20	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	8	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
7e6353e5-5bd3-4c1e-90d6-54a131294615	Electric Fan Summer Pro	electric-fan-summer-pro	450.00	350.00	0	מאוורר חשמלי עוצמתי (קיץ).	25	25	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	9	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
6153bf36-5c95-48f0-b2a0-8d8415d3b381	Portable Outdoor Heater	portable-outdoor-heater	650.00	500.00	0	מחמם נייד לגינה (חורף).	20	20	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	9	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
0a2e3627-c10b-4042-9a47-1981d3c9c943	Christmas LED Light String	christmas-led-light-string	100.00	75.00	0	שרשרת אורות לד (חגים).	80	80	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	9	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
b225e69d-d7ba-486a-99bf-c13e11b9ec5e	Sound Bar Ultimate	sound-bar-ultimate	2200.00	1750.00	0	סאונד בר 5.1.	15	15	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	1	2025-12-27 20:29:06.264578+02	2025-12-29 14:33:40.03585+02
516a4bf1-0750-4f2d-ae96-9987a727fd96	Robot Vacuum & Mop	robot-vacuum-mop	2500.00	1900.00	0	שואב ושוטף רובוטי.	12	12	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	1	2025-12-27 20:29:06.264578+02	2025-12-29 14:35:37.056094+02
e22195c2-8a3e-4607-9e3d-c3f927bac328	Digital Camera Mirrorless	digital-camera-mirrorless	5500.00	4800.00	0	מצלמת מירורלס מקצועית.	6	6	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	3	2025-12-27 20:29:06.264578+02	2025-12-29 14:52:21.041807+02
064af029-28fe-4d63-a0ac-c259b5b1d3ec	Sun Umbrella UV Protect	sun-umbrella-uv-protect	200.00	150.00	0	שמשיה נגד UV (קיץ).	30	30	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	9	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
933793c8-51ae-4c61-846e-c05d8a55b04d	Garden Tools Set Spring	garden-tools-set-spring	300.00	220.00	0	ערכת כלי גינה (אביב).	40	40	t	a1b2c3d4-e5f6-7890-1234-567890abcdef	9	2025-12-27 20:29:06.264578+02	2025-12-27 20:29:06.264578+02
1797ad07-4bef-4fb8-a5a1-e0f30a548025	MMM	\N	1500.00	0.00	0		1	\N	t	\N	2	2025-12-27 21:32:45.066104+02	2025-12-27 21:32:45.066104+02
4cf36529-30ef-4c6a-a370-5b3362f959c6	BBB	\N	2020.00	0.00	0		1	\N	t	\N	1	2025-12-27 21:07:31.048321+02	2025-12-27 21:44:26.712354+02
52655d15-a744-4dd4-9b5a-e2dd7edfad2e	bbbb	\N	150.00	0.00	0		1	\N	t	\N	1	2025-12-28 12:35:07.752837+02	2025-12-28 12:35:07.752837+02
ba2e7ee1-f47b-4fcb-850a-268f39176365	BBB	\N	12.00	0.00	0		1	\N	t	\N	1	2025-12-29 09:44:14.437422+02	2025-12-29 09:44:14.437422+02
3f75af40-ae84-4751-8509-b152dae02e94	2020	\N	21.00	0.00	0	\N	1	\N	t	\N	1	2025-12-29 12:04:45.392123+02	2025-12-29 12:04:45.392123+02
0d15252a-14a0-4f6c-92b6-527f8e1414bd	56	\N	5.00	0.00	0	\N	1	\N	t	\N	2	2025-12-29 12:56:53.405715+02	2025-12-29 12:56:53.405715+02
c4fa3d61-a8fa-4cf9-82d0-47ee802d2960	26	\N	1.00	0.00	0	\N	1	\N	t	\N	2	2025-12-29 14:45:49.443296+02	2025-12-29 14:45:49.443296+02
98008003-c94b-4a04-8d06-bdf237c2f94f	56	\N	2500.00	0.00	0	\N	1	\N	t	\N	3	2025-12-29 14:46:32.806668+02	2025-12-29 14:46:32.806668+02
54520804-a8ae-4c42-95fe-76c0a021d9d2	25	\N	5.00	0.00	0	\N	1	\N	t	\N	2	2025-12-29 14:54:59.770079+02	2025-12-29 14:54:59.770079+02
28b28dd1-437f-4f27-aa8a-56c39a88ebe5	25	\N	2.00	0.00	0	\N	1	\N	t	\N	2	2025-12-29 15:01:39.870643+02	2025-12-29 15:01:39.870643+02
dea9c0ec-a598-4a54-ac45-b1c15c3084a4	12	\N	2.00	0.00	0	\N	1	\N	t	\N	2	2025-12-29 15:11:31.733366+02	2025-12-29 15:11:31.733366+02
3a6da73a-d123-4ce4-b92d-582b403a40b7	25	\N	2.00	0.00	0	\N	1	\N	t	\N	3	2025-12-29 15:14:24.44143+02	2025-12-29 15:14:24.44143+02
04a28246-fbe6-48cd-8ee9-5f00edb6dbce	30	\N	2.00	0.00	1	\N	1	\N	t	\N	3	2025-12-29 15:33:26.489013+02	2025-12-29 15:33:37.814881+02
251ade74-9590-4327-8252-8b259c3b2138	125	\N	125.00	0.00	1	\N	1	\N	t	\N	2	2025-12-30 09:14:27.807387+02	2025-12-30 10:40:34.162102+02
\.


--
-- Data for Name: search_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.search_history (id, user_id, keyword, created_at) FROM stdin;
69d30ffa-67da-408d-8ca9-61deed5f463e	a4887695-9203-46a4-ba9d-7224a8a1b78d	RTX 4070 laptop	2025-12-27 20:29:06.514633+02
417d5688-08c6-4451-92e6-5d0987f7591d	da9ede3d-e916-4f71-b6af-e0dd50a240ae	מכונת קפה	2025-12-27 20:29:06.514633+02
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, amount, currency, type, status, provider, provider_ref, idempotency_key, error_code, error_message, created_at, updated_at, user_id, group_id) FROM stdin;
8291db0c-d411-493d-bea4-59fae6b68fc6	1400.00	ILS	CHARGE	SUCCESS	Tranzilla	TRZ-16c97ca0-7	1f6cc4b1-e583-466b-8ce4-ea66667a4ec8	\N	\N	2025-12-27 20:29:06.436793+02	2025-12-27 20:29:06.436793+02	\N	\N
c69f8928-d56d-4713-85d1-2e52d6f02f19	3800.00	ILS	CHARGE	SUCCESS	Tranzilla	TRZ-d922b41e-7	a524485a-8030-45df-9abc-32364ac15574	\N	\N	2025-12-27 20:29:06.436793+02	2025-12-27 20:29:06.436793+02	\N	\N
845f9159-a29f-400e-ba7b-b2c82e44da64	8800.00	ILS	REFUND	SUCCESS	Tranzilla	TRZ-a5b2f007-9	ebda1f1a-6af6-4628-b6df-ddcd90618b37	\N	\N	2025-12-27 20:29:06.436793+02	2025-12-27 20:29:06.436793+02	\N	\N
e76c0bcc-bb91-46af-ba55-d309d25ff7d3	1400.00	ILS	PREAUTH	INITIATED	stripe	internal-374d73f7-fb43-4533-83f5-660cf25b268a	9b18ed98-b950-4532-bc39-b4104ff014e5	\N	\N	2025-12-28 12:28:21.64872+02	2025-12-28 12:28:21.64872+02	99bb4b78-b881-405a-ade6-80318bbe7cbc	9b9f617b-ec5a-4178-809f-d974c53e3bd1
2590621e-b6c6-4fd2-bc04-28ba79ed0434	7500.00	ILS	PREAUTH	INITIATED	stripe	internal-100f2817-ea9a-4af6-8c2a-788dee055aeb	48917eb9-1e55-4b6d-a3ae-6310d6500594	\N	\N	2025-12-28 12:28:30.311737+02	2025-12-28 12:28:30.311737+02	99bb4b78-b881-405a-ade6-80318bbe7cbc	49e43e83-20ac-4f90-938d-0128bdba4964
73167955-5d70-4e35-860e-122af311b9fb	1400.00	ILS	PREAUTH	INITIATED	stripe	internal-c0b333b6-6ae4-49df-a309-c5dfeb50c4fd	e3b3ae09-a8cf-4060-b6b5-c3fbb2083fd9	\N	\N	2025-12-28 12:32:18.05225+02	2025-12-28 12:32:18.05225+02	99bb4b78-b881-405a-ade6-80318bbe7cbc	9b9f617b-ec5a-4178-809f-d974c53e3bd1
2eb93857-3338-4086-9294-165e2e46fe75	7500.00	ILS	PREAUTH	INITIATED	stripe	internal-d351cc58-3b2d-458a-8f54-c95f450670f8	81e932c8-f8c2-4f78-b819-3a228c4be381	\N	\N	2025-12-28 12:32:25.223757+02	2025-12-28 12:32:25.223757+02	99bb4b78-b881-405a-ade6-80318bbe7cbc	49e43e83-20ac-4f90-938d-0128bdba4964
bd940f3d-b3c7-416e-98be-12a6c00c61de	1400.00	ILS	PREAUTH	INITIATED	stripe	internal-840350f5-c907-4c61-a63a-a96fc602b7ac	cafe4cb1-4291-4adb-a5e3-e138ed964314	\N	\N	2025-12-28 12:33:14.851339+02	2025-12-28 12:33:14.851339+02	99bb4b78-b881-405a-ade6-80318bbe7cbc	9b9f617b-ec5a-4178-809f-d974c53e3bd1
c5f288d6-2958-4c52-93ac-d8cc3a899b5f	890.00	ILS	PREAUTH	INITIATED	stripe	internal-a79e02c9-fba2-4cb8-89f0-3f5283459d23	e5d1d533-88cf-4d06-98d0-6f6a96c5dd77	\N	\N	2025-12-28 12:33:24.012123+02	2025-12-28 12:33:24.012123+02	99bb4b78-b881-405a-ade6-80318bbe7cbc	dfc64f7d-3fad-4a2a-a751-4965a0a74652
fd50d65a-7a40-44cb-9ca7-b0abfb1249ef	1400.00	ILS	PREAUTH	INITIATED	stripe	internal-e7008073-b70d-4ea0-8ac8-4efee6aa134d	9d45a6e8-0d0c-4b3a-8ac6-54de96b1a14c	\N	\N	2025-12-28 12:34:06.128282+02	2025-12-28 12:34:06.128282+02	99bb4b78-b881-405a-ade6-80318bbe7cbc	9b9f617b-ec5a-4178-809f-d974c53e3bd1
416bed1b-88e9-4575-bf47-3065f44736e0	1400.00	ILS	PREAUTH	INITIATED	stripe	internal-e3cc6d2b-dd60-4d29-80d0-3881bfaf52ce	8c2dd32e-4423-4c73-8450-b38c73f320ad	\N	\N	2025-12-28 13:49:53.194479+02	2025-12-28 13:49:53.194479+02	99bb4b78-b881-405a-ade6-80318bbe7cbc	9b9f617b-ec5a-4178-809f-d974c53e3bd1
\.


--
-- Data for Name: user_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_settings (user_id, "notificationLevel", created_at, updated_at) FROM stdin;
a4887695-9203-46a4-ba9d-7224a8a1b78d	instant	2025-12-27 20:29:06.496911+02	2025-12-27 20:29:06.496911+02
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, username, password, is_admin, created_at, updated_at) FROM stdin;
09987083-ea8d-4a1d-b4c2-ed56cd3a79e2	admin@buyforce.com	admin	f8c0a3c8-52e6-4b8b-8294-6868e6860beb	f	2025-12-27 20:29:06.376104+02	2025-12-27 20:29:06.376104+02
da9ede3d-e916-4f71-b6af-e0dd50a240ae	seva1@example.com	seva1	5f66956c-f299-43ad-8bd5-c0a7c830f1f6	f	2025-12-27 20:29:06.376104+02	2025-12-27 20:29:06.376104+02
36c5274b-0805-4070-abb0-6c6d43b87292	seva2@example.com	seva2	baeaacf8-560e-4061-b9fb-4c7c86d7f4a4	f	2025-12-27 20:29:06.376104+02	2025-12-27 20:29:06.376104+02
d605054b-351b-496d-99e0-9106187e6fd5	seva3@example.com	seva3	e746c72d-4aef-4d8b-9d1f-63dadc5ecfe8	f	2025-12-27 20:29:06.376104+02	2025-12-27 20:29:06.376104+02
5556871b-2d1b-4d1c-bdfd-e35b25f12bde	pre1@example.com	pre1	cbc00db6-a84e-438a-a1e6-8f83668d014c	f	2025-12-27 20:29:06.376104+02	2025-12-27 20:29:06.376104+02
df16d1b5-828d-4561-ba61-672106328f52	pre2@example.com	pre2	7cb1f2ae-5718-4992-8f43-f18a17e22404	f	2025-12-27 20:29:06.376104+02	2025-12-27 20:29:06.376104+02
a4887695-9203-46a4-ba9d-7224a8a1b78d	power@example.com	power	d6b8e176-1a3e-471e-b14f-e63753c410ef	f	2025-12-27 20:29:06.376104+02	2025-12-27 20:29:06.376104+02
94e2cd2e-ad43-4e20-b077-c5af14bb9a57	social@example.com	social	fd1ff202-be79-4a4f-b98a-9b989c60ccf8	f	2025-12-27 20:29:06.376104+02	2025-12-27 20:29:06.376104+02
bff99274-3222-446a-a98f-5b2fa818280b	test1@test.com	test1	$2b$10$.QF4iu1YvMlMV9pMqtZLGOUbn.mBB/PUihqcnc6v0txbOAybvrUuO	f	2025-12-27 20:35:22.605221+02	2025-12-27 20:35:22.605221+02
99bb4b78-b881-405a-ade6-80318bbe7cbc	boss@gmail.com	boss	$2b$10$1IhmCQCMTatqQkT4.AFPbuhI4SrZpFqKmiB06wjUbmv8vEedW9l1G	t	2025-12-27 20:51:45.247407+02	2025-12-27 20:51:45.247407+02
\.


--
-- Data for Name: wishlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlist (id, user_id, product_id, created_at) FROM stdin;
264efb55-8f85-42ba-9a5c-2f516aec0a65	a4887695-9203-46a4-ba9d-7224a8a1b78d	0ea39696-e698-43dc-993f-656897b56584	2025-12-27 20:29:06.501473+02
ed2c78ac-a4fb-40b8-a906-f04f9c4dcbc5	94e2cd2e-ad43-4e20-b077-c5af14bb9a57	a9760805-e543-4575-997b-63b5d7ac7059	2025-12-27 20:29:06.501473+02
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 9, true);


--
-- Name: homepage_metrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.homepage_metrics_id_seq', 1, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 2, true);


--
-- Name: product_specs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_specs_id_seq', 2, true);


--
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- Name: product_images PK_1974264ea7265989af8392f63a1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY (id);


--
-- Name: audit_logs PK_1bb179d048bbc581caa3b013439; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY (id);


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: product_performance PK_2f953a8c10928facc2882840d16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_performance
    ADD CONSTRAINT "PK_2f953a8c10928facc2882840d16" PRIMARY KEY (product_id);


--
-- Name: group_memberships PK_4a04ebe9f25ad41f45b2c0ca4b5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_memberships
    ADD CONSTRAINT "PK_4a04ebe9f25ad41f45b2c0ca4b5" PRIMARY KEY (id);


--
-- Name: user_settings PK_4ed056b9344e6f7d8d46ec4b302; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT "PK_4ed056b9344e6f7d8d46ec4b302" PRIMARY KEY (user_id);


--
-- Name: wishlist PK_620bff4a240d66c357b5d820eaa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT "PK_620bff4a240d66c357b5d820eaa" PRIMARY KEY (id);


--
-- Name: groups PK_659d1483316afb28afd3a90646e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY (id);


--
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- Name: comments PK_8bf68bc960f2b69e818bdb90dcb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY (id);


--
-- Name: transactions PK_a219afd8dd77ed80f5a862f1db9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: search_history PK_cb93c8f85dbdca85943ca494812; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_history
    ADD CONSTRAINT "PK_cb93c8f85dbdca85943ca494812" PRIMARY KEY (id);


--
-- Name: product_specs PK_d0cb5ab51b09cdbb6d3e6ce50f5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_specs
    ADD CONSTRAINT "PK_d0cb5ab51b09cdbb6d3e6ce50f5" PRIMARY KEY (id);


--
-- Name: admins PK_e3b38270c97a854c48d2e80874e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY (id);


--
-- Name: homepage_metrics PK_e3e17038609b88ddb5d55c37195; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.homepage_metrics
    ADD CONSTRAINT "PK_e3e17038609b88ddb5d55c37195" PRIMARY KEY (id);


--
-- Name: transactions UQ_11a02d187c87d3dc5b0b4949f20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "UQ_11a02d187c87d3dc5b0b4949f20" UNIQUE (idempotency_key);


--
-- Name: categories UQ_420d9f679d41281f282f5bc7d09; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE (slug);


--
-- Name: products UQ_464f927ae360106b783ed0b4106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE (slug);


--
-- Name: categories UQ_8b0be371d28245da6e4f4b61878; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE (name);


--
-- Name: wishlist unique_user_product; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT unique_user_product UNIQUE (user_id, product_id);


--
-- Name: IDX_97672ac88f789774dd47f7c8be; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON public.users USING btree (email);


--
-- Name: IDX_fe0bb3f6520ee0469504521e71; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON public.users USING btree (username);


--
-- Name: homepage_metrics FK_08d7a84c3d09e090ea515794815; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.homepage_metrics
    ADD CONSTRAINT "FK_08d7a84c3d09e090ea515794815" FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: group_memberships FK_0c17187cdb850dd35a70f6a0598; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_memberships
    ADD CONSTRAINT "FK_0c17187cdb850dd35a70f6a0598" FOREIGN KEY (transaction_id) REFERENCES public.transactions(id);


--
-- Name: wishlist FK_16f64e06715ce4fea8257cc42c5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT "FK_16f64e06715ce4fea8257cc42c5" FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: admins FK_2b901dd818a2a6486994d915a68; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT "FK_2b901dd818a2a6486994d915a68" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_performance FK_2f953a8c10928facc2882840d16; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_performance
    ADD CONSTRAINT "FK_2f953a8c10928facc2882840d16" FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: groups FK_32313bad833ea1d1391cb4b5dd9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT "FK_32313bad833ea1d1391cb4b5dd9" FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: transactions FK_4ad1884a5fad7c6262357290dbb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "FK_4ad1884a5fad7c6262357290dbb" FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: user_settings FK_4ed056b9344e6f7d8d46ec4b302; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_images FK_4f166bb8c2bfcef2498d97b4068; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068" FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: wishlist FK_512bf776587ad5fc4f804277d76; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT "FK_512bf776587ad5fc4f804277d76" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_specs FK_7ade97675e64f0a2abd6c5be81d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_specs
    ADD CONSTRAINT "FK_7ade97675e64f0a2abd6c5be81d" FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products FK_9a5f6868c96e0069e699f33e124; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: notifications FK_9a8a82462cab47c73d25f49261f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: comments FK_9f8304787dd13d61bc94afd07b0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "FK_9f8304787dd13d61bc94afd07b0" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: audit_logs FK_b29de603374cbfa7d776d88e5b5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "FK_b29de603374cbfa7d776d88e5b5" FOREIGN KEY (admin_id) REFERENCES public.admins(id);


--
-- Name: group_memberships FK_cad344fe877fcee0ac7e065ed05; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_memberships
    ADD CONSTRAINT "FK_cad344fe877fcee0ac7e065ed05" FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: search_history FK_d1ebf4101b2804213251e0a04d2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_history
    ADD CONSTRAINT "FK_d1ebf4101b2804213251e0a04d2" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: group_memberships FK_e232a617b3bc2de2e13c0289d62; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_memberships
    ADD CONSTRAINT "FK_e232a617b3bc2de2e13c0289d62" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: transactions FK_e9acc6efa76de013e8c1553ed2b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict CsuRXBpF59JP2ZIhsZKDw4wBd0onW3ShPPKVLz5NZOpnVSBN1CBPllCXSkaOBu2

