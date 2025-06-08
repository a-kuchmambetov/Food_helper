-- Tastes
INSERT INTO Tastes (taste_id, name) VALUES
(1, 'Sweet'),
(2, 'Salty'),
(3, 'Sour'),
(4, 'Bitter'),
(5, 'Umami'),
(6, 'Spicy');

-- Meal types
INSERT INTO MealTypes (meal_type_id, name) VALUES
(1, 'Breakfast'),
(2, 'Lunch'),
(3, 'Dinner'),
(4, 'Snack');

-- Dish categorties
INSERT INTO Categories (category_id, name) VALUES
(1, 'Main Course'),
(2, 'Soup'),
(3, 'Dessert'),
(4, 'Salad'),
(5, 'Appetizer');

-- Insert measurement units (if not already present)
INSERT INTO MeasureUnits (name) VALUES
  ('cups'),
  ('grams'),
  ('tablespoons'),
  ('teaspoons'),
  ('ounces'),
  ('milliliters'),
  ('pieces'),
  ('pounds');

-- Insert ingredients with realistic calories per unit
INSERT INTO Ingredients (name, calories, measure_unit_id) VALUES
  ('All-purpose flour', 455.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Bread flour', 455.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Whole wheat flour', 407.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Cake flour', 400.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Almond flour', 640.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Coconut flour', 480.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Rice flour', 578.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Cornstarch', 30.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Baking powder', 5.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Baking soda', 0.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Yeast (active dry)', 21.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Sugar (granulated)', 774.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Brown sugar', 829.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Powdered sugar', 496.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Honey', 64.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Maple syrup', 52.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Molasses', 47.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Agave nectar', 60.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Butter', 102.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Margarine', 102.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Shortening', 115.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Lard', 115.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Vegetable oil', 120.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Olive oil', 119.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Canola oil', 119.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Coconut oil', 117.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Sesame oil', 40.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Sunflower oil', 120.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Peanut oil', 120.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Milk (whole)', 149.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Milk (skim)', 83.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Milk (almond)', 39.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Milk (soy)', 100.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Milk (coconut)', 45.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Heavy cream', 821.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Half-and-half', 580.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Yogurt', 149.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Sour cream', 445.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Cream cheese', 99.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'ounces')),
  ('Cheddar cheese (shredded)', 455.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Mozzarella cheese', 300.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Parmesan cheese (grated)', 22.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Cottage cheese', 206.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Ricotta cheese', 441.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Eggs (large)', 72.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Egg whites', 8.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Egg yolks', 55.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Chicken breast (boneless)', 284.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Chicken thighs', 950.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pounds')),
  ('Chicken drumsticks', 160.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Ground beef', 1152.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pounds')),
  ('Beef steak (ribeye, sirloin, etc.)', 900.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pounds')),
  ('Pork chops', 1128.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pounds')),
  ('Bacon', 43.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Sausage (links)', 207.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Sausage (ground)', 3.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'grams')),
  ('Shrimp (peeled, deveined)', 7.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Salmon fillet', 59.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'ounces')),
  ('Tuna (canned)', 33.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'ounces')),
  ('Canned tomatoes (diced)', 0.18, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'grams')),
  ('Tomato paste', 13.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Tomato sauce', 79.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Dried pasta (spaghetti)', 100.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'ounces')),
  ('Rice (white, uncooked)', 685.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Rice (brown, uncooked)', 687.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Quinoa', 626.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Lentils (brown, uncooked)', 678.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Chickpeas (canned)', 269.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Black beans (canned)', 218.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Kidney beans (canned)', 215.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Olives (black or green)', 155.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Capers', 2.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Vinegar (white)', 3.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Vinegar (apple cider)', 3.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Vinegar (balsamic)', 14.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Vinegar (red wine)', 3.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Soy sauce', 10.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Worcestershire sauce', 13.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Hot sauce', 0.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Mustard (Dijon)', 15.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Mustard (yellow)', 3.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Ketchup', 20.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Mayonnaise', 94.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('BBQ sauce', 29.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Salt (table)', 0.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Salt (kosher)', 0.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Salt (sea)', 0.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Black pepper (ground)', 6.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Red pepper flakes', 5.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Paprika (sweet or smoked)', 6.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Cumin (ground)', 22.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Coriander (ground)', 5.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Cinnamon (ground)', 6.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Nutmeg (ground)', 12.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Ginger (ground)', 6.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Garlic (fresh, cloves)', 4.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Garlic powder', 10.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Onion powder', 8.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Onion (yellow, medium)', 44.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Onion (red, medium)', 44.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Carrots (medium)', 25.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Celery (stalks)', 6.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Bell peppers (medium)', 24.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Potatoes (russet, medium)', 168.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Potatoes (Yukon Gold, medium)', 154.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Sweet potatoes (medium)', 112.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Zucchini (medium)', 33.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Cucumber (medium)', 16.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Broccoli florets', 31.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Cauliflower florets', 25.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Spinach (fresh, loose leaves)', 7.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Kale (fresh, chopped)', 33.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Lettuce (romaine, leaves)', 1.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Lettuce (iceberg, shredded)', 10.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Tomatoes (fresh, medium)', 22.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Canned coconut milk', 552.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Canned coconut cream', 792.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Chocolate chips (semi-sweet)', 805.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Cocoa powder (unsweetened)', 12.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Vanilla extract', 12.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Almond extract', 12.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Lemon juice (fresh)', 4.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Lime juice (fresh)', 4.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Fresh basil leaves', 22.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Fresh parsley (chopped)', 22.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Fresh cilantro (chopped)', 1.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Dried oregano', 5.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Dried thyme', 4.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Dried rosemary (crushed)', 2.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'teaspoons')),
  ('Bay leaves', 1.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Fresh mint leaves', 25.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Fresh dill (chopped)', 30.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Avocado (medium)', 240.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Bananas (ripe, medium)', 105.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Apples (medium)', 95.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Grapes', 62.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Strawberries', 49.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Blueberries', 85.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Raspberries', 64.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Oranges (medium)', 62.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Lemons (medium)', 17.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Limes (medium)', 20.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Pineapple (fresh chunks)', 82.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Mango (fresh, diced)', 202.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Peaches (medium)', 59.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Pears (medium)', 101.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Canned pineapple (chunks)', 82.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Raisins', 493.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Dried cranberries', 411.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Pistachios (shelled)', 684.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Almonds (whole)', 828.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Walnuts (halves)', 765.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Pecans (halves)', 753.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Peanuts (shelled)', 828.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Cashews (unsalted)', 718.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Sunflower seeds (hulled)', 818.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  ('Pumpkin seeds (hulled)', 717.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'cups')),
  -- 
  ('Curry powder',      20.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Taco seasoning',    25.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Salsa',              8.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Chicken (diced)',    1.63, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'grams')),
  ('Whole chicken',    2000.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Lamb chops',       1000.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pounds')),
  ('Gruyère cheese',     35.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Mascarpone cheese',   4.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'grams')),
  ('Tortilla',           90.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Bread slice',        80.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Pie pastry',       1000.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Eggplant',          132.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Arborio rice',        4.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'grams')),
  ('Egg noodles',         3.60, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'grams')),
  ('Lasagna sheets',     25.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('White wine',          0.82, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'milliliters')),
  ('Vegetable broth',     0.10, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'milliliters')),
  ('Beef broth',          0.05, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'milliliters')),
  ('Water',               0.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'milliliters')),
  ('Chocolate ganache',    5.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'grams')),
  ('Ladyfingers',        35.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'pieces')),
  ('Digestive biscuits', 4.50,  (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'grams')),
  ('Horseradish',         5.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'tablespoons')),
  ('Mushrooms (fresh)',  0.22,  (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'grams')),
  ('Coffee (strong)', 0.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'milliliters')),
  ('Croutons', 4.00, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'grams')),
  ('Feta cheese', 2.64, (SELECT measure_unit_id FROM MeasureUnits WHERE name = 'grams'));

