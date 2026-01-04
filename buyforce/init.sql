
-- USERS
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  old_price INTEGER,
  category TEXT,
  image_url TEXT
);


-- CARTS
CREATE TABLE IF NOT EXISTS carts (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL
);


-- CART ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER DEFAULT 1
);


-- INITIAL PRODUCTS
INSERT INTO products (name, price, old_price, category, image_url) VALUES
(
  'Espresso Makers and Espresso Machines',
  229,
  459,
  'Home',
  'https://i.pinimg.com/1200x/3a/59/2d/3a592db64767d11dfc360c35a81614f9.jpg'
),
(
  'Tv LG QNED 4K 65"',
  1790,
  1349,
  'Electronics',
  'https://i.pinimg.com/1200x/1c/7c/07/1c7c071f92dfc9d3742d65e90081d356.jpg'
),
(
  'Wireless Headphones',
  999,
  799,
  'Audio',
  'https://i.pinimg.com/736x/a4/f5/f9/a4f5f925a601aeda50c76f4aeb66f4f7.jpg'
),
(
  'Ninja MAX 6-in-1 Grill',
  899,
  599,
  'Home',
  'https://i.pinimg.com/1200x/14/4b/90/144b90e70b52f21c1c277d269d3f0469.jpg'
),
(
  'Jo Malone Perfume',
  99,
  69,
  'Beauty',
  'https://i.pinimg.com/1200x/18/29/66/182966fc59735ffe5d7de64a4c653a36.jpg'
),
(
  'Best Rolling Luggage',
  999,
  799,
  'Travel',
  'https://i.pinimg.com/1200x/35/07/7a/35077a9880a4b0df5f4dcc2f7542b434.jpg'
);
