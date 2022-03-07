CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SCHEMA menu;
CREATE SCHEMA carts;
CREATE SCHEMA orders;

CREATE TABLE  public.users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(128) NOT NULL,
  name VARCHAR(256) NOT NULL UNIQUE,
  password VARCHAR(256) NOT NULL,
  admin BOOLEAN DEFAULT false
);

CREATE TABLE  menu.categories(
  id SERIAL PRIMARY KEY,
  title VARCHAR(128) UNIQUE NOT NULL
);
CREATE TABLE  menu.products(
  id SERIAL PRIMARY KEY,
  title VARCHAR(128) UNIQUE NOT NULL,
  price INTEGER NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NOT NULL,
  category INTEGER NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES menu.categories (id) ON DELETE CASCADE
);

CREATE TABLE  carts.carts(
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE  carts.lines(
  product_id INTEGER NOT NULL,
  cart_id uuid NOT NULL,
  num_of_products INTEGER CHECK(num_of_products > 0),
  FOREIGN KEY (product_id) references menu.products(id) ON DELETE CASCADE,
  FOREIGN KEY (cart_id) REFERENCES carts.carts(id) ON DELETE CASCADE
);

CREATE TABLE  orders.orders(
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(128) NOT NULL
);
CREATE TABLE  orders.lines(
  product_id INTEGER NOT NULL,
  cart_id uuid NOT NULL,
  num_of_products INTEGER CHECK(num_of_products > 0) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES menu.products(id) ON DELETE CASCADE,
  FOREIGN KEY (cart_id) REFERENCES carts.carts(id) ON DELETE CASCADE
);

CREATE TYPE  orders.state AS ENUM ('NEW', 'PREPARE', 'COOKING', 'READY','FINISHED');
CREATE TABLE  orders.states(
  id SERIAL PRIMARY KEY,
  order_id uuid NOT NULL UNIQUE,
  state orders.state NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders.orders(id) ON DELETE CASCADE
);

