import { relations } from "drizzle-orm";
import {
  date,
  integer,
  numeric,
  pgTable,
  primaryKey,
  serial,
  text,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./auth.js";

export const categories = pgTable(
  "categories",
  {
    categoryId: serial("category_id").primaryKey(),
    name: text("name").notNull(),
  },
  (table) => [unique("categories_name_unique").on(table.name)],
);

export const currency = pgTable(
  "currency",
  {
    currencyId: serial("currency_id").primaryKey(),
    name: text("name").notNull(),
  },
  (table) => [unique("currency_name_unique").on(table.name)],
);

export const mealtypes = pgTable(
  "mealtypes",
  {
    mealTypeId: serial("meal_type_id").primaryKey(),
    name: text("name").notNull(),
  },
  (table) => [unique("mealtypes_name_unique").on(table.name)],
);

export const measureunits = pgTable(
  "measureunits",
  {
    measureUnitId: serial("measure_unit_id").primaryKey(),
    name: text("name").notNull(),
  },
  (table) => [unique("measureunits_name_unique").on(table.name)],
);

export const tastes = pgTable(
  "tastes",
  {
    tasteId: serial("taste_id").primaryKey(),
    name: text("name").notNull(),
  },
  (table) => [unique("tastes_name_unique").on(table.name)],
);

export const dishes = pgTable("dishes", {
  dishId: serial("dish_id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  cookingDifficulty: integer("cooking_difficulty"),
  cookingTime: integer("cooking_time"),
  numberOfServings: integer("number_of_servings"),
  categoryId: integer("category_id").references(() => categories.categoryId, {
    onDelete: "no action",
    onUpdate: "cascade",
  }),
});

export const ingredients = pgTable(
  "ingredients",
  {
    ingredientId: serial("ingredient_id").primaryKey(),
    name: text("name").notNull(),
    calories: numeric("calories", { precision: 10, scale: 2 }).notNull(),
    measureUnitId: integer("measure_unit_id")
      .notNull()
      .references(() => measureunits.measureUnitId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [unique("ingredients_name_unique").on(table.name)],
);

export const recipes = pgTable("recipes", {
  recipeId: serial("recipe_id").primaryKey(),
  dishId: integer("dish_id")
    .notNull()
    .references(() => dishes.dishId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  instructions: text("instructions").notNull(),
});

export const prices = pgTable("prices", {
  priceId: serial("price_id").primaryKey(),
  ingredientId: integer("ingredient_id")
    .notNull()
    .references(() => ingredients.ingredientId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  currencyId: integer("currency_id")
    .notNull()
    .references(() => currency.currencyId, {
      onDelete: "no action",
      onUpdate: "cascade",
    }),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  lastUpdated: date("last_updated").defaultNow().notNull(),
});

export const dishingredients = pgTable(
  "dishingredients",
  {
    dishId: integer("dish_id")
      .notNull()
      .references(() => dishes.dishId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    ingredientId: integer("ingredient_id")
      .notNull()
      .references(() => ingredients.ingredientId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.dishId, table.ingredientId] })],
);

export const dishtastes = pgTable(
  "dishtastes",
  {
    dishId: integer("dish_id")
      .notNull()
      .references(() => dishes.dishId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    tasteId: integer("taste_id")
      .notNull()
      .references(() => tastes.tasteId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [primaryKey({ columns: [table.dishId, table.tasteId] })],
);

export const ingredientinventory = pgTable(
  "ingredientinventory",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    ingredientId: integer("ingredient_id")
      .notNull()
      .references(() => ingredients.ingredientId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.ingredientId] })],
);

export const planeddishes = pgTable(
  "planeddishes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    dishId: integer("dish_id")
      .notNull()
      .references(() => dishes.dishId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    mealTypeId: integer("meal_type_id")
      .notNull()
      .references(() => mealtypes.mealTypeId, {
        onDelete: "no action",
        onUpdate: "cascade",
      }),
    date: date("date").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.dishId, table.mealTypeId, table.date],
    }),
    unique("planned_meal_slot").on(table.userId, table.mealTypeId, table.date),
  ],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  dishes: many(dishes),
}));

export const currencyRelations = relations(currency, ({ many }) => ({
  prices: many(prices),
}));

export const mealtypesRelations = relations(mealtypes, ({ many }) => ({
  planedDishes: many(planeddishes),
}));

export const measureunitsRelations = relations(measureunits, ({ many }) => ({
  ingredients: many(ingredients),
}));

export const tastesRelations = relations(tastes, ({ many }) => ({
  dishTastes: many(dishtastes),
}));

export const dishesRelations = relations(dishes, ({ one, many }) => ({
  category: one(categories, {
    fields: [dishes.categoryId],
    references: [categories.categoryId],
  }),
  dishIngredients: many(dishingredients),
  dishTastes: many(dishtastes),
  recipes: many(recipes),
  planedDishes: many(planeddishes),
}));

export const ingredientsRelations = relations(ingredients, ({ one, many }) => ({
  measureUnit: one(measureunits, {
    fields: [ingredients.measureUnitId],
    references: [measureunits.measureUnitId],
  }),
  dishIngredients: many(dishingredients),
  inventory: many(ingredientinventory),
  prices: many(prices),
}));

export const recipesRelations = relations(recipes, ({ one }) => ({
  dish: one(dishes, { fields: [recipes.dishId], references: [dishes.dishId] }),
}));

export const pricesRelations = relations(prices, ({ one }) => ({
  ingredient: one(ingredients, {
    fields: [prices.ingredientId],
    references: [ingredients.ingredientId],
  }),
  currency: one(currency, {
    fields: [prices.currencyId],
    references: [currency.currencyId],
  }),
}));

export const dishingredientsRelations = relations(
  dishingredients,
  ({ one }) => ({
    dish: one(dishes, {
      fields: [dishingredients.dishId],
      references: [dishes.dishId],
    }),
    ingredient: one(ingredients, {
      fields: [dishingredients.ingredientId],
      references: [ingredients.ingredientId],
    }),
  }),
);

export const dishtastesRelations = relations(dishtastes, ({ one }) => ({
  dish: one(dishes, {
    fields: [dishtastes.dishId],
    references: [dishes.dishId],
  }),
  taste: one(tastes, {
    fields: [dishtastes.tasteId],
    references: [tastes.tasteId],
  }),
}));

export const ingredientinventoryRelations = relations(
  ingredientinventory,
  ({ one }) => ({
    user: one(users, {
      fields: [ingredientinventory.userId],
      references: [users.id],
    }),
    ingredient: one(ingredients, {
      fields: [ingredientinventory.ingredientId],
      references: [ingredients.ingredientId],
    }),
  }),
);

export const planeddishesRelations = relations(planeddishes, ({ one }) => ({
  user: one(users, { fields: [planeddishes.userId], references: [users.id] }),
  dish: one(dishes, {
    fields: [planeddishes.dishId],
    references: [dishes.dishId],
  }),
  mealType: one(mealtypes, {
    fields: [planeddishes.mealTypeId],
    references: [mealtypes.mealTypeId],
  }),
}));

export const usersFoodRelations = relations(users, ({ many }) => ({
  inventory: many(ingredientinventory),
  planedDishes: many(planeddishes),
}));
