import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_bookings_payment_status" AS ENUM('awaiting_verification', 'verified', 'rejected');
  ALTER TABLE "bookings" ADD COLUMN "payment_status" "enum_bookings_payment_status" DEFAULT 'awaiting_verification';
  ALTER TABLE "bookings" ADD COLUMN "payment_verified_at" timestamp(3) with time zone;
  ALTER TABLE "bookings" ADD COLUMN "payment_verified_by_id" integer;
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_payment_verified_by_id_users_id_fk" FOREIGN KEY ("payment_verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "bookings_payment_status_idx" ON "bookings" USING btree ("payment_status");
  CREATE INDEX "bookings_payment_verified_by_idx" ON "bookings" USING btree ("payment_verified_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "bookings" DROP CONSTRAINT "bookings_payment_verified_by_id_users_id_fk";
  
  DROP INDEX "bookings_payment_status_idx";
  DROP INDEX "bookings_payment_verified_by_idx";
  ALTER TABLE "bookings" DROP COLUMN "payment_status";
  ALTER TABLE "bookings" DROP COLUMN "payment_verified_at";
  ALTER TABLE "bookings" DROP COLUMN "payment_verified_by_id";
  DROP TYPE "public"."enum_bookings_payment_status";`)
}
