CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"issuer" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "currency" (
	"currency_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "currency_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "dishingredients" (
	"dish_id" integer NOT NULL,
	"ingredient_id" integer NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	CONSTRAINT "dishingredients_dish_id_ingredient_id_pk" PRIMARY KEY("dish_id","ingredient_id")
);
--> statement-breakpoint
CREATE TABLE "dishtastes" (
	"dish_id" integer NOT NULL,
	"taste_id" integer NOT NULL,
	CONSTRAINT "dishtastes_dish_id_taste_id_pk" PRIMARY KEY("dish_id","taste_id")
);
--> statement-breakpoint
CREATE TABLE "dishes" (
	"dish_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"cooking_difficulty" integer,
	"cooking_time" integer,
	"number_of_servings" integer,
	"category_id" integer
);
--> statement-breakpoint
CREATE TABLE "ingredientinventory" (
	"user_id" text NOT NULL,
	"ingredient_id" integer NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	CONSTRAINT "ingredientinventory_user_id_ingredient_id_pk" PRIMARY KEY("user_id","ingredient_id")
);
--> statement-breakpoint
CREATE TABLE "ingredients" (
	"ingredient_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"calories" numeric(10, 2) NOT NULL,
	"measure_unit_id" integer NOT NULL,
	CONSTRAINT "ingredients_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "mealtypes" (
	"meal_type_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "mealtypes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "measureunits" (
	"measure_unit_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "measureunits_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "planeddishes" (
	"user_id" text NOT NULL,
	"dish_id" integer NOT NULL,
	"meal_type_id" integer NOT NULL,
	"date" date NOT NULL,
	CONSTRAINT "planeddishes_user_id_dish_id_meal_type_id_date_pk" PRIMARY KEY("user_id","dish_id","meal_type_id","date"),
	CONSTRAINT "planned_meal_slot" UNIQUE("user_id","meal_type_id","date")
);
--> statement-breakpoint
CREATE TABLE "prices" (
	"price_id" serial PRIMARY KEY NOT NULL,
	"ingredient_id" integer NOT NULL,
	"currency_id" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"last_updated" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"recipe_id" serial PRIMARY KEY NOT NULL,
	"dish_id" integer NOT NULL,
	"instructions" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tastes" (
	"taste_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tastes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dishingredients" ADD CONSTRAINT "dishingredients_dish_id_dishes_dish_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("dish_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "dishingredients" ADD CONSTRAINT "dishingredients_ingredient_id_ingredients_ingredient_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("ingredient_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "dishtastes" ADD CONSTRAINT "dishtastes_dish_id_dishes_dish_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("dish_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "dishtastes" ADD CONSTRAINT "dishtastes_taste_id_tastes_taste_id_fk" FOREIGN KEY ("taste_id") REFERENCES "public"."tastes"("taste_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ingredientinventory" ADD CONSTRAINT "ingredientinventory_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ingredientinventory" ADD CONSTRAINT "ingredientinventory_ingredient_id_ingredients_ingredient_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("ingredient_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_measure_unit_id_measureunits_measure_unit_id_fk" FOREIGN KEY ("measure_unit_id") REFERENCES "public"."measureunits"("measure_unit_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "planeddishes" ADD CONSTRAINT "planeddishes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "planeddishes" ADD CONSTRAINT "planeddishes_dish_id_dishes_dish_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("dish_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "planeddishes" ADD CONSTRAINT "planeddishes_meal_type_id_mealtypes_meal_type_id_fk" FOREIGN KEY ("meal_type_id") REFERENCES "public"."mealtypes"("meal_type_id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "prices" ADD CONSTRAINT "prices_ingredient_id_ingredients_ingredient_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("ingredient_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "prices" ADD CONSTRAINT "prices_currency_id_currency_currency_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("currency_id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_dish_id_dishes_dish_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("dish_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_issuer_accountId_idx" ON "accounts" USING btree ("issuer","account_id");--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");