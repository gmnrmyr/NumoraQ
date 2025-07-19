create extension if not exists "wrappers" with schema "extensions";


create table "public"."admin_audit_log" (
    "id" uuid not null default gen_random_uuid(),
    "admin_user_id" uuid,
    "action" text not null,
    "details" text,
    "timestamp" timestamp with time zone default now(),
    "ip_address" text,
    "created_at" timestamp with time zone default now()
);


alter table "public"."admin_audit_log" enable row level security;

create table "public"."cms_settings" (
    "id" uuid not null default gen_random_uuid(),
    "setting_key" text not null,
    "setting_value" jsonb not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."cms_settings" enable row level security;

create table "public"."financial_data" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "data" jsonb not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."financial_data" enable row level security;

create table "public"."payment_sessions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "payment_method" text not null,
    "subscription_plan" text not null,
    "amount" numeric(10,2) not null,
    "currency" text not null default 'USD'::text,
    "status" text not null default 'pending'::text,
    "expires_at" timestamp with time zone not null,
    "metadata" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."payment_sessions" enable row level security;

create table "public"."premium_codes" (
    "id" uuid not null default gen_random_uuid(),
    "code" text not null,
    "is_used" boolean default false,
    "used_by" uuid,
    "used_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "code_type" text default 'lifetime'::text,
    "is_active" boolean default true,
    "expires_at" timestamp with time zone,
    "created_by" uuid,
    "user_email" text
);


alter table "public"."premium_codes" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "name" text,
    "default_currency" text default 'BRL'::text,
    "language" text default 'en'::text,
    "live_data_enabled" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "user_uid" text,
    "admin_role" boolean default false,
    "admin_level" text default 'standard'::text
);


alter table "public"."profiles" enable row level security;

create table "public"."user_backups" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "backup_name" text not null default 'Manual Backup'::text,
    "backup_data" jsonb not null,
    "backup_type" text not null default 'manual'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."user_backups" enable row level security;

create table "public"."user_points" (
    "user_id" uuid not null,
    "points" integer default 0,
    "total_donated" numeric(10,2) default 0,
    "highest_tier" text default 'newcomer'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "activity_type" text default 'manual'::text,
    "activity_date" date default CURRENT_DATE,
    "points_source" text default 'manual'::text,
    "source_details" jsonb default '{}'::jsonb,
    "assigned_by_admin" uuid
);


alter table "public"."user_points" enable row level security;

create table "public"."user_premium_status" (
    "user_id" uuid not null,
    "is_premium" boolean default false,
    "premium_plan" text,
    "premium_expires_at" timestamp with time zone,
    "stripe_customer_id" text,
    "stripe_subscription_id" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "premium_type" text,
    "expires_at" timestamp with time zone,
    "activated_at" timestamp with time zone,
    "payment_session_id" text,
    "activation_source" text default 'unknown'::text,
    "source_details" jsonb default '{}'::jsonb,
    "activated_by_admin" uuid,
    "activated_code" text
);


alter table "public"."user_premium_status" enable row level security;

CREATE UNIQUE INDEX admin_audit_log_pkey ON public.admin_audit_log USING btree (id);

CREATE UNIQUE INDEX cms_settings_pkey ON public.cms_settings USING btree (id);

CREATE UNIQUE INDEX cms_settings_setting_key_key ON public.cms_settings USING btree (setting_key);

CREATE UNIQUE INDEX financial_data_pkey ON public.financial_data USING btree (id);

CREATE UNIQUE INDEX financial_data_user_id_unique ON public.financial_data USING btree (user_id);

CREATE INDEX idx_payment_sessions_expires_at ON public.payment_sessions USING btree (expires_at);

CREATE INDEX idx_payment_sessions_status ON public.payment_sessions USING btree (status);

CREATE INDEX idx_payment_sessions_user_id ON public.payment_sessions USING btree (user_id);

CREATE INDEX idx_premium_codes_code ON public.premium_codes USING btree (code);