-- Dishes
-- Main Courses (category_id = 1)
INSERT INTO Dishes (name, description, cooking_difficulty, cooking_time, category_id, number_of_servings) VALUES
  ('Spaghetti Bolognese',    'Classic Italian pasta with rich meat sauce.',                    2, 45, 1, 4),
  ('Grilled Chicken Breast',  'Marinated chicken breast grilled to juicy perfection.',           1, 30, 1, 2),
  ('Beef Steak with Herb Butter','Pan-seared ribeye topped with garlic-herb butter.',            3, 25, 1, 2),
  ('Salmon Fillet with Lemon Dill Sauce','Pan-roasted salmon with a zesty dill-lemon glaze.', 2, 20, 1, 2),
  ('Vegetable Stir Fry',      'Colorful mix of vegetables stir-fried in soy-ginger sauce.',      1, 25, 1, 2),
  ('Chicken Curry',           'Fragrant curry with tender chicken pieces and coconut milk.',     2, 40, 1, 4),
  ('Beef Tacos',              'Soft tortillas filled with seasoned beef, lettuce, and cheese.',  1, 20, 1, 4),
  ('Mushroom Risotto',        'Creamy Arborio rice cooked with mushrooms and Parmesan.',        3, 50, 1, 2),
  ('Pork Chops with Apple Sauce','Pan-fried pork chops served with homemade apple compote.',      2, 35, 1, 2),
  ('Lamb Chops with Rosemary','Grilled lamb chops seasoned with fresh rosemary and garlic.',    3, 30, 1, 2),
  ('Vegetarian Lasagna',      'Layered pasta with mixed vegetables and three cheeses.',          2, 60, 1, 6);

-- Soups (category_id = 2)
INSERT INTO Dishes (name, description, cooking_difficulty, cooking_time, category_id, number_of_servings) VALUES
  ('Tomato Soup',           'Smooth tomato base with herbs, served hot.',                   1, 30, 2, 4),
  ('Chicken Noodle Soup',   'Comforting broth with chicken chunks and egg noodles.',       1, 40, 2, 4),
  ('Cream of Mushroom Soup','Rich and silky soup made from blended mushrooms.',             1, 35, 2, 4),
  ('Minestrone Soup',       'Hearty vegetable soup with beans and pasta.',                 1, 45, 2, 6),
  ('French Onion Soup',     'Caramelized onions in beef broth topped with melted cheese.',  2, 60, 2, 4);

-- Desserts (category_id = 3)
INSERT INTO Dishes (name, description, cooking_difficulty, cooking_time, category_id, number_of_servings) VALUES
  ('Chocolate Cake',       'Moist chocolate sponge layered with chocolate ganache.',      2, 60, 3, 8),
  ('Apple Pie',            'Classic pie with cinnamon-spiced apples and flaky crust.',    2, 50, 3, 8),
  ('Classic Cheesecake',   'Creamy cheesecake on a buttery graham cracker crust.',        3, 90, 3, 8),
  ('Tiramisu',             'Coffee-soaked ladyfingers layered with mascarpone cream.',    3, 30, 3, 6);

