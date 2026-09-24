import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_customers_loyalty_tier" AS ENUM('silver', 'gold', 'platinum');
  CREATE TYPE "public"."enum_cars_services" AS ENUM('chauffeur', 'selfdrive', 'airport');
  CREATE TYPE "public"."enum_cars_category" AS ENUM('sedan', 'suv', 'sports', 'mpv', 'bus', 'convertible', 'wedding');
  CREATE TYPE "public"."enum_cars_transmission" AS ENUM('Automatic', 'Manual');
  CREATE TYPE "public"."enum_cars_fuel" AS ENUM('Petrol', 'Diesel', 'Hybrid', 'Electric');
  CREATE TYPE "public"."enum_bookings_service_type" AS ENUM('chauffeur', 'selfdrive', 'airport');
  CREATE TYPE "public"."enum_bookings_status" AS ENUM('pending', 'confirmed', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_coupons_discount_type" AS ENUM('percentage', 'fixed');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'admin' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"name" varchar,
  	"phone" varchar,
  	"home_address" varchar,
  	"office_address" varchar,
  	"airport_address" varchar,
  	"loyalty_points" numeric DEFAULT 0,
  	"loyalty_tier" "enum_customers_loyalty_tier" DEFAULT 'silver',
  	"completed_bookings" numeric DEFAULT 0,
  	"total_spent" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "cars_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"src" varchar NOT NULL
  );
  
  CREATE TABLE "cars_services" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_cars_services",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cars" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"brand" varchar DEFAULT 'Luxury' NOT NULL,
  	"category" "enum_cars_category" DEFAULT 'sedan' NOT NULL,
  	"price_per_day" numeric NOT NULL,
  	"image_id" integer,
  	"image_src" varchar,
  	"transmission" "enum_cars_transmission" DEFAULT 'Automatic',
  	"fuel" "enum_cars_fuel" DEFAULT 'Petrol',
  	"seats" numeric DEFAULT 5,
  	"description" varchar,
  	"rating" numeric DEFAULT 0,
  	"reviews_count" numeric DEFAULT 0,
  	"bookings_count" numeric DEFAULT 0,
  	"specs_boot_space" varchar DEFAULT '450L',
  	"specs_ac_zones" varchar DEFAULT '4-Zone Climate Control',
  	"specs_year" varchar DEFAULT '2024',
  	"specs_odometer" varchar DEFAULT '15,000 km',
  	"km_allowance" varchar DEFAULT '100 km/day included.',
  	"security_deposit" varchar DEFAULT '₹25,000',
  	"cancellation_policy" varchar DEFAULT 'Free cancellation up to 48 hours before pickup.',
  	"sort_order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blogs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"cover_image_id" integer,
  	"cover_image_src" varchar,
  	"author" varchar DEFAULT 'DriveIt Editorial',
  	"published_date" timestamp(3) with time zone,
  	"category" varchar DEFAULT 'Luxury Travel',
  	"read_time_minutes" numeric DEFAULT 5,
  	"content" jsonb,
  	"is_published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"short_description" varchar NOT NULL,
  	"full_description" jsonb,
  	"price" varchar,
  	"icon" varchar,
  	"image_id" integer,
  	"image_src" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"is_published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author" varchar NOT NULL,
  	"role" varchar DEFAULT 'Verified Client',
  	"company" varchar,
  	"content" varchar NOT NULL,
  	"rating" numeric DEFAULT 5,
  	"avatar_src" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"is_published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_name" varchar NOT NULL,
  	"customer_email" varchar NOT NULL,
  	"customer_phone" varchar NOT NULL,
  	"car_name" varchar NOT NULL,
  	"car_slug" varchar,
  	"pickup_location" varchar,
  	"dropoff_location" varchar,
  	"total_price" numeric NOT NULL,
  	"service_type" "enum_bookings_service_type" DEFAULT 'chauffeur',
  	"status" "enum_bookings_status" DEFAULT 'pending',
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"days" numeric DEFAULT 1,
  	"addons" varchar,
  	"coupon_code" varchar,
  	"discount_applied" numeric DEFAULT 0,
  	"hold_expires_at" timestamp(3) with time zone,
  	"hold_token" varchar,
  	"upi_transaction_id" varchar,
  	"whatsapp_number" varchar,
  	"notes" varchar,
  	"loyalty_reward_issued_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "wishlists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_email" varchar NOT NULL,
  	"car_slug" varchar NOT NULL,
  	"car_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "coupons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"discount_type" "enum_coupons_discount_type" DEFAULT 'percentage' NOT NULL,
  	"discount_value" numeric NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"valid_until" timestamp(3) with time zone,
  	"usage_limit" numeric DEFAULT 1,
  	"usage_count" numeric DEFAULT 0,
  	"customer_email" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"customers_id" integer,
  	"media_id" integer,
  	"cars_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"testimonials_id" integer,
  	"bookings_id" integer,
  	"wishlists_id" integer,
  	"coupons_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" numeric NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "site_settings_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'DriveIt Luxury Transportation',
  	"contact_phone" varchar DEFAULT '+91 98765 43210',
  	"contact_email" varchar DEFAULT 'concierge@driveitluxury.com',
  	"whatsapp_number" varchar DEFAULT '+919876543210',
  	"header_logo_id" integer,
  	"header_video_url" varchar,
  	"footer_logo_id" integer,
  	"footer_description" varchar DEFAULT 'Premium luxury car rental and chauffeur services in Hyderabad. Experience unmatched comfort, elegance, and reliability.',
  	"instagram_url" varchar DEFAULT 'https://instagram.com/driveitluxury',
  	"facebook_url" varchar DEFAULT 'https://facebook.com/driveitluxury',
  	"youtube_url" varchar DEFAULT 'https://youtube.com/@driveitluxury',
  	"address" varchar DEFAULT 'Banjara Hills, Hyderabad, Telangana 500034',
  	"map_embed_url" varchar,
  	"map_link" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cars_gallery" ADD CONSTRAINT "cars_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cars_services" ADD CONSTRAINT "cars_services_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cars" ADD CONSTRAINT "cars_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cars_fk" FOREIGN KEY ("cars_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bookings_fk" FOREIGN KEY ("bookings_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wishlists_fk" FOREIGN KEY ("wishlists_id") REFERENCES "public"."wishlists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_coupons_fk" FOREIGN KEY ("coupons_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_stats" ADD CONSTRAINT "site_settings_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_faqs" ADD CONSTRAINT "site_settings_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_header_logo_id_media_id_fk" FOREIGN KEY ("header_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_footer_logo_id_media_id_fk" FOREIGN KEY ("footer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "customers_email_idx" ON "customers" USING btree ("email");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "cars_gallery_order_idx" ON "cars_gallery" USING btree ("_order");
  CREATE INDEX "cars_gallery_parent_id_idx" ON "cars_gallery" USING btree ("_parent_id");
  CREATE INDEX "cars_services_order_idx" ON "cars_services" USING btree ("order");
  CREATE INDEX "cars_services_parent_idx" ON "cars_services" USING btree ("parent_id");
  CREATE INDEX "cars_name_idx" ON "cars" USING btree ("name");
  CREATE UNIQUE INDEX "cars_slug_idx" ON "cars" USING btree ("slug");
  CREATE INDEX "cars_category_idx" ON "cars" USING btree ("category");
  CREATE INDEX "cars_image_idx" ON "cars" USING btree ("image_id");
  CREATE INDEX "cars_is_active_idx" ON "cars" USING btree ("is_active");
  CREATE INDEX "cars_updated_at_idx" ON "cars" USING btree ("updated_at");
  CREATE INDEX "cars_created_at_idx" ON "cars" USING btree ("created_at");
  CREATE INDEX "blogs_title_idx" ON "blogs" USING btree ("title");
  CREATE UNIQUE INDEX "blogs_slug_idx" ON "blogs" USING btree ("slug");
  CREATE INDEX "blogs_cover_image_idx" ON "blogs" USING btree ("cover_image_id");
  CREATE INDEX "blogs_is_published_idx" ON "blogs" USING btree ("is_published");
  CREATE INDEX "blogs_updated_at_idx" ON "blogs" USING btree ("updated_at");
  CREATE INDEX "blogs_created_at_idx" ON "blogs" USING btree ("created_at");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_image_idx" ON "services" USING btree ("image_id");
  CREATE INDEX "services_is_published_idx" ON "services" USING btree ("is_published");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "testimonials_is_published_idx" ON "testimonials" USING btree ("is_published");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "bookings_customer_email_idx" ON "bookings" USING btree ("customer_email");
  CREATE INDEX "bookings_car_slug_idx" ON "bookings" USING btree ("car_slug");
  CREATE INDEX "bookings_service_type_idx" ON "bookings" USING btree ("service_type");
  CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");
  CREATE INDEX "bookings_start_date_idx" ON "bookings" USING btree ("start_date");
  CREATE INDEX "bookings_hold_token_idx" ON "bookings" USING btree ("hold_token");
  CREATE INDEX "bookings_updated_at_idx" ON "bookings" USING btree ("updated_at");
  CREATE INDEX "bookings_created_at_idx" ON "bookings" USING btree ("created_at");
  CREATE INDEX "wishlists_user_email_idx" ON "wishlists" USING btree ("user_email");
  CREATE INDEX "wishlists_car_slug_idx" ON "wishlists" USING btree ("car_slug");
  CREATE INDEX "wishlists_updated_at_idx" ON "wishlists" USING btree ("updated_at");
  CREATE INDEX "wishlists_created_at_idx" ON "wishlists" USING btree ("created_at");
  CREATE UNIQUE INDEX "coupons_code_idx" ON "coupons" USING btree ("code");
  CREATE INDEX "coupons_is_active_idx" ON "coupons" USING btree ("is_active");
  CREATE INDEX "coupons_customer_email_idx" ON "coupons" USING btree ("customer_email");
  CREATE INDEX "coupons_updated_at_idx" ON "coupons" USING btree ("updated_at");
  CREATE INDEX "coupons_created_at_idx" ON "coupons" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_cars_id_idx" ON "payload_locked_documents_rels" USING btree ("cars_id");
  CREATE INDEX "payload_locked_documents_rels_blogs_id_idx" ON "payload_locked_documents_rels" USING btree ("blogs_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("bookings_id");
  CREATE INDEX "payload_locked_documents_rels_wishlists_id_idx" ON "payload_locked_documents_rels" USING btree ("wishlists_id");
  CREATE INDEX "payload_locked_documents_rels_coupons_id_idx" ON "payload_locked_documents_rels" USING btree ("coupons_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_stats_order_idx" ON "site_settings_stats" USING btree ("_order");
  CREATE INDEX "site_settings_stats_parent_id_idx" ON "site_settings_stats" USING btree ("_parent_id");
  CREATE INDEX "site_settings_faqs_order_idx" ON "site_settings_faqs" USING btree ("_order");
  CREATE INDEX "site_settings_faqs_parent_id_idx" ON "site_settings_faqs" USING btree ("_parent_id");
  CREATE INDEX "site_settings_header_logo_idx" ON "site_settings" USING btree ("header_logo_id");
  CREATE INDEX "site_settings_footer_logo_idx" ON "site_settings" USING btree ("footer_logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "cars_gallery" CASCADE;
  DROP TABLE "cars_services" CASCADE;
  DROP TABLE "cars" CASCADE;
  DROP TABLE "blogs" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "bookings" CASCADE;
  DROP TABLE "wishlists" CASCADE;
  DROP TABLE "coupons" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_stats" CASCADE;
  DROP TABLE "site_settings_faqs" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_customers_loyalty_tier";
  DROP TYPE "public"."enum_cars_services";
  DROP TYPE "public"."enum_cars_category";
  DROP TYPE "public"."enum_cars_transmission";
  DROP TYPE "public"."enum_cars_fuel";
  DROP TYPE "public"."enum_bookings_service_type";
  DROP TYPE "public"."enum_bookings_status";
  DROP TYPE "public"."enum_coupons_discount_type";`)
}
