--
-- PostgreSQL database dump
--

\restrict iR68T9y8Jnbx41Fcs9DjWh41yD0iYG5unnhOIggeaFlsK2uxprsCBF1m1ggs6gh

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    id uuid NOT NULL,
    user_id uuid,
    role character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT admins_role_check CHECK (((role)::text = ANY ((ARRAY['super_admin'::character varying, 'ops'::character varying, 'support'::character varying])::text[])))
);


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id uuid NOT NULL,
    admin_id uuid,
    action character varying(255) NOT NULL,
    target_type character varying(50) NOT NULL,
    target_id uuid,
    details jsonb,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT audit_logs_target_type_check CHECK (((target_type)::text = ANY ((ARRAY['product'::character varying, 'group'::character varying, 'user'::character varying, 'transaction'::character varying])::text[])))
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    icon_url text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: group_memberships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_memberships (
    id uuid NOT NULL,
    group_id uuid,
    user_id uuid,
    status character varying(50) NOT NULL,
    joined_at timestamp with time zone DEFAULT now(),
    cancelled_at timestamp with time zone,
    charged_at timestamp with time zone,
    refunded_at timestamp with time zone,
    transaction_id uuid,
    amount_group_price numeric(12,2) NOT NULL,
    CONSTRAINT group_memberships_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING_PREAUTH'::character varying, 'PREAUTH_HELD'::character varying, 'CHARGED'::character varying, 'REFUNDED'::character varying, 'CANCELLED'::character varying, 'FAILED'::character varying])::text[])))
);


--
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.groups (
    id uuid NOT NULL,
    product_id uuid,
    status character varying(50) NOT NULL,
    joined_count integer DEFAULT 0 NOT NULL,
    target_members integer NOT NULL,
    max_members integer,
    deadline timestamp with time zone NOT NULL,
    reached_target_at timestamp with time zone,
    locked_at timestamp with time zone,
    charged_at timestamp with time zone,
    failed_at timestamp with time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT groups_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'OPEN'::character varying, 'REACHED_TARGET'::character varying, 'LOCKED'::character varying, 'CHARGING'::character varying, 'CHARGED'::character varying, 'FAILED'::character varying, 'REFUNDED'::character varying])::text[])))
);


--
-- Name: homepage_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homepage_metrics (
    id integer NOT NULL,
    category_id integer,
    week_start date NOT NULL,
    joins_count integer DEFAULT 0,
    gmv numeric(14,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: homepage_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.homepage_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: homepage_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.homepage_metrics_id_seq OWNED BY public.homepage_metrics.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    user_id uuid,
    type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    body text NOT NULL,
    payload jsonb,
    channel character varying(50) NOT NULL,
    status character varying(50) NOT NULL,
    error_message text,
    created_at timestamp without time zone DEFAULT now(),
    sent_at timestamp with time zone,
    CONSTRAINT notifications_channel_check CHECK (((channel)::text = ANY ((ARRAY['push'::character varying, 'email'::character varying, 'in_app'::character varying])::text[]))),
    CONSTRAINT notifications_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'SENT'::character varying, 'FAILED'::character varying])::text[]))),
    CONSTRAINT notifications_type_check CHECK (((type)::text = ANY ((ARRAY['GROUP_JOINED'::character varying, 'GROUP_70'::character varying, 'GROUP_95'::character varying, 'GROUP_SUCCESS'::character varying, 'GROUP_FAILED'::character varying, 'PAYMENT_FAILED'::character varying, 'PROMO'::character varying])::text[])))
);


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    product_id uuid,
    image_url text NOT NULL,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: product_performance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_performance (
    product_id uuid NOT NULL,
    views_7d integer DEFAULT 0,
    joins_7d integer DEFAULT 0,
    wishlist_adds_7d integer DEFAULT 0,
    conversion_rate numeric(5,2) DEFAULT 0,
    last_aggregated_at timestamp with time zone
);