CREATE INDEX idx_premium_codes_is_used ON public.premium_codes USING btree (is_used);

CREATE INDEX idx_profiles_user_uid ON public.profiles USING btree (user_uid);

CREATE INDEX idx_user_backups_created_at ON public.user_backups USING btree (created_at DESC);

CREATE INDEX idx_user_backups_type ON public.user_backups USING btree (backup_type);

CREATE INDEX idx_user_backups_user_id ON public.user_backups USING btree (user_id);

CREATE UNIQUE INDEX payment_sessions_pkey ON public.payment_sessions USING btree (id);

CREATE UNIQUE INDEX premium_codes_code_key ON public.premium_codes USING btree (code);

CREATE UNIQUE INDEX premium_codes_pkey ON public.premium_codes USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX user_backups_pkey ON public.user_backups USING btree (id);

CREATE UNIQUE INDEX user_points_pkey ON public.user_points USING btree (user_id);

CREATE UNIQUE INDEX user_points_unique_login_referral ON public.user_points USING btree (user_id, activity_type, activity_date) WHERE (activity_type = ANY (ARRAY['login'::text, 'referral'::text]));

CREATE UNIQUE INDEX user_premium_status_pkey ON public.user_premium_status USING btree (user_id);

alter table "public"."admin_audit_log" add constraint "admin_audit_log_pkey" PRIMARY KEY using index "admin_audit_log_pkey";

alter table "public"."cms_settings" add constraint "cms_settings_pkey" PRIMARY KEY using index "cms_settings_pkey";

alter table "public"."financial_data" add constraint "financial_data_pkey" PRIMARY KEY using index "financial_data_pkey";

alter table "public"."payment_sessions" add constraint "payment_sessions_pkey" PRIMARY KEY using index "payment_sessions_pkey";

alter table "public"."premium_codes" add constraint "premium_codes_pkey" PRIMARY KEY using index "premium_codes_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."user_backups" add constraint "user_backups_pkey" PRIMARY KEY using index "user_backups_pkey";

alter table "public"."user_points" add constraint "user_points_pkey" PRIMARY KEY using index "user_points_pkey";

alter table "public"."user_premium_status" add constraint "user_premium_status_pkey" PRIMARY KEY using index "user_premium_status_pkey";

