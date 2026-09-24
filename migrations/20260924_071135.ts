import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "cloudinary_public_id" varchar;
  ALTER TABLE "media" ADD COLUMN "cloudinary_resource_type" varchar;
  ALTER TABLE "media" ADD COLUMN "cloudinary_format" varchar;
  ALTER TABLE "media" ADD COLUMN "cloudinary_version" numeric;
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_cloudinary_public_id" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_cloudinary_resource_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_cloudinary_format" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_cloudinary_version" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_cloudinary_public_id" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_cloudinary_resource_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_cloudinary_format" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_cloudinary_version" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP COLUMN "cloudinary_public_id";
  ALTER TABLE "media" DROP COLUMN "cloudinary_resource_type";
  ALTER TABLE "media" DROP COLUMN "cloudinary_format";
  ALTER TABLE "media" DROP COLUMN "cloudinary_version";
  ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "media" DROP COLUMN "_objectkey";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_cloudinary_public_id";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_cloudinary_resource_type";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_cloudinary_format";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_cloudinary_version";
  ALTER TABLE "media" DROP COLUMN "sizes_card_cloudinary_public_id";
  ALTER TABLE "media" DROP COLUMN "sizes_card_cloudinary_resource_type";
  ALTER TABLE "media" DROP COLUMN "sizes_card_cloudinary_format";
  ALTER TABLE "media" DROP COLUMN "sizes_card_cloudinary_version";`)
}