--
-- Name: product_specs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_specs (
    id integer NOT NULL,
    product_id uuid,
    spec_key character varying(255) NOT NULL,
    spec_value character varying(255),
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: product_specs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_specs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_specs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_specs_id_seq OWNED BY public.product_specs.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    category_id integer NOT NULL,
    description text,
    price_regular numeric(12,2) NOT NULL,
    price_group numeric(12,2) NOT NULL,
    currency character varying(10) DEFAULT 'ILS'::character varying,
    is_active boolean DEFAULT true,
    min_members integer NOT NULL,
    max_members integer,
    supplier_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: search_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.search_history (
    id uuid NOT NULL,
    user_id uuid,
    keyword character varying(255),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    id uuid NOT NULL,
    user_id uuid,
    group_id uuid,
    amount numeric(12,2) NOT NULL,
    currency character varying(10) DEFAULT 'ILS'::character varying,
    type character varying(50) NOT NULL,
    status character varying(50) NOT NULL,
    provider character varying(50) DEFAULT 'Tranzilla'::character varying,
    provider_ref character varying(255),
    idempotency_key character varying(255) NOT NULL,
    error_code character varying(100),
    error_message text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT transactions_status_check CHECK (((status)::text = ANY ((ARRAY['INITIATED'::character varying, 'SUCCESS'::character varying, 'FAILED'::character varying])::text[]))),
    CONSTRAINT transactions_type_check CHECK (((type)::text = ANY ((ARRAY['PREAUTH'::character varying, 'CHARGE'::character varying, 'REFUND'::character varying])::text[])))
);


--
-- Name: user_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_settings (
    user_id uuid NOT NULL,
    push_enabled boolean DEFAULT true,
    email_enabled boolean DEFAULT true,
    language character varying(10) DEFAULT 'en'::character varying,
    notification_level character varying(50) DEFAULT 'all'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    email_verified boolean DEFAULT false,
    password_hash character varying(255),
    auth_provider character varying(50) NOT NULL,
    provider_user_id character varying(255),
    full_name character varying(255),
    phone character varying(50),
    locale character varying(10) DEFAULT 'en'::character varying,
    currency character varying(10) DEFAULT 'ILS'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: wishlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wishlist (
    id uuid NOT NULL,
    user_id uuid,
    product_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: homepage_metrics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_metrics ALTER COLUMN id SET DEFAULT nextval('public.homepage_metrics_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: product_specs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_specs ALTER COLUMN id SET DEFAULT nextval('public.product_specs_id_seq'::regclass);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: group_memberships group_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_memberships
    ADD CONSTRAINT group_memberships_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: homepage_metrics homepage_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_metrics
    ADD CONSTRAINT homepage_metrics_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: product_performance product_performance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_performance
    ADD CONSTRAINT product_performance_pkey PRIMARY KEY (product_id);


--
-- Name: product_specs product_specs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_specs
    ADD CONSTRAINT product_specs_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_key UNIQUE (slug);


--
-- Name: search_history search_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_history
    ADD CONSTRAINT search_history_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: group_memberships unique_group_user; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_memberships
    ADD CONSTRAINT unique_group_user UNIQUE (group_id, user_id);


--
-- Name: transactions unique_idempotency_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT unique_idempotency_key UNIQUE (idempotency_key);


--
-- Name: wishlist unique_user_product; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT unique_user_product UNIQUE (user_id, product_id);


--
-- Name: user_settings user_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_pkey PRIMARY KEY (user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wishlist wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_target; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_target ON public.audit_logs USING btree (target_type, target_id);


--
-- Name: idx_group_memberships_group; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_memberships_group ON public.group_memberships USING btree (group_id);


--
-- Name: idx_group_memberships_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_memberships_status ON public.group_memberships USING btree (status);


--
-- Name: idx_group_memberships_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_memberships_user ON public.group_memberships USING btree (user_id);


--
-- Name: idx_groups_open_deadline; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_groups_open_deadline ON public.groups USING btree (status, deadline) WHERE ((status)::text = 'OPEN'::text);


--
-- Name: idx_groups_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_groups_product ON public.groups USING btree (product_id);


--
-- Name: idx_groups_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_groups_status ON public.groups USING btree (status);


--
-- Name: idx_homepage_metrics_category_week; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_homepage_metrics_category_week ON public.homepage_metrics USING btree (category_id, week_start);


--
-- Name: idx_notifications_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_status ON public.notifications USING btree (status);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- Name: idx_product_images_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_images_product_id ON public.product_images USING btree (product_id);


--
-- Name: idx_products_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_active ON public.products USING btree (is_active);


--
-- Name: idx_products_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_category ON public.products USING btree (category_id);


--
-- Name: idx_products_prices; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_prices ON public.products USING btree (price_regular, price_group);


--
-- Name: idx_search_keyword; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_keyword ON public.search_history USING btree (keyword);


--
-- Name: idx_search_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_user ON public.search_history USING btree (user_id, created_at);


--
-- Name: idx_tx_group; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tx_group ON public.transactions USING btree (group_id);


--
-- Name: idx_tx_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tx_status ON public.transactions USING btree (status);


--
-- Name: idx_tx_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tx_user ON public.transactions USING btree (user_id);


--
-- Name: idx_users_provider_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_provider_user ON public.users USING btree (provider_user_id);


--
-- Name: idx_wishlist_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_wishlist_product ON public.wishlist USING btree (product_id);


--
-- Name: idx_wishlist_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_wishlist_user ON public.wishlist USING btree (user_id);


--
-- Name: admins admins_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: audit_logs audit_logs_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(id);


--
-- Name: products fk_category; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT;


--
-- Name: user_settings fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: group_memberships group_memberships_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_memberships
    ADD CONSTRAINT group_memberships_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: group_memberships group_memberships_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_memberships
    ADD CONSTRAINT group_memberships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: groups groups_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: homepage_metrics homepage_metrics_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_metrics
    ADD CONSTRAINT homepage_metrics_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_performance product_performance_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_performance
    ADD CONSTRAINT product_performance_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_specs product_specs_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_specs
    ADD CONSTRAINT product_specs_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: search_history search_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_history
    ADD CONSTRAINT search_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: transactions transactions_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: wishlist wishlist_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: wishlist wishlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict iR68T9y8Jnbx41Fcs9DjWh41yD0iYG5unnhOIggeaFlsK2uxprsCBF1m1ggs6gh