alter table "public"."admin_audit_log" add constraint "admin_audit_log_admin_user_id_fkey" FOREIGN KEY (admin_user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."admin_audit_log" validate constraint "admin_audit_log_admin_user_id_fkey";

alter table "public"."cms_settings" add constraint "cms_settings_setting_key_key" UNIQUE using index "cms_settings_setting_key_key";

alter table "public"."financial_data" add constraint "financial_data_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."financial_data" validate constraint "financial_data_user_id_fkey";

alter table "public"."financial_data" add constraint "financial_data_user_id_unique" UNIQUE using index "financial_data_user_id_unique";

alter table "public"."payment_sessions" add constraint "payment_sessions_payment_method_check" CHECK ((payment_method = ANY (ARRAY['stripe'::text, 'paypal'::text, 'crypto'::text]))) not valid;

alter table "public"."payment_sessions" validate constraint "payment_sessions_payment_method_check";

alter table "public"."payment_sessions" add constraint "payment_sessions_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'processing'::text, 'completed'::text, 'failed'::text, 'cancelled'::text]))) not valid;

alter table "public"."payment_sessions" validate constraint "payment_sessions_status_check";

alter table "public"."payment_sessions" add constraint "payment_sessions_subscription_plan_check" CHECK ((subscription_plan = ANY (ARRAY['1month'::text, '3months'::text, '6months'::text, '1year'::text, '5years'::text, 'lifetime'::text, 'whale'::text, 'legend'::text, 'patron'::text, 'champion'::text, 'supporter'::text, 'backer'::text, 'donor'::text, 'contributor'::text, 'helper'::text, 'friend'::text, 'supporter-basic'::text, 'newcomer'::text]))) not valid;

alter table "public"."payment_sessions" validate constraint "payment_sessions_subscription_plan_check";

alter table "public"."payment_sessions" add constraint "payment_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."payment_sessions" validate constraint "payment_sessions_user_id_fkey";

alter table "public"."premium_codes" add constraint "premium_codes_code_key" UNIQUE using index "premium_codes_code_key";

alter table "public"."premium_codes" add constraint "premium_codes_used_by_fkey" FOREIGN KEY (used_by) REFERENCES auth.users(id) not valid;

alter table "public"."premium_codes" validate constraint "premium_codes_used_by_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."user_backups" add constraint "user_backups_backup_type_check" CHECK ((backup_type = ANY (ARRAY['manual'::text, 'automatic'::text]))) not valid;

alter table "public"."user_backups" validate constraint "user_backups_backup_type_check";

alter table "public"."user_backups" add constraint "user_backups_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_backups" validate constraint "user_backups_user_id_fkey";

alter table "public"."user_points" add constraint "user_points_assigned_by_admin_fkey" FOREIGN KEY (assigned_by_admin) REFERENCES auth.users(id) not valid;

alter table "public"."user_points" validate constraint "user_points_assigned_by_admin_fkey";

alter table "public"."user_points" add constraint "user_points_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_points" validate constraint "user_points_user_id_fkey";

alter table "public"."user_premium_status" add constraint "user_premium_status_activated_by_admin_fkey" FOREIGN KEY (activated_by_admin) REFERENCES auth.users(id) not valid;

alter table "public"."user_premium_status" validate constraint "user_premium_status_activated_by_admin_fkey";

alter table "public"."user_premium_status" add constraint "user_premium_status_activated_code_fkey" FOREIGN KEY (activated_code) REFERENCES premium_codes(code) ON DELETE SET NULL not valid;

alter table "public"."user_premium_status" validate constraint "user_premium_status_activated_code_fkey";

alter table "public"."user_premium_status" add constraint "user_premium_status_premium_type_check" CHECK ((premium_type = ANY (ARRAY['1month'::text, '3months'::text, '6months'::text, '1year'::text, '5years'::text, 'lifetime'::text, '30day_trial'::text]))) not valid;

alter table "public"."user_premium_status" validate constraint "user_premium_status_premium_type_check";

alter table "public"."user_premium_status" add constraint "user_premium_status_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_premium_status" validate constraint "user_premium_status_user_id_fkey";

set check_function_bodies = off;

create or replace view "public"."admin_premium_status" as  SELECT ups.user_id,
    ups.is_premium,
    ups.premium_type,
    ups.activated_at,
    ups.expires_at,
    ups.payment_session_id,
    ups.activation_source,
    ups.source_details,
    ups.activated_by_admin,
    ups.activated_code,
    ups.created_at,
    ups.updated_at,
    u.email,
    u.created_at AS user_created_at
   FROM (user_premium_status ups
     JOIN auth.users u ON ((ups.user_id = u.id)));


create or replace view "public"."admin_user_points" as  SELECT up.user_id,
    up.points,
    up.activity_type,
    up.activity_date,
    up.points_source,
    up.source_details,
    up.assigned_by_admin,
    up.created_at,
    u.email,
    u.created_at AS user_created_at
   FROM (user_points up
     JOIN auth.users u ON ((up.user_id = u.id)));


CREATE OR REPLACE FUNCTION public.auto_generate_uid()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
    IF NEW.raw_user_meta_data->>'uid' IS NULL THEN
        NEW.raw_user_meta_data = COALESCE(NEW.raw_user_meta_data, '{}'::jsonb) || 
                                 jsonb_build_object('uid', public.generate_unique_uid());
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_admin_users()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
    -- Check if admin users exist
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email IN ('manera@gmail.com', 'manera@numoraq.online', 'admin@numoraq.online')
    ) THEN
        RAISE NOTICE 'No admin users found';
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.cleanup_old_backups()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
    DELETE FROM public.user_backups 
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_unique_uid()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
    new_uid TEXT;
    uid_exists BOOLEAN;