-- Salads (category_id = 4)
INSERT INTO Dishes (name, description, cooking_difficulty, cooking_time, category_id, number_of_servings) VALUES
  ('Caesar Salad',   'Romaine lettuce with Caesar dressing, croutons, and Parmesan.', 1, 15, 4, 2),
  ('Greek Salad',    'Tomatoes, cucumbers, olives, feta cheese with olive oil.',      1, 10, 4, 4),
  ('Waldorf Salad',  'Apples, celery, grapes, and walnuts in a mayo-yogurt dressing.',1, 20, 4, 4);

-- Appetizers (category_id = 5)
INSERT INTO Dishes (name, description, cooking_difficulty, cooking_time, category_id, number_of_servings) VALUES
  ('Bruschetta',      'Grilled bread topped with tomato, garlic, basil, and olive oil.', 1, 15, 5, 4),
  ('Shrimp Cocktail', 'Chilled shrimp served with tangy cocktail sauce.',                  1, 10, 5, 2);

  INSERT INTO DishTastes (dish_id, taste_id) VALUES
  -- 1. Spaghetti Bolognese
  (1,5),(1,2),
  -- 2. Grilled Chicken Breast
  (2,5),(2,2),
  -- 3. Beef Steak with Herb Butter
  (3,5),(3,2),
  -- 4. Salmon Fillet with Lemon Dill Sauce
  (4,5),(4,2),(4,3),
  -- 5. Vegetable Stir Fry
  (5,5),(5,2),(5,6),
  -- 6. Chicken Curry
  (6,5),(6,6),
  -- 7. Beef Tacos
  (7,5),(7,6),(7,2),(7,3),
  -- 8. Mushroom Risotto
  (8,5),(8,2),
  -- 9. Pork Chops with Apple Sauce
  (9,5),(9,1),(9,2),
  -- 10. Lamb Chops with Rosemary
  (10,5),(10,2),(10,4),
  -- 11. Vegetarian Lasagna
  (11,5),(11,2),(11,3),
  -- 12. Tomato Soup
  (12,5),(12,2),(12,3),
  -- 13. Chicken Noodle Soup
  (13,5),(13,2),
  -- 14. Cream of Mushroom Soup
  (14,5),(14,2),
  -- 15. Minestrone Soup
  (15,5),(15,2),(15,3),
  -- 16. French Onion Soup
  (16,5),(16,2),(16,1),
  -- 17. Chocolate Cake
  (17,1),(17,4),
  -- 18. Apple Pie
  (18,1),(18,3),(18,2),
  -- 19. Classic Cheesecake
  (19,1),(19,3),(19,2),
  -- 20. Tiramisu
  (20,1),(20,4),
  -- 21. Caesar Salad
  (21,2),(21,5),(21,3),
  -- 22. Greek Salad
  (22,2),(22,3),(22,4),(22,5),
  -- 23. Waldorf Salad
  (23,1),(23,3),
  -- 24. Bruschetta
  (24,2),(24,3),(24,5),(24,4),
  -- 25. Shrimp Cocktail
  (25,5),(25,2),(25,3),(25,6)
;

