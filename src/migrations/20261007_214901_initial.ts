import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_room_types_category" AS ENUM('room', 'suite', 'villa');
  CREATE TYPE "public"."enum_dishes_tags" AS ENUM('signature', 'vegetarian', 'vegan', 'spicy', 'gluten-free');
  CREATE TYPE "public"."enum_dishes_category" AS ENUM('newari', 'momo', 'nepali', 'grill', 'international', 'desserts', 'drinks');
  CREATE TYPE "public"."enum_experiences_category" AS ENUM('culture', 'adventure', 'wellness');
  CREATE TYPE "public"."enum_event_venues_setting" AS ENUM('indoor', 'outdoor', 'both');
  CREATE TYPE "public"."enum_media_gallery_category" AS ENUM('hotel', 'rooms', 'dining', 'weddings', 'wellness', 'nepal');
  CREATE TYPE "public"."enum_bookings_status" AS ENUM('pending', 'confirmed', 'cancelled', 'expired');
  CREATE TYPE "public"."enum_bookings_payment_status" AS ENUM('unpaid', 'paid', 'refunded', 'pay-at-hotel');
  CREATE TYPE "public"."enum_bookings_payment_method" AS ENUM('esewa', 'khalti', 'card', 'hotel');
  CREATE TYPE "public"."enum_bookings_currency" AS ENUM('USD', 'NPR');
  CREATE TYPE "public"."enum_enquiries_type" AS ENUM('general', 'wedding', 'event', 'dining', 'spa');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'in-progress', 'closed');
  CREATE TYPE "public"."enum_testimonials_source" AS ENUM('tripadvisor', 'google', 'booking', 'direct');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'reservations', 'editor');
  CREATE TABLE "room_types_amenities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "room_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"category" "enum_room_types_category" DEFAULT 'room' NOT NULL,
  	"slug" varchar,
  	"tagline" varchar,
  	"summary" varchar NOT NULL,
  	"description" jsonb,
  	"hero_image_id" integer,
  	"video_id" integer,
  	"size_sqm" numeric,
  	"max_adults" numeric DEFAULT 2 NOT NULL,
  	"max_children" numeric DEFAULT 1,
  	"bed" varchar,
  	"view" varchar,
  	"base_rate_u_s_d" numeric NOT NULL,
  	"base_rate_n_p_r" numeric,
  	"total_rooms" numeric DEFAULT 1 NOT NULL,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "room_types_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "dining" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"cuisine" varchar,
  	"summary" varchar NOT NULL,
  	"description" jsonb,
  	"image_id" integer,
  	"video_id" integer,
  	"hours" varchar,
  	"dress_code" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "dishes_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_dishes_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "dishes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"local_name" varchar,
  	"description" varchar,
  	"category" "enum_dishes_category" NOT NULL,
  	"price_n_p_r" numeric NOT NULL,
  	"restaurant_id" integer,
  	"image_id" integer,
  	"available" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "experiences_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "experiences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"category" "enum_experiences_category" NOT NULL,
  	"duration" varchar,
  	"price_from" varchar,
  	"summary" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"video_id" integer,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "event_venues" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"setting" "enum_event_venues_setting" DEFAULT 'indoor' NOT NULL,
  	"slug" varchar,
  	"summary" varchar NOT NULL,
  	"image_id" integer,
  	"video_id" integer,
  	"area_sqm" numeric,
  	"banquet" numeric,
  	"theatre" numeric,
  	"reception" numeric,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "offers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"summary" varchar NOT NULL,
  	"description" jsonb,
  	"image_id" integer,
  	"valid_from" timestamp(3) with time zone,
  	"valid_to" timestamp(3) with time zone,
  	"discount_percent" numeric,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"gallery_category" "enum_media_gallery_category",
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
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"status" "enum_bookings_status" DEFAULT 'pending' NOT NULL,
  	"payment_status" "enum_bookings_payment_status" DEFAULT 'unpaid' NOT NULL,
  	"payment_method" "enum_bookings_payment_method",
  	"room_type_id" integer NOT NULL,
  	"check_in" timestamp(3) with time zone NOT NULL,
  	"check_out" timestamp(3) with time zone NOT NULL,
  	"rooms" numeric DEFAULT 1 NOT NULL,
  	"adults" numeric DEFAULT 2 NOT NULL,
  	"children" numeric DEFAULT 0,
  	"guest_name" varchar NOT NULL,
  	"guest_email" varchar NOT NULL,
  	"guest_phone" varchar,
  	"guest_country" varchar,
  	"special_requests" varchar,
  	"total_amount" numeric NOT NULL,
  	"currency" "enum_bookings_currency" DEFAULT 'USD' NOT NULL,
  	"hold_expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_enquiries_type" DEFAULT 'general' NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"preferred_date" timestamp(3) with time zone,
  	"guests" numeric,
  	"message" varchar NOT NULL,
  	"status" "enum_enquiries_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"guest_name" varchar NOT NULL,
  	"origin" varchar,
  	"source" "enum_testimonials_source",
  	"rating" numeric DEFAULT 5,
  	"stay_date" varchar,
  	"is_sample" boolean DEFAULT false,
  	"published" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
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
  	"room_types_id" integer,
  	"dining_id" integer,
  	"dishes_id" integer,
  	"experiences_id" integer,
  	"event_venues_id" integer,
  	"offers_id" integer,
  	"media_id" integer,
  	"bookings_id" integer,
  	"enquiries_id" integer,
  	"testimonials_id" integer,
  	"subscribers_id" integer,
  	"users_id" integer
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
  
  CREATE TABLE "site_settings_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "site_settings_wedding_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_ceremonies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "site_settings_wedding_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"price_from" varchar NOT NULL,
  	"guests" varchar,
  	"inclusions" varchar,
  	"highlight" boolean
  );
  
  CREATE TABLE "site_settings_distances" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"place" varchar NOT NULL,
  	"time" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Kathmandu · Nepal',
  	"hero_title" varchar DEFAULT 'Where the Himalaya comes to rest' NOT NULL,
  	"hero_subtitle" varchar,
  	"hero_image_id" integer,
  	"hero_video_id" integer,
  	"film_video_id" integer,
  	"hero_night_image_id" integer,
  	"hero_night_video_id" integer,
  	"reviews_image_id" integer,
  	"rating_value" numeric,
  	"rating_count" numeric,
  	"rating_source" varchar,
  	"intro_heading" varchar,
  	"intro_body" varchar,
  	"intro_image_id" integer,
  	"intro_video_id" integer,
  	"quote_text" varchar DEFAULT 'Atithi Devo Bhava — the guest is god.',
  	"quote_caption" varchar DEFAULT 'Our promise since day one',
  	"quote_image_id" integer,
  	"quote_video_id" integer,
  	"cta_image_id" integer,
  	"cta_video_id" integer,
  	"menu_intro" varchar,
  	"menu_image_id" integer,
  	"menu_video_id" integer,
  	"menu_note" varchar DEFAULT 'Prices in Nepalese Rupees, subject to 10% service charge and 13% VAT.',
  	"events_intro" varchar,
  	"events_image_id" integer,
  	"events_video_id" integer,
  	"wedding_story_heading" varchar,
  	"wedding_story" varchar,
  	"wedding_story_image_id" integer,
  	"wedding_quote" varchar,
  	"wedding_band_image_id" integer,
  	"wedding_band_video_id" integer,
  	"planner_name" varchar,
  	"planner_phone" varchar,
  	"planner_email" varchar,
  	"planner_image_id" integer,
  	"phone" varchar,
  	"whatsapp" varchar,
  	"email" varchar,
  	"address" varchar,
  	"map_url" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"location_image_id" integer,
  	"instagram" varchar,
  	"facebook" varchar,
  	"tripadvisor" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "room_types_amenities" ADD CONSTRAINT "room_types_amenities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "room_types" ADD CONSTRAINT "room_types_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "room_types" ADD CONSTRAINT "room_types_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "room_types_rels" ADD CONSTRAINT "room_types_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "room_types_rels" ADD CONSTRAINT "room_types_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dining" ADD CONSTRAINT "dining_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dining" ADD CONSTRAINT "dining_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dishes_tags" ADD CONSTRAINT "dishes_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dishes" ADD CONSTRAINT "dishes_restaurant_id_dining_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."dining"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dishes" ADD CONSTRAINT "dishes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experiences_highlights" ADD CONSTRAINT "experiences_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences" ADD CONSTRAINT "experiences_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experiences" ADD CONSTRAINT "experiences_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "event_venues" ADD CONSTRAINT "event_venues_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "event_venues" ADD CONSTRAINT "event_venues_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_room_types_fk" FOREIGN KEY ("room_types_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dining_fk" FOREIGN KEY ("dining_id") REFERENCES "public"."dining"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dishes_fk" FOREIGN KEY ("dishes_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experiences_fk" FOREIGN KEY ("experiences_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_venues_fk" FOREIGN KEY ("event_venues_id") REFERENCES "public"."event_venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_offers_fk" FOREIGN KEY ("offers_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bookings_fk" FOREIGN KEY ("bookings_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_benefits" ADD CONSTRAINT "site_settings_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_wedding_stats" ADD CONSTRAINT "site_settings_wedding_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_ceremonies" ADD CONSTRAINT "site_settings_ceremonies_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_ceremonies" ADD CONSTRAINT "site_settings_ceremonies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_wedding_packages" ADD CONSTRAINT "site_settings_wedding_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_distances" ADD CONSTRAINT "site_settings_distances_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_film_video_id_media_id_fk" FOREIGN KEY ("film_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_night_image_id_media_id_fk" FOREIGN KEY ("hero_night_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_night_video_id_media_id_fk" FOREIGN KEY ("hero_night_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_reviews_image_id_media_id_fk" FOREIGN KEY ("reviews_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_intro_image_id_media_id_fk" FOREIGN KEY ("intro_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_intro_video_id_media_id_fk" FOREIGN KEY ("intro_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_quote_image_id_media_id_fk" FOREIGN KEY ("quote_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_quote_video_id_media_id_fk" FOREIGN KEY ("quote_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_cta_video_id_media_id_fk" FOREIGN KEY ("cta_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_menu_image_id_media_id_fk" FOREIGN KEY ("menu_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_menu_video_id_media_id_fk" FOREIGN KEY ("menu_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_events_image_id_media_id_fk" FOREIGN KEY ("events_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_events_video_id_media_id_fk" FOREIGN KEY ("events_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_wedding_story_image_id_media_id_fk" FOREIGN KEY ("wedding_story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_wedding_band_image_id_media_id_fk" FOREIGN KEY ("wedding_band_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_wedding_band_video_id_media_id_fk" FOREIGN KEY ("wedding_band_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_planner_image_id_media_id_fk" FOREIGN KEY ("planner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_location_image_id_media_id_fk" FOREIGN KEY ("location_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "room_types_amenities_order_idx" ON "room_types_amenities" USING btree ("_order");
  CREATE INDEX "room_types_amenities_parent_id_idx" ON "room_types_amenities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "room_types_slug_idx" ON "room_types" USING btree ("slug");
  CREATE INDEX "room_types_hero_image_idx" ON "room_types" USING btree ("hero_image_id");
  CREATE INDEX "room_types_video_idx" ON "room_types" USING btree ("video_id");
  CREATE INDEX "room_types_updated_at_idx" ON "room_types" USING btree ("updated_at");
  CREATE INDEX "room_types_created_at_idx" ON "room_types" USING btree ("created_at");
  CREATE INDEX "room_types_rels_order_idx" ON "room_types_rels" USING btree ("order");
  CREATE INDEX "room_types_rels_parent_idx" ON "room_types_rels" USING btree ("parent_id");
  CREATE INDEX "room_types_rels_path_idx" ON "room_types_rels" USING btree ("path");
  CREATE INDEX "room_types_rels_media_id_idx" ON "room_types_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "dining_slug_idx" ON "dining" USING btree ("slug");
  CREATE INDEX "dining_image_idx" ON "dining" USING btree ("image_id");
  CREATE INDEX "dining_video_idx" ON "dining" USING btree ("video_id");
  CREATE INDEX "dining_updated_at_idx" ON "dining" USING btree ("updated_at");
  CREATE INDEX "dining_created_at_idx" ON "dining" USING btree ("created_at");
  CREATE INDEX "dishes_tags_order_idx" ON "dishes_tags" USING btree ("order");
  CREATE INDEX "dishes_tags_parent_idx" ON "dishes_tags" USING btree ("parent_id");
  CREATE INDEX "dishes_restaurant_idx" ON "dishes" USING btree ("restaurant_id");
  CREATE INDEX "dishes_image_idx" ON "dishes" USING btree ("image_id");
  CREATE INDEX "dishes_updated_at_idx" ON "dishes" USING btree ("updated_at");
  CREATE INDEX "dishes_created_at_idx" ON "dishes" USING btree ("created_at");
  CREATE INDEX "experiences_highlights_order_idx" ON "experiences_highlights" USING btree ("_order");
  CREATE INDEX "experiences_highlights_parent_id_idx" ON "experiences_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "experiences_slug_idx" ON "experiences" USING btree ("slug");
  CREATE INDEX "experiences_image_idx" ON "experiences" USING btree ("image_id");
  CREATE INDEX "experiences_video_idx" ON "experiences" USING btree ("video_id");
  CREATE INDEX "experiences_updated_at_idx" ON "experiences" USING btree ("updated_at");
  CREATE INDEX "experiences_created_at_idx" ON "experiences" USING btree ("created_at");
  CREATE UNIQUE INDEX "event_venues_slug_idx" ON "event_venues" USING btree ("slug");
  CREATE INDEX "event_venues_image_idx" ON "event_venues" USING btree ("image_id");
  CREATE INDEX "event_venues_video_idx" ON "event_venues" USING btree ("video_id");
  CREATE INDEX "event_venues_updated_at_idx" ON "event_venues" USING btree ("updated_at");
  CREATE INDEX "event_venues_created_at_idx" ON "event_venues" USING btree ("created_at");
  CREATE UNIQUE INDEX "offers_slug_idx" ON "offers" USING btree ("slug");
  CREATE INDEX "offers_image_idx" ON "offers" USING btree ("image_id");
  CREATE INDEX "offers_updated_at_idx" ON "offers" USING btree ("updated_at");
  CREATE INDEX "offers_created_at_idx" ON "offers" USING btree ("created_at");
  CREATE INDEX "media_gallery_category_idx" ON "media" USING btree ("gallery_category");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "bookings_reference_idx" ON "bookings" USING btree ("reference");
  CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");
  CREATE INDEX "bookings_room_type_idx" ON "bookings" USING btree ("room_type_id");
  CREATE INDEX "bookings_check_in_idx" ON "bookings" USING btree ("check_in");
  CREATE INDEX "bookings_check_out_idx" ON "bookings" USING btree ("check_out");
  CREATE INDEX "bookings_updated_at_idx" ON "bookings" USING btree ("updated_at");
  CREATE INDEX "bookings_created_at_idx" ON "bookings" USING btree ("created_at");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_room_types_id_idx" ON "payload_locked_documents_rels" USING btree ("room_types_id");
  CREATE INDEX "payload_locked_documents_rels_dining_id_idx" ON "payload_locked_documents_rels" USING btree ("dining_id");
  CREATE INDEX "payload_locked_documents_rels_dishes_id_idx" ON "payload_locked_documents_rels" USING btree ("dishes_id");
  CREATE INDEX "payload_locked_documents_rels_experiences_id_idx" ON "payload_locked_documents_rels" USING btree ("experiences_id");
  CREATE INDEX "payload_locked_documents_rels_event_venues_id_idx" ON "payload_locked_documents_rels" USING btree ("event_venues_id");
  CREATE INDEX "payload_locked_documents_rels_offers_id_idx" ON "payload_locked_documents_rels" USING btree ("offers_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("bookings_id");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_benefits_order_idx" ON "site_settings_benefits" USING btree ("_order");
  CREATE INDEX "site_settings_benefits_parent_id_idx" ON "site_settings_benefits" USING btree ("_parent_id");
  CREATE INDEX "site_settings_wedding_stats_order_idx" ON "site_settings_wedding_stats" USING btree ("_order");
  CREATE INDEX "site_settings_wedding_stats_parent_id_idx" ON "site_settings_wedding_stats" USING btree ("_parent_id");
  CREATE INDEX "site_settings_ceremonies_order_idx" ON "site_settings_ceremonies" USING btree ("_order");
  CREATE INDEX "site_settings_ceremonies_parent_id_idx" ON "site_settings_ceremonies" USING btree ("_parent_id");
  CREATE INDEX "site_settings_ceremonies_image_idx" ON "site_settings_ceremonies" USING btree ("image_id");
  CREATE INDEX "site_settings_wedding_packages_order_idx" ON "site_settings_wedding_packages" USING btree ("_order");
  CREATE INDEX "site_settings_wedding_packages_parent_id_idx" ON "site_settings_wedding_packages" USING btree ("_parent_id");
  CREATE INDEX "site_settings_distances_order_idx" ON "site_settings_distances" USING btree ("_order");
  CREATE INDEX "site_settings_distances_parent_id_idx" ON "site_settings_distances" USING btree ("_parent_id");
  CREATE INDEX "site_settings_hero_image_idx" ON "site_settings" USING btree ("hero_image_id");
  CREATE INDEX "site_settings_hero_video_idx" ON "site_settings" USING btree ("hero_video_id");
  CREATE INDEX "site_settings_film_video_idx" ON "site_settings" USING btree ("film_video_id");
  CREATE INDEX "site_settings_hero_night_image_idx" ON "site_settings" USING btree ("hero_night_image_id");
  CREATE INDEX "site_settings_hero_night_video_idx" ON "site_settings" USING btree ("hero_night_video_id");
  CREATE INDEX "site_settings_reviews_image_idx" ON "site_settings" USING btree ("reviews_image_id");
  CREATE INDEX "site_settings_intro_image_idx" ON "site_settings" USING btree ("intro_image_id");
  CREATE INDEX "site_settings_intro_video_idx" ON "site_settings" USING btree ("intro_video_id");
  CREATE INDEX "site_settings_quote_image_idx" ON "site_settings" USING btree ("quote_image_id");
  CREATE INDEX "site_settings_quote_video_idx" ON "site_settings" USING btree ("quote_video_id");
  CREATE INDEX "site_settings_cta_image_idx" ON "site_settings" USING btree ("cta_image_id");
  CREATE INDEX "site_settings_cta_video_idx" ON "site_settings" USING btree ("cta_video_id");
  CREATE INDEX "site_settings_menu_image_idx" ON "site_settings" USING btree ("menu_image_id");
  CREATE INDEX "site_settings_menu_video_idx" ON "site_settings" USING btree ("menu_video_id");
  CREATE INDEX "site_settings_events_image_idx" ON "site_settings" USING btree ("events_image_id");
  CREATE INDEX "site_settings_events_video_idx" ON "site_settings" USING btree ("events_video_id");
  CREATE INDEX "site_settings_wedding_story_image_idx" ON "site_settings" USING btree ("wedding_story_image_id");
  CREATE INDEX "site_settings_wedding_band_image_idx" ON "site_settings" USING btree ("wedding_band_image_id");
  CREATE INDEX "site_settings_wedding_band_video_idx" ON "site_settings" USING btree ("wedding_band_video_id");
  CREATE INDEX "site_settings_planner_image_idx" ON "site_settings" USING btree ("planner_image_id");
  CREATE INDEX "site_settings_location_image_idx" ON "site_settings" USING btree ("location_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "room_types_amenities" CASCADE;
  DROP TABLE "room_types" CASCADE;
  DROP TABLE "room_types_rels" CASCADE;
  DROP TABLE "dining" CASCADE;
  DROP TABLE "dishes_tags" CASCADE;
  DROP TABLE "dishes" CASCADE;
  DROP TABLE "experiences_highlights" CASCADE;
  DROP TABLE "experiences" CASCADE;
  DROP TABLE "event_venues" CASCADE;
  DROP TABLE "offers" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "bookings" CASCADE;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_benefits" CASCADE;
  DROP TABLE "site_settings_wedding_stats" CASCADE;
  DROP TABLE "site_settings_ceremonies" CASCADE;
  DROP TABLE "site_settings_wedding_packages" CASCADE;
  DROP TABLE "site_settings_distances" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_room_types_category";
  DROP TYPE "public"."enum_dishes_tags";
  DROP TYPE "public"."enum_dishes_category";
  DROP TYPE "public"."enum_experiences_category";
  DROP TYPE "public"."enum_event_venues_setting";
  DROP TYPE "public"."enum_media_gallery_category";
  DROP TYPE "public"."enum_bookings_status";
  DROP TYPE "public"."enum_bookings_payment_status";
  DROP TYPE "public"."enum_bookings_payment_method";
  DROP TYPE "public"."enum_bookings_currency";
  DROP TYPE "public"."enum_enquiries_type";
  DROP TYPE "public"."enum_enquiries_status";
  DROP TYPE "public"."enum_testimonials_source";
  DROP TYPE "public"."enum_users_roles";`)
}