BEGIN
    LOOP
        new_uid := upper(substring(md5(random()::text) from 1 for 8));
        
        SELECT EXISTS(
            SELECT 1 FROM auth.users WHERE raw_user_meta_data->>'uid' = new_uid
        ) INTO uid_exists;
        
        IF NOT uid_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_uid;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_unique_uid(base_name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    clean_name TEXT;
    candidate_uid TEXT;
    counter INTEGER := 0;
BEGIN
    -- Clean the name: remove spaces, special chars, convert to uppercase
    clean_name := UPPER(REGEXP_REPLACE(COALESCE(base_name, 'USER'), '[^A-Za-z0-9]', '', 'g'));
    
    -- Limit to 8 characters max
    clean_name := LEFT(clean_name, 8);
    
    -- If empty after cleaning, use 'USER'
    IF LENGTH(clean_name) = 0 THEN
        clean_name := 'USER';
    END IF;
    
    candidate_uid := clean_name;
    
    -- Check for duplicates and add numbers if needed
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE user_uid = candidate_uid) LOOP
        counter := counter + 1;
        -- Truncate base name to make room for number
        candidate_uid := LEFT(clean_name, 6) || LPAD(counter::TEXT, 2, '0');
    END LOOP;
    
    RETURN candidate_uid;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Create user profile
  INSERT INTO public.profiles (id, name, default_currency, language)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    'BRL',
    'en'
  );
  
  -- Create 30-day trial status for new users
  INSERT INTO public.user_premium_status (
    user_id, 
    is_premium, 
    premium_type,
    activated_at,
    expires_at,
    activation_source,
    source_details
  )
  VALUES (
    NEW.id,
    false,
    '30day_trial',
    NOW(),
    NOW() + INTERVAL '30 days',
    'trial_signup',
    '{"trial_type": "30_day", "auto_created": true}'::jsonb
  );
  
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
    -- Insert trial premium status for new users
    INSERT INTO public.user_premium_status (
        user_id,
        is_premium,
        premium_type,
        activated_at,
        expires_at,
        activation_source,
        source_details
    ) VALUES (
        NEW.id,
        true,
        '30day_trial',
        NOW(),
        NOW() + INTERVAL '30 days',
        'auto_trial',
        jsonb_build_object('type', 'new_user_trial', 'auto_activated', true)
    );
    
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_payment_sessions_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."admin_audit_log" to "anon";

grant insert on table "public"."admin_audit_log" to "anon";

grant references on table "public"."admin_audit_log" to "anon";

grant select on table "public"."admin_audit_log" to "anon";

grant trigger on table "public"."admin_audit_log" to "anon";

grant truncate on table "public"."admin_audit_log" to "anon";

grant update on table "public"."admin_audit_log" to "anon";

grant delete on table "public"."admin_audit_log" to "authenticated";

grant insert on table "public"."admin_audit_log" to "authenticated";

grant references on table "public"."admin_audit_log" to "authenticated";

grant select on table "public"."admin_audit_log" to "authenticated";

grant trigger on table "public"."admin_audit_log" to "authenticated";

grant truncate on table "public"."admin_audit_log" to "authenticated";

grant update on table "public"."admin_audit_log" to "authenticated";

grant delete on table "public"."admin_audit_log" to "service_role";

grant insert on table "public"."admin_audit_log" to "service_role";

grant references on table "public"."admin_audit_log" to "service_role";

grant select on table "public"."admin_audit_log" to "service_role";

grant trigger on table "public"."admin_audit_log" to "service_role";

grant truncate on table "public"."admin_audit_log" to "service_role";

grant update on table "public"."admin_audit_log" to "service_role";

grant delete on table "public"."cms_settings" to "anon";

grant insert on table "public"."cms_settings" to "anon";

grant references on table "public"."cms_settings" to "anon";

grant select on table "public"."cms_settings" to "anon";

grant trigger on table "public"."cms_settings" to "anon";

grant truncate on table "public"."cms_settings" to "anon";