-- Recipes
-- Recipes for all 25 dishes
INSERT INTO Recipes (dish_id, instructions) VALUES
  -- 1. Spaghetti Bolognese
  (1, 'Step 1: Sauté 1 tbsp olive oil, 1 finely chopped onion and 2 cloves garlic until soft. Step 2: Add 500 g ground beef, cook until browned. Step 3: Stir in 400 g crushed tomatoes, 2 tbsp tomato paste, 1 tsp dried oregano and simmer 15 minutes. Step 4: Boil spaghetti until al dente, drain and toss with sauce.'),
  -- 2. Grilled Chicken Breast
  (2, 'Step 1: Marinate 2 chicken breasts in 2 tbsp olive oil, juice of 1 lemon, salt and pepper for 15 minutes. Step 2: Preheat grill to medium-high. Step 3: Grill 6–7 minutes per side until internal temperature reaches 75 °C. Step 4: Rest 5 minutes before slicing.'),
  -- 3. Beef Steak with Herb Butter
  (3, 'Step 1: Bring 2 ribeye steaks to room temperature and season with salt and pepper. Step 2: Heat 1 tbsp oil in a skillet until smoking; sear steaks 3 minutes per side. Step 3: Mix 50 g softened butter with 1 tsp chopped rosemary and 1 clove minced garlic. Step 4: Remove steaks to rest and top with herb butter.'),
  -- 4. Salmon Fillet with Lemon Dill Sauce
  (4, 'Step 1: Season 2 salmon fillets with salt and pepper. Step 2: Roast at 200 °C for 12 minutes. Step 3: In a pan, melt 1 tbsp butter, stir in juice of ½ lemon, 1 tbsp chopped dill and 2 tbsp cream; simmer 2 minutes. Step 4: Spoon sauce over salmon and serve.'),
  -- 5. Vegetable Stir Fry
  (5, 'Step 1: Heat 1 tbsp oil in a wok over high heat. Step 2: Add 1 clove minced garlic and 1 tsp grated ginger, stir 30 seconds. Step 3: Toss in sliced bell peppers, broccoli florets and carrots; stir fry 4 minutes. Step 4: Add 2 tbsp soy sauce and 1 tsp chili flakes, cook 1 minute more.'),
  -- 6. Chicken Curry
  (6, 'Step 1: Sauté 1 chopped onion in 1 tbsp oil until golden. Step 2: Stir in 1 tbsp curry powder, 1 tsp cumin and cook 1 minute. Step 3: Add 400 g diced chicken and brown. Step 4: Pour in 400 ml coconut milk, simmer 20 minutes. Step 5: Garnish with cilantro.'),
  -- 7. Beef Tacos
  (7, 'Step 1: Cook 400 g ground beef with 1 tbsp taco seasoning until no longer pink. Step 2: Warm 8 tortillas in a dry pan. Step 3: Fill each with beef, shredded lettuce, diced tomato and grated cheese. Step 4: Top with salsa and sour cream.'),
  -- 8. Mushroom Risotto
  (8, 'Step 1: Sauté 1 finely chopped onion in 1 tbsp butter until soft. Step 2: Add 200 g Arborio rice and toast 2 minutes. Step 3: Pour in 100 ml white wine; stir until absorbed. Step 4: Gradually ladle in 800 ml hot stock, stirring until creamy. Step 5: Fold in 150 g sautéed mushrooms and 30 g Parmesan.'),
  -- 9. Pork Chops with Apple Sauce
  (9, 'Step 1: Season 2 pork chops with salt and pepper. Step 2: Sear in 1 tbsp oil, 4 minutes per side. Step 3: Simmer 2 peeled, sliced apples with 1 tbsp sugar and 1 tsp cinnamon until soft. Step 4: Serve chops topped with apple sauce.'),
  -- 10. Lamb Chops with Rosemary
  (10, 'Step 1: Rub 4 lamb chops with olive oil, salt, pepper and chopped rosemary. Step 2: Heat skillet and sear chops 3 minutes per side. Step 3: Reduce heat and cook 2 minutes more for medium. Step 4: Rest 5 minutes before plating.'),
  -- 11. Vegetarian Lasagna
  (11, 'Step 1: Sauté chopped onion, zucchini and eggplant in 1 tbsp oil until tender. Step 2: Stir in 400 g tomato sauce and simmer 10 minutes. Step 3: Layer lasagna sheets, vegetable sauce and ricotta in a baking dish. Step 4: Top with mozzarella and bake at 180 °C for 30 minutes.'),
  -- 12. Tomato Soup
  (12, 'Step 1: Sauté 1 chopped onion and 2 cloves garlic in 1 tbsp oil until soft. Step 2: Add 800 g canned tomatoes and 500 ml broth; simmer 15 minutes. Step 3: Blend until smooth, return to heat and season. Step 4: Stir in 50 ml cream if desired.'),
  -- 13. Chicken Noodle Soup
  (13, 'Step 1: Simmer 1 whole chicken in 1.5 l water with salt for 30 minutes; remove and shred meat. Step 2: Add chopped carrots, celery and onion to broth; cook 10 minutes. Step 3: Stir in 100 g egg noodles; cook until tender. Step 4: Return chicken to pot and season to taste.'),
  -- 14. Cream of Mushroom Soup
  (14, 'Step 1: Sauté 200 g sliced mushrooms and 1 chopped onion in 1 tbsp butter. Step 2: Sprinkle 1 tbsp flour, stir 1 minute. Step 3: Add 500 ml broth and simmer 10 minutes. Step 4: Blend half the soup for creaminess, stir in 100 ml cream.'),
  -- 15. Minestrone Soup
  (15, 'Step 1: Sauté onion, carrot, celery and garlic in 1 tbsp oil. Step 2: Add 200 g diced potatoes, 400 g canned beans and 1 l broth; simmer 15 minutes. Step 3: Stir in 100 g pasta; cook until al dente. Step 4: Season with salt, pepper and chopped parsley.'),
  -- 16. French Onion Soup
  (16, 'Step 1: Caramelize 4 sliced onions in 2 tbsp butter over low heat, 30 minutes. Step 2: Add 100 ml white wine and reduce. Step 3: Pour in 1 l beef broth, simmer 15 minutes. Step 4: Ladle into bowls, top with toasted bread and grated Gruyère; broil until cheese melts.'),
  -- 17. Chocolate Cake
  (17, 'Step 1: Whisk 200 g flour, 50 g cocoa powder, 1 tsp baking powder and 150 g sugar. Step 2: Beat in 2 eggs, 100 ml milk and 50 ml oil. Step 3: Pour into a greased pan and bake at 180 °C for 30 minutes. Step 4: Cool and frost with chocolate ganache.'),
  -- 18. Apple Pie
  (18, 'Step 1: Toss 6 peeled, sliced apples with 50 g sugar, 1 tsp cinnamon and 1 tbsp flour. Step 2: Line pie dish with pastry, fill with apples and dot with butter. Step 3: Cover with top crust, seal edges and cut vents. Step 4: Bake at 200 °C for 45 minutes.'),
  -- 19. Classic Cheesecake
  (19, 'Step 1: Press 200 g crushed biscuits mixed with 50 g melted butter into a springform pan. Step 2: Beat 500 g cream cheese, 150 g sugar and 2 eggs until smooth. Step 3: Pour over crust and bake at 160 °C for 50 minutes in a water bath. Step 4: Chill before serving.'),
  -- 20. Tiramisu
  (20, 'Step 1: Whisk 3 egg yolks with 75 g sugar until pale, fold in 250 g mascarpone. Step 2: Dip ladyfingers in strong coffee and layer in a dish. Step 3: Spread half the cream, repeat layers. Step 4: Dust with cocoa and chill 4 hours.'),
  -- 21. Caesar Salad
  (21, 'Step 1: Whisk 1 egg yolk, 1 tsp Dijon mustard, 1 clove minced garlic and 2 tbsp lemon juice; slowly stream in 50 ml oil to emulsify. Step 2: Toss torn romaine with dressing, croutons and 30 g Parmesan. Step 3: Season and serve immediately.'),
  -- 22. Greek Salad
  (22, 'Step 1: Chop tomatoes, cucumber, red onion and green peppers. Step 2: Crumble feta and add olives. Step 3: Drizzle with olive oil, splash red wine vinegar and sprinkle oregano. Step 4: Toss gently and serve.'),
  -- 23. Waldorf Salad
  (23, 'Step 1: Cube 2 apples and toss with juice of ½ lemon. Step 2: Mix with 2 stalks sliced celery, 50 g grapes and 30 g walnuts. Step 3: Stir in 3 tbsp mayo and 1 tbsp yogurt. Step 4: Chill before serving.'),
  -- 24. Bruschetta
  (24, 'Step 1: Dice 3 tomatoes and mix with 1 clove minced garlic, 1 tbsp chopped basil and 1 tbsp oil; season. Step 2: Toast slices of baguette, rub with cut garlic clove. Step 3: Spoon tomato mixture on bread and drizzle olive oil.'),
  -- 25. Shrimp Cocktail
  (25, 'Step 1: Boil 500 g shrimp in salted water with a lemon slice until pink, 2–3 minutes; chill in ice water. Step 2: Mix 4 tbsp ketchup, 1 tbsp horseradish, 1 tsp lemon juice and a dash of hot sauce. Step 3: Serve shrimp around sauce in glasses.');

