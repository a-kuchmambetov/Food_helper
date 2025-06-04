-- Користувачі
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with comprehensive security features
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refresh tokens table for JWT token management
CREATE TABLE IF NOT EXISTS refresh_tokens (
    token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP,
    replaced_by_token UUID,
    created_by_ip INET,
    revoked_by_ip INET
);

-- User sessions table for session management
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Security audit log
CREATE TABLE IF NOT EXISTS security_audit_log (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Категорії страв
CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Смаки
CREATE TABLE Tastes (
    taste_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Страви
CREATE TABLE Dishes (
    dish_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cooking_difficulty INTEGER,
    cooking_time INTEGER,
    category_id INTEGER REFERENCES Categories(category_id)
        ON UPDATE CASCADE
);

-- Смаки страв
CREATE TABLE DishTastes (
    dish_id INTEGER NOT NULL REFERENCES Dishes(dish_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    taste_id INTEGER NOT NULL REFERENCES Tastes(taste_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    PRIMARY KEY (dish_id, taste_id)
);

-- Одиниці виміру
CREATE TABLE MeasureUnits (
    measure_unit_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Інгредієнти
CREATE TABLE Ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    measure_unit_id INTEGER NOT NULL REFERENCES MeasureUnits(measure_unit_id)
	    ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Інгредієнти страви
CREATE TABLE DishIngredients (
    dish_id INTEGER NOT NULL REFERENCES Dishes(dish_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    ingredient_id INTEGER NOT NULL REFERENCES Ingredients(ingredient_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    quantity DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (dish_id, ingredient_id)
);

-- Рецепти
CREATE TABLE Recipes (
    recipe_id SERIAL PRIMARY KEY,
    dish_id INTEGER NOT NULL REFERENCES Dishes(dish_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    instructions TEXT NOT NULL
);

-- Типи прийому їжі
CREATE TABLE MealTypes (
    meal_type_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Заплановані страви
CREATE TABLE PlanedDishes (
    user_id UUID NOT NULL REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    dish_id INTEGER NOT NULL REFERENCES Dishes(dish_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    meal_type_id INTEGER NOT NULL REFERENCES MealTypes(meal_type_id)
        ON UPDATE CASCADE,
    date DATE NOT NULL,
    PRIMARY KEY (user_id, dish_id, meal_type_id, date)
);

-- Інвентаризація інгредієнтів
CREATE TABLE IngredientInventory (
    user_id UUID NOT NULL REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    ingredient_id INTEGER NOT NULL REFERENCES Ingredients(ingredient_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    quantity DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (user_id, ingredient_id)
);

-- Валюти для цін
CREATE TABLE Currency (
    currency_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Ціни інгредієнтів
CREATE TABLE Prices (
    price_id SERIAL PRIMARY KEY,
    ingredient_id INTEGER NOT NULL REFERENCES Ingredients(ingredient_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    currency_id INTEGER NOT NULL REFERENCES Currency(currency_id)
        ON UPDATE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    last_updated DATE NOT NULL DEFAULT NOW()
);

-- SELECT 'TRUNCATE TABLE "' || tablename || '" RESTART IDENTITY CASCADE;'
-- FROM pg_tables
-- WHERE schemaname = 'public';

-- TRUNCATE TABLE "categories" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "dishes" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "dishtastes" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "tastes" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "measureunits" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "ingredients" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "dishingredients" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "recipes" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "planeddishes" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "mealtypes" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "ingredientinventory" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "prices" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "currency" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "user_sessions" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "security_audit_log" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "refresh_tokens" RESTART IDENTITY CASCADE;