grant update on table "public"."cms_settings" to "anon";

grant delete on table "public"."cms_settings" to "authenticated";

grant insert on table "public"."cms_settings" to "authenticated";

grant references on table "public"."cms_settings" to "authenticated";

grant select on table "public"."cms_settings" to "authenticated";

grant trigger on table "public"."cms_settings" to "authenticated";

grant truncate on table "public"."cms_settings" to "authenticated";

grant update on table "public"."cms_settings" to "authenticated";

grant delete on table "public"."cms_settings" to "service_role";

grant insert on table "public"."cms_settings" to "service_role";

grant references on table "public"."cms_settings" to "service_role";

grant select on table "public"."cms_settings" to "service_role";

grant trigger on table "public"."cms_settings" to "service_role";

grant truncate on table "public"."cms_settings" to "service_role";

grant update on table "public"."cms_settings" to "service_role";

grant delete on table "public"."financial_data" to "anon";

grant insert on table "public"."financial_data" to "anon";

grant references on table "public"."financial_data" to "anon";

grant select on table "public"."financial_data" to "anon";

grant trigger on table "public"."financial_data" to "anon";

grant truncate on table "public"."financial_data" to "anon";

grant update on table "public"."financial_data" to "anon";

grant delete on table "public"."financial_data" to "authenticated";

grant insert on table "public"."financial_data" to "authenticated";

grant references on table "public"."financial_data" to "authenticated";

grant select on table "public"."financial_data" to "authenticated";

grant trigger on table "public"."financial_data" to "authenticated";

grant truncate on table "public"."financial_data" to "authenticated";

grant update on table "public"."financial_data" to "authenticated";

grant delete on table "public"."financial_data" to "service_role";

grant insert on table "public"."financial_data" to "service_role";

grant references on table "public"."financial_data" to "service_role";

grant select on table "public"."financial_data" to "service_role";

grant trigger on table "public"."financial_data" to "service_role";

grant truncate on table "public"."financial_data" to "service_role";

grant update on table "public"."financial_data" to "service_role";

grant delete on table "public"."payment_sessions" to "anon";

grant insert on table "public"."payment_sessions" to "anon";

grant references on table "public"."payment_sessions" to "anon";

grant select on table "public"."payment_sessions" to "anon";

grant trigger on table "public"."payment_sessions" to "anon";

grant truncate on table "public"."payment_sessions" to "anon";

grant update on table "public"."payment_sessions" to "anon";

grant delete on table "public"."payment_sessions" to "authenticated";

grant insert on table "public"."payment_sessions" to "authenticated";

grant references on table "public"."payment_sessions" to "authenticated";

grant select on table "public"."payment_sessions" to "authenticated";

grant trigger on table "public"."payment_sessions" to "authenticated";

grant truncate on table "public"."payment_sessions" to "authenticated";

grant update on table "public"."payment_sessions" to "authenticated";

grant delete on table "public"."payment_sessions" to "service_role";

grant insert on table "public"."payment_sessions" to "service_role";

grant references on table "public"."payment_sessions" to "service_role";

grant select on table "public"."payment_sessions" to "service_role";

grant trigger on table "public"."payment_sessions" to "service_role";

grant truncate on table "public"."payment_sessions" to "service_role";

grant update on table "public"."payment_sessions" to "service_role";

grant delete on table "public"."premium_codes" to "anon";

grant insert on table "public"."premium_codes" to "anon";

grant references on table "public"."premium_codes" to "anon";

grant select on table "public"."premium_codes" to "anon";

grant trigger on table "public"."premium_codes" to "anon";

grant truncate on table "public"."premium_codes" to "anon";

grant update on table "public"."premium_codes" to "anon";

grant delete on table "public"."premium_codes" to "authenticated";

grant insert on table "public"."premium_codes" to "authenticated";

grant references on table "public"."premium_codes" to "authenticated";

grant select on table "public"."premium_codes" to "authenticated";

grant trigger on table "public"."premium_codes" to "authenticated";