-- 2. Populate DishIngredients for every dish

INSERT INTO DishIngredients (dish_id, ingredient_id, quantity) VALUES
  /* 1. Spaghetti Bolognese */
  (1, (SELECT ingredient_id FROM Ingredients WHERE name = 'Olive oil'),                      1.00),
  (1, (SELECT ingredient_id FROM Ingredients WHERE name = 'Onion (yellow, medium)'),        1.00),
  (1, (SELECT ingredient_id FROM Ingredients WHERE name = 'Garlic (fresh, cloves)'),       2.00),
  (1, (SELECT ingredient_id FROM Ingredients WHERE name = 'Ground beef'),                   1.10),
  (1, (SELECT ingredient_id FROM Ingredients WHERE name = 'Canned tomatoes (diced)'),     400.00),
  (1, (SELECT ingredient_id FROM Ingredients WHERE name = 'Tomato paste'),                  2.00),
  (1, (SELECT ingredient_id FROM Ingredients WHERE name = 'Dried oregano'),                  1.00),
  (1, (SELECT ingredient_id FROM Ingredients WHERE name = 'Dried pasta (spaghetti)'),        7.05),

  /* 2. Grilled Chicken Breast */
  (2, (SELECT ingredient_id FROM Ingredients WHERE name = 'Chicken breast (boneless)'),      2.00),
  (2, (SELECT ingredient_id FROM Ingredients WHERE name = 'Olive oil'),                      2.00),
  (2, (SELECT ingredient_id FROM Ingredients WHERE name = 'Lemon juice (fresh)'),            2.00),
  (2, (SELECT ingredient_id FROM Ingredients WHERE name = 'Salt (table)'),                   1.00),
  (2, (SELECT ingredient_id FROM Ingredients WHERE name = 'Black pepper (ground)'),          0.50),

  /* 3. Beef Steak with Herb Butter */
  (3, (SELECT ingredient_id FROM Ingredients WHERE name = 'Beef steak (ribeye, sirloin, etc.)'), 1.00),
  (3, (SELECT ingredient_id FROM Ingredients WHERE name = 'Vegetable oil'),                    1.00),
  (3, (SELECT ingredient_id FROM Ingredients WHERE name = 'Butter'),                          3.50),
  (3, (SELECT ingredient_id FROM Ingredients WHERE name = 'Dried rosemary (crushed)'),         1.00),
  (3, (SELECT ingredient_id FROM Ingredients WHERE name = 'Garlic (fresh, cloves)'),           1.00),

  /* 4. Salmon Fillet with Lemon Dill Sauce */
  (4, (SELECT ingredient_id FROM Ingredients WHERE name = 'Salmon fillet'),                  12.00),
  (4, (SELECT ingredient_id FROM Ingredients WHERE name = 'Butter'),                          1.00),
  (4, (SELECT ingredient_id FROM Ingredients WHERE name = 'Lemon juice (fresh)'),            1.00),
  (4, (SELECT ingredient_id FROM Ingredients WHERE name = 'Fresh dill (chopped)'),           0.06),
  (4, (SELECT ingredient_id FROM Ingredients WHERE name = 'Heavy cream'),                     0.13),

  /* 5. Vegetable Stir Fry */
  (5, (SELECT ingredient_id FROM Ingredients WHERE name = 'Vegetable oil'),                   1.00),
  (5, (SELECT ingredient_id FROM Ingredients WHERE name = 'Garlic (fresh, cloves)'),          1.00),
  (5, (SELECT ingredient_id FROM Ingredients WHERE name = 'Ginger (ground)'),                 1.00),
  (5, (SELECT ingredient_id FROM Ingredients WHERE name = 'Bell peppers (medium)'),           1.00),
  (5, (SELECT ingredient_id FROM Ingredients WHERE name = 'Broccoli florets'),                1.00),
  (5, (SELECT ingredient_id FROM Ingredients WHERE name = 'Carrots (medium)'),                1.00),
  (5, (SELECT ingredient_id FROM Ingredients WHERE name = 'Soy sauce'),                       2.00),
  (5, (SELECT ingredient_id FROM Ingredients WHERE name = 'Red pepper flakes'),               1.00),

  /* 6. Chicken Curry */
  (6, (SELECT ingredient_id FROM Ingredients WHERE name = 'Onion (yellow, medium)'),          1.00),
  (6, (SELECT ingredient_id FROM Ingredients WHERE name = 'Vegetable oil'),                   1.00),
  (6, (SELECT ingredient_id FROM Ingredients WHERE name = 'Curry powder'),                    1.00),
  (6, (SELECT ingredient_id FROM Ingredients WHERE name = 'Cumin (ground)'),                  1.00),
  (6, (SELECT ingredient_id FROM Ingredients WHERE name = 'Chicken (diced)'),               400.00),
  (6, (SELECT ingredient_id FROM Ingredients WHERE name = 'Canned coconut milk'),              1.67),
  (6, (SELECT ingredient_id FROM Ingredients WHERE name = 'Fresh cilantro (chopped)'),        0.13),

  /* 7. Beef Tacos */
  (7, (SELECT ingredient_id FROM Ingredients WHERE name = 'Ground beef'),                     0.88),
  (7, (SELECT ingredient_id FROM Ingredients WHERE name = 'Taco seasoning'),                  1.00),
  (7, (SELECT ingredient_id FROM Ingredients WHERE name = 'Tortilla'),                        8.00),
  (7, (SELECT ingredient_id FROM Ingredients WHERE name = 'Lettuce (iceberg, shredded)'),     2.00),
  (7, (SELECT ingredient_id FROM Ingredients WHERE name = 'Tomatoes (fresh, medium)'),        1.00),
  (7, (SELECT ingredient_id FROM Ingredients WHERE name = 'Cheddar cheese (shredded)'),       1.00),
  (7, (SELECT ingredient_id FROM Ingredients WHERE name = 'Salsa'),                           2.00),
  (7, (SELECT ingredient_id FROM Ingredients WHERE name = 'Sour cream'),                      0.25),

  /* 8. Mushroom Risotto */
  (8, (SELECT ingredient_id FROM Ingredients WHERE name = 'Onion (yellow, medium)'),          1.00),
  (8, (SELECT ingredient_id FROM Ingredients WHERE name = 'Butter'),                          1.00),
  (8, (SELECT ingredient_id FROM Ingredients WHERE name = 'Arborio rice'),                  200.00),
  (8, (SELECT ingredient_id FROM Ingredients WHERE name = 'White wine'),                     100.00),
  (8, (SELECT ingredient_id FROM Ingredients WHERE name = 'Vegetable broth'),                800.00),
  (8, (SELECT ingredient_id FROM Ingredients WHERE name = 'Mushrooms (fresh)'),             150.00),
  (8, (SELECT ingredient_id FROM Ingredients WHERE name = 'Parmesan cheese (grated)'),        6.00),

  /* 9. Pork Chops with Apple Sauce */
  (9, (SELECT ingredient_id FROM Ingredients WHERE name = 'Pork chops'),                     0.88),
  (9, (SELECT ingredient_id FROM Ingredients WHERE name = 'Salt (table)'),                   1.00),
  (9, (SELECT ingredient_id FROM Ingredients WHERE name = 'Black pepper (ground)'),          0.50),
  (9, (SELECT ingredient_id FROM Ingredients WHERE name = 'Vegetable oil'),                   1.00),
  (9, (SELECT ingredient_id FROM Ingredients WHERE name = 'Apples (medium)'),                2.00),
  (9, (SELECT ingredient_id FROM Ingredients WHERE name = 'Sugar (granulated)'),              0.06),
  (9, (SELECT ingredient_id FROM Ingredients WHERE name = 'Cinnamon (ground)'),               1.00),

  /* 10. Lamb Chops with Rosemary */
  (10, (SELECT ingredient_id FROM Ingredients WHERE name = 'Lamb chops'),                    1.32),
  (10, (SELECT ingredient_id FROM Ingredients WHERE name = 'Olive oil'),                     1.00),
  (10, (SELECT ingredient_id FROM Ingredients WHERE name = 'Salt (table)'),                  1.00),
  (10, (SELECT ingredient_id FROM Ingredients WHERE name = 'Black pepper (ground)'),         0.50),
  (10, (SELECT ingredient_id FROM Ingredients WHERE name = 'Dried rosemary (crushed)'),       1.00),

  /* 11. Vegetarian Lasagna */
  (11, (SELECT ingredient_id FROM Ingredients WHERE name = 'Onion (yellow, medium)'),        1.00),
  (11, (SELECT ingredient_id FROM Ingredients WHERE name = 'Zucchini (medium)'),             1.00),
  (11, (SELECT ingredient_id FROM Ingredients WHERE name = 'Eggplant'),                      1.00),
  (11, (SELECT ingredient_id FROM Ingredients WHERE name = 'Vegetable oil'),                 1.00),
  (11, (SELECT ingredient_id FROM Ingredients WHERE name = 'Tomato sauce'),                  1.63),
  (11, (SELECT ingredient_id FROM Ingredients WHERE name = 'Ricotta cheese'),                1.00),
  (11, (SELECT ingredient_id FROM Ingredients WHERE name = 'Lasagna sheets'),                9.00),
  (11, (SELECT ingredient_id FROM Ingredients WHERE name = 'Mozzarella cheese'),             1.00),

  /* 12. Tomato Soup */
  (12, (SELECT ingredient_id FROM Ingredients WHERE name = 'Onion (yellow, medium)'),        1.00),
  (12, (SELECT ingredient_id FROM Ingredients WHERE name = 'Garlic (fresh, cloves)'),       2.00),
  (12, (SELECT ingredient_id FROM Ingredients WHERE name = 'Vegetable oil'),                  1.00),
  (12, (SELECT ingredient_id FROM Ingredients WHERE name = 'Canned tomatoes (diced)'),      800.00),
  (12, (SELECT ingredient_id FROM Ingredients WHERE name = 'Vegetable broth'),               500.00),
  (12, (SELECT ingredient_id FROM Ingredients WHERE name = 'Heavy cream'),                   0.21),

  /* 13. Chicken Noodle Soup */
  (13, (SELECT ingredient_id FROM Ingredients WHERE name = 'Whole chicken'),                  1.00),
  (13, (SELECT ingredient_id FROM Ingredients WHERE name = 'Water'),                       1500.00),
  (13, (SELECT ingredient_id FROM Ingredients WHERE name = 'Salt (table)'),                   1.00),
  (13, (SELECT ingredient_id FROM Ingredients WHERE name = 'Carrots (medium)'),               2.00),
  (13, (SELECT ingredient_id FROM Ingredients WHERE name = 'Celery (stalks)'),                2.00),
  (13, (SELECT ingredient_id FROM Ingredients WHERE name = 'Onion (yellow, medium)'),         1.00),
  (13, (SELECT ingredient_id FROM Ingredients WHERE name = 'Egg noodles'),                  100.00),

  /* 14. Cream of Mushroom Soup */
  (14, (SELECT ingredient_id FROM Ingredients WHERE name = 'Mushrooms (fresh)'),            200.00),
  (14, (SELECT ingredient_id FROM Ingredients WHERE name = 'Onion (yellow, medium)'),        1.00),
  (14, (SELECT ingredient_id FROM Ingredients WHERE name = 'Butter'),                        1.00),
  (14, (SELECT ingredient_id FROM Ingredients WHERE name = 'All-purpose flour'),            0.06),
  (14, (SELECT ingredient_id FROM Ingredients WHERE name = 'Vegetable broth'),               500.00),
  (14, (SELECT ingredient_id FROM Ingredients WHERE name = 'Heavy cream'),                   0.42),

  /* 15. Minestrone Soup */
  (15, (SELECT ingredient_id FROM Ingredients WHERE name = 'Onion (yellow, medium)'),        1.00),
  (15, (SELECT ingredient_id FROM Ingredients WHERE name = 'Carrots (medium)'),              1.00),
  (15, (SELECT ingredient_id FROM Ingredients WHERE name = 'Celery (stalks)'),               1.00),
  (15, (SELECT ingredient_id FROM Ingredients WHERE name = 'Garlic (fresh, cloves)'),        2.00),
  (15, (SELECT ingredient_id FROM Ingredients WHERE name = 'Potatoes (russet, medium)'),     1.19),
  (15, (SELECT ingredient_id FROM Ingredients WHERE name = 'Kidney beans (canned)'),         1.67),
  (15, (SELECT ingredient_id FROM Ingredients WHERE name = 'Vegetable broth'),              1000.00),
  (15, (SELECT ingredient_id FROM Ingredients WHERE name = 'Dried pasta (spaghetti)'),       3.53),
  (15, (SELECT ingredient_id FROM Ingredients WHERE name = 'Fresh parsley (chopped)'),       0.13),
  (15, (SELECT ingredient_id FROM Ingredients WHERE name = 'Salt (table)'),                   1.00),
  (15, (SELECT ingredient_id FROM Ingredients WHERE name = 'Black pepper (ground)'),         0.50),

  /* 16. French Onion Soup */
  (16, (SELECT ingredient_id FROM Ingredients WHERE name = 'Onion (yellow, medium)'),        4.00),
  (16, (SELECT ingredient_id FROM Ingredients WHERE name = 'Butter'),                        2.00),
  (16, (SELECT ingredient_id FROM Ingredients WHERE name = 'White wine'),                   100.00),
  (16, (SELECT ingredient_id FROM Ingredients WHERE name = 'Beef broth'),                  1000.00),
  (16, (SELECT ingredient_id FROM Ingredients WHERE name = 'Bread slice'),                   4.00),
  (16, (SELECT ingredient_id FROM Ingredients WHERE name = 'Gruyère cheese'),                8.00),

  /* 17. Chocolate Cake */
  (17, (SELECT ingredient_id FROM Ingredients WHERE name = 'All-purpose flour'),             1.67),
  (17, (SELECT ingredient_id FROM Ingredients WHERE name = 'Cocoa powder (unsweetened)'),    8.33),
  (17, (SELECT ingredient_id FROM Ingredients WHERE name = 'Baking powder'),                 1.00),
  (17, (SELECT ingredient_id FROM Ingredients WHERE name = 'Sugar (granulated)'),             0.75),
  (17, (SELECT ingredient_id FROM Ingredients WHERE name = 'Eggs (large)'),                  2.00),
  (17, (SELECT ingredient_id FROM Ingredients WHERE name = 'Milk (whole)'),                  0.42),
  (17, (SELECT ingredient_id FROM Ingredients WHERE name = 'Vegetable oil'),                  3.33),
  (17, (SELECT ingredient_id FROM Ingredients WHERE name = 'Chocolate ganache'),            100.00),

  /* 18. Apple Pie */
  (18, (SELECT ingredient_id FROM Ingredients WHERE name = 'Apples (medium)'),               6.00),
  (18, (SELECT ingredient_id FROM Ingredients WHERE name = 'Sugar (granulated)'),             0.25),
  (18, (SELECT ingredient_id FROM Ingredients WHERE name = 'Cinnamon (ground)'),             1.00),
  (18, (SELECT ingredient_id FROM Ingredients WHERE name = 'All-purpose flour'),             0.06),
  (18, (SELECT ingredient_id FROM Ingredients WHERE name = 'Pie pastry'),                    1.00),
  (18, (SELECT ingredient_id FROM Ingredients WHERE name = 'Butter'),                        1.00),

  /* 19. Classic Cheesecake */
  (19, (SELECT ingredient_id FROM Ingredients WHERE name = 'Digestive biscuits'),          200.00),
  (19, (SELECT ingredient_id FROM Ingredients WHERE name = 'Butter'),                        3.50),
  (19, (SELECT ingredient_id FROM Ingredients WHERE name = 'Cream cheese'),                 17.64),
  (19, (SELECT ingredient_id FROM Ingredients WHERE name = 'Sugar (granulated)'),            0.75),
  (19, (SELECT ingredient_id FROM Ingredients WHERE name = 'Eggs (large)'),                  2.00),

  /* 20. Tiramisu */
  (20, (SELECT ingredient_id FROM Ingredients WHERE name = 'Egg yolks'),                    3.00),
  (20, (SELECT ingredient_id FROM Ingredients WHERE name = 'Sugar (granulated)'),            0.38),
  (20, (SELECT ingredient_id FROM Ingredients WHERE name = 'Mascarpone cheese'),           250.00),
  (20, (SELECT ingredient_id FROM Ingredients WHERE name = 'Ladyfingers'),                 20.00),
  (20, (SELECT ingredient_id FROM Ingredients WHERE name = 'Coffee (strong)'),             100.00),
  (20, (SELECT ingredient_id FROM Ingredients WHERE name = 'Cocoa powder (unsweetened)'),    2.00),

  /* 21. Caesar Salad */
  (21, (SELECT ingredient_id FROM Ingredients WHERE name = 'Egg yolks'),                    1.00),
  (21, (SELECT ingredient_id FROM Ingredients WHERE name = 'Mustard (Dijon)'),              0.33),
  (21, (SELECT ingredient_id FROM Ingredients WHERE name = 'Garlic (fresh, cloves)'),       1.00),
  (21, (SELECT ingredient_id FROM Ingredients WHERE name = 'Lemon juice (fresh)'),          2.00),
  (21, (SELECT ingredient_id FROM Ingredients WHERE name = 'Vegetable oil'),                 3.33),
  (21, (SELECT ingredient_id FROM Ingredients WHERE name = 'Lettuce (romaine, leaves)'),     6.00),
  (21, (SELECT ingredient_id FROM Ingredients WHERE name = 'Croutons'),                      1.00),
  (21, (SELECT ingredient_id FROM Ingredients WHERE name = 'Parmesan cheese (grated)'),      6.00),

  /* 22. Greek Salad */
  (22, (SELECT ingredient_id FROM Ingredients WHERE name = 'Tomatoes (fresh, medium)'),      2.00),
  (22, (SELECT ingredient_id FROM Ingredients WHERE name = 'Cucumber (medium)'),             1.00),
  (22, (SELECT ingredient_id FROM Ingredients WHERE name = 'Onion (red, medium)'),           1.00),
  (22, (SELECT ingredient_id FROM Ingredients WHERE name = 'Bell peppers (medium)'),         1.00),
  (22, (SELECT ingredient_id FROM Ingredients WHERE name = 'Feta cheese'),                   0.50),
  (22, (SELECT ingredient_id FROM Ingredients WHERE name = 'Olives (black or green)'),       0.50),
  (22, (SELECT ingredient_id FROM Ingredients WHERE name = 'Olive oil'),                      2.00),
  (22, (SELECT ingredient_id FROM Ingredients WHERE name = 'Vinegar (red wine)'),             1.00),
  (22, (SELECT ingredient_id FROM Ingredients WHERE name = 'Dried oregano'),                  1.00),

  /* 23. Waldorf Salad */
  (23, (SELECT ingredient_id FROM Ingredients WHERE name = 'Apples (medium)'),               2.00),
  (23, (SELECT ingredient_id FROM Ingredients WHERE name = 'Celery (stalks)'),               2.00),
  (23, (SELECT ingredient_id FROM Ingredients WHERE name = 'Grapes'),                       0.54),
  (23, (SELECT ingredient_id FROM Ingredients WHERE name = 'Walnuts (halves)'),              0.25),
  (23, (SELECT ingredient_id FROM Ingredients WHERE name = 'Mayonnaise'),                    3.00),
  (23, (SELECT ingredient_id FROM Ingredients WHERE name = 'Yogurt'),                        0.06),

  /* 24. Bruschetta */
  (24, (SELECT ingredient_id FROM Ingredients WHERE name = 'Tomatoes (fresh, medium)'),      3.00),
  (24, (SELECT ingredient_id FROM Ingredients WHERE name = 'Garlic (fresh, cloves)'),        1.00),
  (24, (SELECT ingredient_id FROM Ingredients WHERE name = 'Fresh basil leaves'),            0.06),
  (24, (SELECT ingredient_id FROM Ingredients WHERE name = 'Olive oil'),                      2.00),
  (24, (SELECT ingredient_id FROM Ingredients WHERE name = 'Bread slice'),                    4.00),

  /* 25. Shrimp Cocktail */
  (25, (SELECT ingredient_id FROM Ingredients WHERE name = 'Shrimp (peeled, deveined)'),    33.33),
  (25, (SELECT ingredient_id FROM Ingredients WHERE name = 'Water'),                      1000.00),
  (25, (SELECT ingredient_id FROM Ingredients WHERE name = 'Salt (table)'),                  1.00),
  (25, (SELECT ingredient_id FROM Ingredients WHERE name = 'Ketchup'),                       4.00),
  (25, (SELECT ingredient_id FROM Ingredients WHERE name = 'Horseradish'),                   1.00),
  (25, (SELECT ingredient_id FROM Ingredients WHERE name = 'Lemon juice (fresh)'),           0.33),
  (25, (SELECT ingredient_id FROM Ingredients WHERE name = 'Hot sauce'),                     0.25)
;