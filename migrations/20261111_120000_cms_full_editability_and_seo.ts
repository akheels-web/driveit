import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_cars_engine_audio_profile" AS ENUM(
        'v12-whisper',
        'v8-twinturbo',
        'v8-hybrid',
        'v8-amg',
        'v10-screamer'
      );
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_site_settings_protocols_service_mode" AS ENUM(
        'chauffeur',
        'selfdrive'
      );
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "cars_studio_hotspots" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "spec_badge" varchar,
      "detail" varchar,
      "x" numeric DEFAULT 50,
      "y" numeric DEFAULT 50
    );

    CREATE TABLE IF NOT EXISTS "services_showcase_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "badge_label" varchar,
      "model" varchar NOT NULL,
      "specs" varchar,
      "highlight_tag" varchar,
      "image_id" integer,
      "image_src" varchar,
      "image_alt" varchar,
      "cta_label" varchar
    );

    CREATE TABLE IF NOT EXISTS "site_settings_hero_scenes" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "tab_label" varchar,
      "kicker" varchar,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "badge" varchar,
      "image_id" integer,
      "src" varchar,
      "image_alt" varchar,
      "cta_label" varchar,
      "cta_href" varchar
    );

    CREATE TABLE IF NOT EXISTS "site_settings_pickup_hubs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "zone_tag" varchar,
      "active" boolean DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS "site_settings_beyond_panels" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "key" varchar NOT NULL,
      "number" varchar,
      "eyebrow" varchar,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "capacity" varchar,
      "highlights_text" varchar,
      "image_id" integer,
      "src" varchar,
      "image_alt" varchar,
      "href" varchar,
      "service_name" varchar,
      "cta_label" varchar,
      "direct_book" boolean DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS "site_settings_protocols" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "protocol_id" varchar NOT NULL,
      "tag" varchar,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "description" varchar,
      "flagship_slug" varchar,
      "flagship_name" varchar,
      "tariff_formatted" varchar,
      "service_mode" "enum_site_settings_protocols_service_mode" DEFAULT 'chauffeur',
      "pickup_hub" varchar,
      "banner_image_id" integer,
      "banner_image_src" varchar,
      "banner_image_alt" varchar,
      "highlights_text" varchar,
      "flight_sync_supported" boolean DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS "site_settings_vip_corridors" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "corridor_id" varchar NOT NULL,
      "tag" varchar,
      "origin" varchar NOT NULL,
      "destination" varchar NOT NULL,
      "distance_km" varchar,
      "eta_minutes" varchar,
      "from_x" numeric DEFAULT 240,
      "from_y" numeric DEFAULT 318,
      "to_x" numeric DEFAULT 430,
      "to_y" numeric DEFAULT 240,
      "ctrl_x" numeric DEFAULT 350,
      "ctrl_y" numeric DEFAULT 300,
      "recommended_car_slug" varchar,
      "recommended_car_name" varchar,
      "price_formatted" varchar
    );

    ALTER TABLE "cars" ADD COLUMN IF NOT EXISTS "image_alt" varchar;
    ALTER TABLE "cars" ADD COLUMN IF NOT EXISTS "featured_in_studio_stage" boolean DEFAULT false;
    ALTER TABLE "cars" ADD COLUMN IF NOT EXISTS "tagline" varchar;
    ALTER TABLE "cars" ADD COLUMN IF NOT EXISTS "power_hp" numeric;
    ALTER TABLE "cars" ADD COLUMN IF NOT EXISTS "zero_to_hundred" varchar;
    ALTER TABLE "cars" ADD COLUMN IF NOT EXISTS "top_speed" varchar;
    ALTER TABLE "cars" ADD COLUMN IF NOT EXISTS "acoustic_note" varchar;
    ALTER TABLE "cars" ADD COLUMN IF NOT EXISTS "engine_audio_profile" "enum_cars_engine_audio_profile" DEFAULT 'v12-whisper';
    ALTER TABLE "cars_gallery" ADD COLUMN IF NOT EXISTS "alt" varchar;

    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "image_alt" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "hero_subtitle" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "hero_cta_label" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "seo_title" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "seo_description" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "seo_keywords" varchar;

    ALTER TABLE "blogs" ADD COLUMN IF NOT EXISTS "cover_image_alt" varchar;
    ALTER TABLE "blogs" ADD COLUMN IF NOT EXISTS "seo_title" varchar;
    ALTER TABLE "blogs" ADD COLUMN IF NOT EXISTS "seo_description" varchar;

    ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "avatar_id" integer;
    ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "avatar_alt" varchar;

    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "header_logo_alt" varchar DEFAULT 'DRIVEIT Luxury Chauffeur & Supercar Rental Logo';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "footer_logo_alt" varchar DEFAULT 'DRIVEIT Luxury Mobility Hyderabad Logo';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "hero_image_alt" varchar DEFAULT 'DRIVEIT Luxury flagship fleet parked at night in Hyderabad';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "mission_image_alt" varchar DEFAULT 'DRIVEIT Luxury black studio showroom vehicles in Banjara Hills Hyderabad';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_keywords" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "google_site_verification" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "llms_summary_intro" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "allow_ai_crawlers" boolean DEFAULT true;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "extra_robots_disallow" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "studio_stage_eyebrow" varchar DEFAULT '01 / INTERACTIVE GARAGE STAGE';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "studio_stage_title" varchar DEFAULT 'Inspect Flagship Specs';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fleet_section_eyebrow" varchar DEFAULT '02 / CURATED HYDERABAD FLEET';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fleet_section_title" varchar DEFAULT 'The Garage Collection';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fleet_section_subtitle" varchar DEFAULT 'Toggle chauffeur or self-drive privilege and compare up to 3 flagships side-by-side.';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "beyond_eyebrow" varchar DEFAULT '02B / DRIVEIT PRIVÉ COLLECTION';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "beyond_title" varchar DEFAULT 'Beyond The Boulevard';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "beyond_subtitle" varchar DEFAULT 'Private jet tarmac access, bespoke marine vessels, wedding convoys & executive lounges.';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "protocol_eyebrow" varchar DEFAULT '03 / CURATED PROTOCOLS · HYDERABAD';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "protocol_title" varchar DEFAULT 'Signature Mobility Protocols';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "protocol_subtitle" varchar DEFAULT 'Whether stepping onto the private tarmac at RGIA or making a grand entrance at Taj Falaknuma, explore white-glove itineraries engineered for absolute distinction.';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "radar_eyebrow" varchar DEFAULT '03 / LIVE TELEMETRY · HYDERABAD VVIP CORRIDORS';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "radar_title" varchar DEFAULT 'Flight-Sync & Route Radar';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "radar_sector_label" varchar DEFAULT 'HYDERABAD METROPOLITAN SECTOR · 17.3850° N, 78.4867° E';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "radar_delay_badge" varchar DEFAULT '60-MIN FLIGHT DELAY BUFFER INCLUDED';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "radar_default_flight_code" varchar DEFAULT 'EK-526';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "closing_eyebrow" varchar DEFAULT '04 / WHITE-GLOVE DISPATCH · BANJARA HILLS';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "closing_title" varchar DEFAULT 'Command The Road On Your Terms';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "closing_description" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "closing_banner_image_id" integer;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "closing_banner_image_src" varchar DEFAULT '/black-chauffeur-sedan-night-city.webp';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "closing_banner_image_alt" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "closing_cta_label" varchar DEFAULT 'Explore Complete Fleet';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "closing_pass_label" varchar DEFAULT 'INVITATION PROTOCOL';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "closing_pass_title" varchar DEFAULT 'DRIVEIT PRIVÉ PASS';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "closing_pass_benefits_text" varchar;

    DO $$ BEGIN
      ALTER TABLE "cars_studio_hotspots" ADD CONSTRAINT "cars_studio_hotspots_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "services_showcase_items" ADD CONSTRAINT "services_showcase_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "services_showcase_items" ADD CONSTRAINT "services_showcase_items_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_avatar_id_media_id_fk"
        FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_closing_banner_image_id_media_id_fk"
        FOREIGN KEY ("closing_banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings_hero_scenes" ADD CONSTRAINT "site_settings_hero_scenes_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings_hero_scenes" ADD CONSTRAINT "site_settings_hero_scenes_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings_pickup_hubs" ADD CONSTRAINT "site_settings_pickup_hubs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings_beyond_panels" ADD CONSTRAINT "site_settings_beyond_panels_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings_beyond_panels" ADD CONSTRAINT "site_settings_beyond_panels_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings_protocols" ADD CONSTRAINT "site_settings_protocols_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings_protocols" ADD CONSTRAINT "site_settings_protocols_banner_image_id_media_id_fk"
        FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings_vip_corridors" ADD CONSTRAINT "site_settings_vip_corridors_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "cars_studio_hotspots_order_idx" ON "cars_studio_hotspots" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "cars_studio_hotspots_parent_id_idx" ON "cars_studio_hotspots" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "services_showcase_items_order_idx" ON "services_showcase_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "services_showcase_items_parent_id_idx" ON "services_showcase_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "services_showcase_items_image_idx" ON "services_showcase_items" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "testimonials_avatar_idx" ON "testimonials" USING btree ("avatar_id");
    CREATE INDEX IF NOT EXISTS "site_settings_closing_banner_image_idx" ON "site_settings" USING btree ("closing_banner_image_id");
    CREATE INDEX IF NOT EXISTS "site_settings_hero_scenes_order_idx" ON "site_settings_hero_scenes" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_hero_scenes_parent_id_idx" ON "site_settings_hero_scenes" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_hero_scenes_image_idx" ON "site_settings_hero_scenes" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "site_settings_pickup_hubs_order_idx" ON "site_settings_pickup_hubs" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_pickup_hubs_parent_id_idx" ON "site_settings_pickup_hubs" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_beyond_panels_order_idx" ON "site_settings_beyond_panels" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_beyond_panels_parent_id_idx" ON "site_settings_beyond_panels" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_beyond_panels_image_idx" ON "site_settings_beyond_panels" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "site_settings_protocols_order_idx" ON "site_settings_protocols" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_protocols_parent_id_idx" ON "site_settings_protocols" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_protocols_banner_image_idx" ON "site_settings_protocols" USING btree ("banner_image_id");
    CREATE INDEX IF NOT EXISTS "site_settings_vip_corridors_order_idx" ON "site_settings_vip_corridors" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_vip_corridors_parent_id_idx" ON "site_settings_vip_corridors" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_settings_vip_corridors" CASCADE;
    DROP TABLE IF EXISTS "site_settings_protocols" CASCADE;
    DROP TABLE IF EXISTS "site_settings_beyond_panels" CASCADE;
    DROP TABLE IF EXISTS "site_settings_pickup_hubs" CASCADE;
    DROP TABLE IF EXISTS "site_settings_hero_scenes" CASCADE;
    DROP TABLE IF EXISTS "services_showcase_items" CASCADE;
    DROP TABLE IF EXISTS "cars_studio_hotspots" CASCADE;

    ALTER TABLE "cars" DROP COLUMN IF EXISTS "image_alt";
    ALTER TABLE "cars" DROP COLUMN IF EXISTS "featured_in_studio_stage";
    ALTER TABLE "cars" DROP COLUMN IF EXISTS "tagline";
    ALTER TABLE "cars" DROP COLUMN IF EXISTS "power_hp";
    ALTER TABLE "cars" DROP COLUMN IF EXISTS "zero_to_hundred";
    ALTER TABLE "cars" DROP COLUMN IF EXISTS "top_speed";
    ALTER TABLE "cars" DROP COLUMN IF EXISTS "acoustic_note";
    ALTER TABLE "cars" DROP COLUMN IF EXISTS "engine_audio_profile";
    ALTER TABLE "cars_gallery" DROP COLUMN IF EXISTS "alt";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "image_alt";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "hero_subtitle";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "hero_cta_label";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "seo_title";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "seo_description";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "seo_keywords";
    ALTER TABLE "blogs" DROP COLUMN IF EXISTS "cover_image_alt";
    ALTER TABLE "blogs" DROP COLUMN IF EXISTS "seo_title";
    ALTER TABLE "blogs" DROP COLUMN IF EXISTS "seo_description";
    ALTER TABLE "testimonials" DROP COLUMN IF EXISTS "avatar_id";
    ALTER TABLE "testimonials" DROP COLUMN IF EXISTS "avatar_alt";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_logo_alt";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "footer_logo_alt";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "hero_image_alt";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "mission_image_alt";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_keywords";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "google_site_verification";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "llms_summary_intro";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "allow_ai_crawlers";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "extra_robots_disallow";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "studio_stage_eyebrow";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "studio_stage_title";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fleet_section_eyebrow";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fleet_section_title";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fleet_section_subtitle";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "beyond_eyebrow";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "beyond_title";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "beyond_subtitle";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "protocol_eyebrow";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "protocol_title";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "protocol_subtitle";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "radar_eyebrow";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "radar_title";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "radar_sector_label";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "radar_delay_badge";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "radar_default_flight_code";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "closing_eyebrow";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "closing_title";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "closing_description";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "closing_banner_image_id";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "closing_banner_image_src";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "closing_banner_image_alt";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "closing_cta_label";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "closing_pass_label";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "closing_pass_title";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "closing_pass_benefits_text";

    DROP TYPE IF EXISTS "public"."enum_site_settings_protocols_service_mode";
    DROP TYPE IF EXISTS "public"."enum_cars_engine_audio_profile";
  `)
}