grant truncate on table "public"."premium_codes" to "authenticated";

grant update on table "public"."premium_codes" to "authenticated";

grant delete on table "public"."premium_codes" to "service_role";

grant insert on table "public"."premium_codes" to "service_role";

grant references on table "public"."premium_codes" to "service_role";

grant select on table "public"."premium_codes" to "service_role";

grant trigger on table "public"."premium_codes" to "service_role";

grant truncate on table "public"."premium_codes" to "service_role";

grant update on table "public"."premium_codes" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."user_backups" to "anon";

grant insert on table "public"."user_backups" to "anon";

grant references on table "public"."user_backups" to "anon";

grant select on table "public"."user_backups" to "anon";

grant trigger on table "public"."user_backups" to "anon";

grant truncate on table "public"."user_backups" to "anon";

grant update on table "public"."user_backups" to "anon";

grant delete on table "public"."user_backups" to "authenticated";

grant insert on table "public"."user_backups" to "authenticated";

grant references on table "public"."user_backups" to "authenticated";

grant select on table "public"."user_backups" to "authenticated";

grant trigger on table "public"."user_backups" to "authenticated";

grant truncate on table "public"."user_backups" to "authenticated";

grant update on table "public"."user_backups" to "authenticated";

grant delete on table "public"."user_backups" to "service_role";

grant insert on table "public"."user_backups" to "service_role";

grant references on table "public"."user_backups" to "service_role";

grant select on table "public"."user_backups" to "service_role";

grant trigger on table "public"."user_backups" to "service_role";

grant truncate on table "public"."user_backups" to "service_role";

grant update on table "public"."user_backups" to "service_role";

grant delete on table "public"."user_points" to "anon";

grant insert on table "public"."user_points" to "anon";

grant references on table "public"."user_points" to "anon";

grant select on table "public"."user_points" to "anon";

grant trigger on table "public"."user_points" to "anon";

grant truncate on table "public"."user_points" to "anon";

grant update on table "public"."user_points" to "anon";

grant delete on table "public"."user_points" to "authenticated";

grant insert on table "public"."user_points" to "authenticated";

grant references on table "public"."user_points" to "authenticated";

grant select on table "public"."user_points" to "authenticated";

grant trigger on table "public"."user_points" to "authenticated";

grant truncate on table "public"."user_points" to "authenticated";

grant update on table "public"."user_points" to "authenticated";

grant delete on table "public"."user_points" to "service_role";

grant insert on table "public"."user_points" to "service_role";

grant references on table "public"."user_points" to "service_role";

grant select on table "public"."user_points" to "service_role";

grant trigger on table "public"."user_points" to "service_role";

grant truncate on table "public"."user_points" to "service_role";

grant update on table "public"."user_points" to "service_role";

grant delete on table "public"."user_premium_status" to "anon";

grant insert on table "public"."user_premium_status" to "anon";

grant references on table "public"."user_premium_status" to "anon";

grant select on table "public"."user_premium_status" to "anon";

grant trigger on table "public"."user_premium_status" to "anon";

grant truncate on table "public"."user_premium_status" to "anon";

grant update on table "public"."user_premium_status" to "anon";

grant delete on table "public"."user_premium_status" to "authenticated";

grant insert on table "public"."user_premium_status" to "authenticated";

grant references on table "public"."user_premium_status" to "authenticated";

grant select on table "public"."user_premium_status" to "authenticated";

grant trigger on table "public"."user_premium_status" to "authenticated";

grant truncate on table "public"."user_premium_status" to "authenticated";

grant update on table "public"."user_premium_status" to "authenticated";

grant delete on table "public"."user_premium_status" to "service_role";

grant insert on table "public"."user_premium_status" to "service_role";

grant references on table "public"."user_premium_status" to "service_role";

grant select on table "public"."user_premium_status" to "service_role";

grant trigger on table "public"."user_premium_status" to "service_role";

grant truncate on table "public"."user_premium_status" to "service_role";

grant update on table "public"."user_premium_status" to "service_role";

