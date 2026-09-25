import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_customers_kyc_status" AS ENUM('unverified', 'pending', 'verified', 'rejected');
  CREATE TYPE "public"."enum_cars_current_telemetry_geofence_status" AS ENUM('inside_hyderabad', 'outstation_zone', 'geofence_breach');
  CREATE TYPE "public"."enum_bookings_security_deposit_status" AS ENUM('na', 'held', 'inspection_passed', 'refunded', 'deducted');
  CREATE TYPE "public"."enum_partner_applications_status" AS ENUM('pending_inspection', 'inspection_scheduled', 'approved', 'declined');
  CREATE TABLE "bookings_telematics_telemetry_alerts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"alert" varchar
  );
  
  CREATE TABLE "partner_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"owner_name" varchar NOT NULL,
  	"owner_email" varchar NOT NULL,
  	"owner_phone" varchar NOT NULL,
  	"city" varchar DEFAULT 'Hyderabad' NOT NULL,
  	"vehicle_name" varchar NOT NULL,
  	"manufacturing_year" numeric NOT NULL,
  	"registration_number" varchar NOT NULL,
  	"odometer_km" numeric,
  	"expected_monthly_revenue" varchar,
  	"status" "enum_partner_applications_status" DEFAULT 'pending_inspection',
  	"admin_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "cars_gallery" ALTER COLUMN "src" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "contact_phone" SET DEFAULT '+91 63000 41186';
  ALTER TABLE "site_settings" ALTER COLUMN "whatsapp_number" SET DEFAULT '+916300041186';
  ALTER TABLE "customers" ADD COLUMN "gstin" varchar;
  ALTER TABLE "customers" ADD COLUMN "company_name" varchar;
  ALTER TABLE "customers" ADD COLUMN "kyc_status" "enum_customers_kyc_status" DEFAULT 'unverified';
  ALTER TABLE "customers" ADD COLUMN "driving_license_number" varchar;
  ALTER TABLE "customers" ADD COLUMN "driving_license_front_id" integer;
  ALTER TABLE "customers" ADD COLUMN "driving_license_back_id" integer;
  ALTER TABLE "customers" ADD COLUMN "aadhaar_last4" varchar;
  ALTER TABLE "customers" ADD COLUMN "id_proof_document_id" integer;
  ALTER TABLE "customers" ADD COLUMN "kyc_verified_at" timestamp(3) with time zone;
  ALTER TABLE "customers" ADD COLUMN "kyc_rejection_reason" varchar;
  ALTER TABLE "cars_gallery" ADD COLUMN "image_id" integer;
  ALTER TABLE "cars" ADD COLUMN "security_deposit_amount" numeric DEFAULT 25000;
  ALTER TABLE "cars" ADD COLUMN "fuel_policy" varchar DEFAULT 'Full-to-Full (Return full tank, pay ₹0 fuel fee)';
  ALTER TABLE "cars" ADD COLUMN "fast_tag_equipped" boolean DEFAULT true;
  ALTER TABLE "cars" ADD COLUMN "gps_device_id" varchar;
  ALTER TABLE "cars" ADD COLUMN "current_odometer_km" numeric DEFAULT 15000;
  ALTER TABLE "cars" ADD COLUMN "extra_km_rate" numeric DEFAULT 75;
  ALTER TABLE "cars" ADD COLUMN "current_telemetry_latitude" numeric;
  ALTER TABLE "cars" ADD COLUMN "current_telemetry_longitude" numeric;
  ALTER TABLE "cars" ADD COLUMN "current_telemetry_speed_km_h" numeric;
  ALTER TABLE "cars" ADD COLUMN "current_telemetry_ignition" boolean;
  ALTER TABLE "cars" ADD COLUMN "current_telemetry_battery_voltage" numeric;
  ALTER TABLE "cars" ADD COLUMN "current_telemetry_last_ping_at" timestamp(3) with time zone;
  ALTER TABLE "cars" ADD COLUMN "current_telemetry_geofence_status" "enum_cars_current_telemetry_geofence_status" DEFAULT 'inside_hyderabad';
  ALTER TABLE "cars" ADD COLUMN "current_telemetry_last_alert" varchar;
  ALTER TABLE "bookings" ADD COLUMN "flight_number" varchar;
  ALTER TABLE "bookings" ADD COLUMN "airport_terminal" varchar;
  ALTER TABLE "bookings" ADD COLUMN "gstin" varchar;
  ALTER TABLE "bookings" ADD COLUMN "company_name" varchar;
  ALTER TABLE "bookings" ADD COLUMN "security_deposit_amount" numeric DEFAULT 0;
  ALTER TABLE "bookings" ADD COLUMN "security_deposit_status" "enum_bookings_security_deposit_status" DEFAULT 'na';
  ALTER TABLE "bookings" ADD COLUMN "deposit_refund_utr" varchar;
  ALTER TABLE "bookings" ADD COLUMN "deposit_refund_deduction_reason" varchar;
  ALTER TABLE "bookings" ADD COLUMN "deposit_refunded_at" timestamp(3) with time zone;
  ALTER TABLE "bookings" ADD COLUMN "telematics_start_odometer_km" numeric;
  ALTER TABLE "bookings" ADD COLUMN "telematics_end_odometer_km" numeric;
  ALTER TABLE "bookings" ADD COLUMN "telematics_total_km_driven" numeric;
  ALTER TABLE "bookings" ADD COLUMN "telematics_allowed_km" numeric;
  ALTER TABLE "bookings" ADD COLUMN "telematics_extra_km_driven" numeric;
  ALTER TABLE "bookings" ADD COLUMN "telematics_extra_km_rate" numeric;
  ALTER TABLE "bookings" ADD COLUMN "telematics_extra_km_charge" numeric;
  ALTER TABLE "bookings" ADD COLUMN "telematics_current_latitude" numeric;
  ALTER TABLE "bookings" ADD COLUMN "telematics_current_longitude" numeric;
  ALTER TABLE "bookings" ADD COLUMN "telematics_current_speed" numeric;
  ALTER TABLE "bookings" ADD COLUMN "telematics_current_ignition" boolean;
  ALTER TABLE "bookings" ADD COLUMN "telematics_last_ping_at" timestamp(3) with time zone;
  ALTER TABLE "bookings" ADD COLUMN "chauffeur_details_name" varchar;
  ALTER TABLE "bookings" ADD COLUMN "chauffeur_details_phone" varchar;
  ALTER TABLE "bookings" ADD COLUMN "chauffeur_details_photo_url" varchar;
  ALTER TABLE "bookings" ADD COLUMN "chauffeur_details_vehicle_number" varchar;
  ALTER TABLE "bookings" ADD COLUMN "chauffeur_details_car_color" varchar;
  ALTER TABLE "bookings" ADD COLUMN "chauffeur_details_assigned_at" timestamp(3) with time zone;
  ALTER TABLE "bookings" ADD COLUMN "assigned_wedding_coordinator_name" varchar;
  ALTER TABLE "bookings" ADD COLUMN "assigned_wedding_coordinator_phone" varchar;
  ALTER TABLE "bookings" ADD COLUMN "pickup_reminder_sent_at" timestamp(3) with time zone;
  ALTER TABLE "bookings" ADD COLUMN "return_reminder_sent_at" timestamp(3) with time zone;
  ALTER TABLE "bookings" ADD COLUMN "payment_receipt_sent_at" timestamp(3) with time zone;
  ALTER TABLE "bookings" ADD COLUMN "cancellation_notified_at" timestamp(3) with time zone;
  ALTER TABLE "bookings" ADD COLUMN "review_requested_at" timestamp(3) with time zone;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "partner_applications_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "promo_banner_enabled" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "promo_banner_text" varchar DEFAULT 'Exclusive Offer: Use code FIRST10 for 10% off your first luxury rental!';
  ALTER TABLE "site_settings" ADD COLUMN "promo_banner_code" varchar DEFAULT 'FIRST10';
  ALTER TABLE "site_settings" ADD COLUMN "favicon_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "apple_touch_icon_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "hero_subtitle" varchar DEFAULT 'Premium Luxury Transportation';
  ALTER TABLE "site_settings" ADD COLUMN "hero_heading_line1" varchar DEFAULT 'The Art of';
  ALTER TABLE "site_settings" ADD COLUMN "hero_heading_line2" varchar DEFAULT 'Luxury';
  ALTER TABLE "site_settings" ADD COLUMN "mission_badge" varchar DEFAULT 'Who We Are';
  ALTER TABLE "site_settings" ADD COLUMN "mission_title" varchar DEFAULT 'Our Mission';
  ALTER TABLE "site_settings" ADD COLUMN "mission_text" varchar DEFAULT 'DRIVEIT Luxury aims to be the world’s leading luxury mobility platform, offering unmatched service, exclusivity, and innovation. We redefine ultra-luxury travel with cutting-edge technology, global partnerships, and personalized experiences—setting new standards in premium lifestyle and elite mobility.';
  ALTER TABLE "site_settings" ADD COLUMN "mission_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "meta_title" varchar DEFAULT 'DRIVEIT Luxury | Premium Luxury Car Rental Hyderabad | Book Online';
  ALTER TABLE "site_settings" ADD COLUMN "meta_description" varchar DEFAULT 'Experience unparalleled luxury with DRIVEIT. Premium car rental, private jet services, yacht charters, and luxury transportation in Hyderabad, India. VIP chauffeur services, wedding cars, and corporate transportation solutions.';
  ALTER TABLE "site_settings" ADD COLUMN "og_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "linkedin_url" varchar DEFAULT 'https://linkedin.com/company/driveitluxury';
  ALTER TABLE "site_settings" ADD COLUMN "twitter_url" varchar DEFAULT 'https://twitter.com/driveitluxury';
  ALTER TABLE "bookings_telematics_telemetry_alerts" ADD CONSTRAINT "bookings_telematics_telemetry_alerts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "bookings_telematics_telemetry_alerts_order_idx" ON "bookings_telematics_telemetry_alerts" USING btree ("_order");
  CREATE INDEX "bookings_telematics_telemetry_alerts_parent_id_idx" ON "bookings_telematics_telemetry_alerts" USING btree ("_parent_id");
  CREATE INDEX "partner_applications_updated_at_idx" ON "partner_applications" USING btree ("updated_at");
  CREATE INDEX "partner_applications_created_at_idx" ON "partner_applications" USING btree ("created_at");
  ALTER TABLE "customers" ADD CONSTRAINT "customers_driving_license_front_id_media_id_fk" FOREIGN KEY ("driving_license_front_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customers" ADD CONSTRAINT "customers_driving_license_back_id_media_id_fk" FOREIGN KEY ("driving_license_back_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customers" ADD CONSTRAINT "customers_id_proof_document_id_media_id_fk" FOREIGN KEY ("id_proof_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cars_gallery" ADD CONSTRAINT "cars_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partner_applications_fk" FOREIGN KEY ("partner_applications_id") REFERENCES "public"."partner_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_apple_touch_icon_id_media_id_fk" FOREIGN KEY ("apple_touch_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_mission_image_id_media_id_fk" FOREIGN KEY ("mission_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "customers_kyc_status_idx" ON "customers" USING btree ("kyc_status");
  CREATE INDEX "customers_driving_license_front_idx" ON "customers" USING btree ("driving_license_front_id");
  CREATE INDEX "customers_driving_license_back_idx" ON "customers" USING btree ("driving_license_back_id");
  CREATE INDEX "customers_id_proof_document_idx" ON "customers" USING btree ("id_proof_document_id");
  CREATE INDEX "cars_gallery_image_idx" ON "cars_gallery" USING btree ("image_id");
  CREATE INDEX "cars_gps_device_id_idx" ON "cars" USING btree ("gps_device_id");
  CREATE INDEX "payload_locked_documents_rels_partner_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("partner_applications_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_apple_touch_icon_idx" ON "site_settings" USING btree ("apple_touch_icon_id");
  CREATE INDEX "site_settings_hero_image_idx" ON "site_settings" USING btree ("hero_image_id");
  CREATE INDEX "site_settings_mission_image_idx" ON "site_settings" USING btree ("mission_image_id");
  CREATE INDEX "site_settings_og_image_idx" ON "site_settings" USING btree ("og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "bookings_telematics_telemetry_alerts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partner_applications" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "bookings_telematics_telemetry_alerts" CASCADE;
  DROP TABLE "partner_applications" CASCADE;
  ALTER TABLE "customers" DROP CONSTRAINT "customers_driving_license_front_id_media_id_fk";
  
  ALTER TABLE "customers" DROP CONSTRAINT "customers_driving_license_back_id_media_id_fk";
  
  ALTER TABLE "customers" DROP CONSTRAINT "customers_id_proof_document_id_media_id_fk";
  
  ALTER TABLE "cars_gallery" DROP CONSTRAINT "cars_gallery_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_partner_applications_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_favicon_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_apple_touch_icon_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_hero_image_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_mission_image_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_og_image_id_media_id_fk";
  
  DROP INDEX "customers_kyc_status_idx";
  DROP INDEX "customers_driving_license_front_idx";
  DROP INDEX "customers_driving_license_back_idx";
  DROP INDEX "customers_id_proof_document_idx";
  DROP INDEX "cars_gallery_image_idx";
  DROP INDEX "cars_gps_device_id_idx";
  DROP INDEX "payload_locked_documents_rels_partner_applications_id_idx";
  DROP INDEX "site_settings_favicon_idx";
  DROP INDEX "site_settings_apple_touch_icon_idx";
  DROP INDEX "site_settings_hero_image_idx";
  DROP INDEX "site_settings_mission_image_idx";
  DROP INDEX "site_settings_og_image_idx";
  ALTER TABLE "cars_gallery" ALTER COLUMN "src" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "contact_phone" SET DEFAULT '+91 98765 43210';
  ALTER TABLE "site_settings" ALTER COLUMN "whatsapp_number" SET DEFAULT '+919876543210';
  ALTER TABLE "customers" DROP COLUMN "gstin";
  ALTER TABLE "customers" DROP COLUMN "company_name";
  ALTER TABLE "customers" DROP COLUMN "kyc_status";
  ALTER TABLE "customers" DROP COLUMN "driving_license_number";
  ALTER TABLE "customers" DROP COLUMN "driving_license_front_id";
  ALTER TABLE "customers" DROP COLUMN "driving_license_back_id";
  ALTER TABLE "customers" DROP COLUMN "aadhaar_last4";
  ALTER TABLE "customers" DROP COLUMN "id_proof_document_id";
  ALTER TABLE "customers" DROP COLUMN "kyc_verified_at";
  ALTER TABLE "customers" DROP COLUMN "kyc_rejection_reason";
  ALTER TABLE "cars_gallery" DROP COLUMN "image_id";
  ALTER TABLE "cars" DROP COLUMN "security_deposit_amount";
  ALTER TABLE "cars" DROP COLUMN "fuel_policy";
  ALTER TABLE "cars" DROP COLUMN "fast_tag_equipped";
  ALTER TABLE "cars" DROP COLUMN "gps_device_id";
  ALTER TABLE "cars" DROP COLUMN "current_odometer_km";
  ALTER TABLE "cars" DROP COLUMN "extra_km_rate";
  ALTER TABLE "cars" DROP COLUMN "current_telemetry_latitude";
  ALTER TABLE "cars" DROP COLUMN "current_telemetry_longitude";
  ALTER TABLE "cars" DROP COLUMN "current_telemetry_speed_km_h";
  ALTER TABLE "cars" DROP COLUMN "current_telemetry_ignition";
  ALTER TABLE "cars" DROP COLUMN "current_telemetry_battery_voltage";
  ALTER TABLE "cars" DROP COLUMN "current_telemetry_last_ping_at";
  ALTER TABLE "cars" DROP COLUMN "current_telemetry_geofence_status";
  ALTER TABLE "cars" DROP COLUMN "current_telemetry_last_alert";
  ALTER TABLE "bookings" DROP COLUMN "flight_number";
  ALTER TABLE "bookings" DROP COLUMN "airport_terminal";
  ALTER TABLE "bookings" DROP COLUMN "gstin";
  ALTER TABLE "bookings" DROP COLUMN "company_name";
  ALTER TABLE "bookings" DROP COLUMN "security_deposit_amount";
  ALTER TABLE "bookings" DROP COLUMN "security_deposit_status";
  ALTER TABLE "bookings" DROP COLUMN "deposit_refund_utr";
  ALTER TABLE "bookings" DROP COLUMN "deposit_refund_deduction_reason";
  ALTER TABLE "bookings" DROP COLUMN "deposit_refunded_at";
  ALTER TABLE "bookings" DROP COLUMN "telematics_start_odometer_km";
  ALTER TABLE "bookings" DROP COLUMN "telematics_end_odometer_km";
  ALTER TABLE "bookings" DROP COLUMN "telematics_total_km_driven";
  ALTER TABLE "bookings" DROP COLUMN "telematics_allowed_km";
  ALTER TABLE "bookings" DROP COLUMN "telematics_extra_km_driven";
  ALTER TABLE "bookings" DROP COLUMN "telematics_extra_km_rate";
  ALTER TABLE "bookings" DROP COLUMN "telematics_extra_km_charge";
  ALTER TABLE "bookings" DROP COLUMN "telematics_current_latitude";
  ALTER TABLE "bookings" DROP COLUMN "telematics_current_longitude";
  ALTER TABLE "bookings" DROP COLUMN "telematics_current_speed";
  ALTER TABLE "bookings" DROP COLUMN "telematics_current_ignition";
  ALTER TABLE "bookings" DROP COLUMN "telematics_last_ping_at";
  ALTER TABLE "bookings" DROP COLUMN "chauffeur_details_name";
  ALTER TABLE "bookings" DROP COLUMN "chauffeur_details_phone";
  ALTER TABLE "bookings" DROP COLUMN "chauffeur_details_photo_url";
  ALTER TABLE "bookings" DROP COLUMN "chauffeur_details_vehicle_number";
  ALTER TABLE "bookings" DROP COLUMN "chauffeur_details_car_color";
  ALTER TABLE "bookings" DROP COLUMN "chauffeur_details_assigned_at";
  ALTER TABLE "bookings" DROP COLUMN "assigned_wedding_coordinator_name";
  ALTER TABLE "bookings" DROP COLUMN "assigned_wedding_coordinator_phone";
  ALTER TABLE "bookings" DROP COLUMN "pickup_reminder_sent_at";
  ALTER TABLE "bookings" DROP COLUMN "return_reminder_sent_at";
  ALTER TABLE "bookings" DROP COLUMN "payment_receipt_sent_at";
  ALTER TABLE "bookings" DROP COLUMN "cancellation_notified_at";
  ALTER TABLE "bookings" DROP COLUMN "review_requested_at";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "partner_applications_id";
  ALTER TABLE "site_settings" DROP COLUMN "promo_banner_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "promo_banner_text";
  ALTER TABLE "site_settings" DROP COLUMN "promo_banner_code";
  ALTER TABLE "site_settings" DROP COLUMN "favicon_id";
  ALTER TABLE "site_settings" DROP COLUMN "apple_touch_icon_id";
  ALTER TABLE "site_settings" DROP COLUMN "hero_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "hero_subtitle";
  ALTER TABLE "site_settings" DROP COLUMN "hero_heading_line1";
  ALTER TABLE "site_settings" DROP COLUMN "hero_heading_line2";
  ALTER TABLE "site_settings" DROP COLUMN "mission_badge";
  ALTER TABLE "site_settings" DROP COLUMN "mission_title";
  ALTER TABLE "site_settings" DROP COLUMN "mission_text";
  ALTER TABLE "site_settings" DROP COLUMN "mission_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "meta_title";
  ALTER TABLE "site_settings" DROP COLUMN "meta_description";
  ALTER TABLE "site_settings" DROP COLUMN "og_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "linkedin_url";
  ALTER TABLE "site_settings" DROP COLUMN "twitter_url";
  DROP TYPE "public"."enum_customers_kyc_status";
  DROP TYPE "public"."enum_cars_current_telemetry_geofence_status";
  DROP TYPE "public"."enum_bookings_security_deposit_status";
  DROP TYPE "public"."enum_partner_applications_status";`)
}