create policy "Admins can insert audit logs"
on "public"."admin_audit_log"
as permissive
for insert
to public
with check ((admin_user_id = auth.uid()));


create policy "Admins can read their own audit logs"
on "public"."admin_audit_log"
as permissive
for select
to public
using ((admin_user_id = auth.uid()));


create policy "Service role can manage CMS settings"
on "public"."cms_settings"
as permissive
for all
to public
using ((auth.role() = 'service_role'::text));


create policy "Users can delete their own financial data"
on "public"."financial_data"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own financial data"
on "public"."financial_data"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own financial data"
on "public"."financial_data"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own financial data"
on "public"."financial_data"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Admin can manage all payment sessions"
on "public"."payment_sessions"
as permissive
for all
to public
using (true);


create policy "System can update payment sessions"
on "public"."payment_sessions"
as permissive
for update
to public
using (true);


create policy "Users can create their own payment sessions"
on "public"."payment_sessions"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can view their own payment sessions"
on "public"."payment_sessions"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "admin_users_can_manage_codes"
on "public"."premium_codes"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.admin_role = true)))))
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.admin_role = true)))));


create policy "anon_can_view_unused_codes"
on "public"."premium_codes"
as permissive
for select
to anon
using (((NOT is_used) AND (is_active = true)));


create policy "authenticated_users_can_activate_codes"
on "public"."premium_codes"
as permissive
for update
to authenticated
using (((NOT is_used) AND (is_active = true)))
with check ((used_by = auth.uid()));


create policy "authenticated_users_can_view_unused_codes"
on "public"."premium_codes"
as permissive
for select
to authenticated
using (((NOT is_used) AND (is_active = true)));


create policy "service_role_can_manage_all_codes"
on "public"."premium_codes"
as permissive
for all
to service_role
using (true)
with check (true);


create policy "Users can insert their own profile"
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update their own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can view their own profile"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Users can create their own backups"
on "public"."user_backups"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can delete their own backups"
on "public"."user_backups"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can update their own backups"
on "public"."user_backups"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Users can view their own backups"
on "public"."user_backups"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Admin can add points to users"
on "public"."user_points"
as permissive
for insert
to public
with check ((((auth.jwt() ->> 'email'::text) ~~ '%@admin.%'::text) OR ((auth.jwt() ->> 'email'::text) = ANY (ARRAY['admin@numoraq.com'::text, 'admin@admin.com'::text])) OR (EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.user_uid ~~ 'admin_%'::text))))));


create policy "Admin can view all points"
on "public"."user_points"
as permissive
for select
to public
using (((auth.uid() = user_id) OR ((auth.jwt() ->> 'email'::text) ~~ '%@admin.%'::text) OR ((auth.jwt() ->> 'email'::text) = ANY (ARRAY['admin@numoraq.com'::text, 'admin@admin.com'::text])) OR (EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.user_uid ~~ 'admin_%'::text))))));


create policy "Authenticated users can add manual points"
on "public"."user_points"
as permissive
for insert
to public
with check (((auth.role() = 'authenticated'::text) AND (activity_type = 'manual'::text)));


create policy "Service role can manage all points"
on "public"."user_points"
as permissive
for all
to public
using ((auth.role() = 'service_role'::text));


create policy "System can manage user points"
on "public"."user_points"
as permissive
for all
to public
using ((auth.role() = 'service_role'::text));


create policy "Users can update their own points"
on "public"."user_points"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own points"
on "public"."user_points"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Service role can manage all premium status"
on "public"."user_premium_status"
as permissive
for all
to public
using ((auth.role() = 'service_role'::text));


create policy "Users can update their own premium status"
on "public"."user_premium_status"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own premium status"
on "public"."user_premium_status"
as permissive
for select
to public
using ((auth.uid() = user_id));


CREATE TRIGGER trigger_update_payment_sessions_updated_at BEFORE UPDATE ON public.payment_sessions FOR EACH ROW EXECUTE FUNCTION update_payment_sessions_updated_at();


