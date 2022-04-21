CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SCHEMA menu;
CREATE SCHEMA carts;
CREATE SCHEMA orders;

CREATE TABLE  public.users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(128) NOT NULL UNIQUE,
  name VARCHAR(256) NOT NULL,
  email VARCHAR(256) NOT NULL UNIQUE,
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
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  cart_id uuid NOT NULL,
  quantity INTEGER CHECK(quantity > 0),
  FOREIGN KEY (product_id) references menu.products(id) ON DELETE CASCADE,
  FOREIGN KEY (cart_id) REFERENCES carts.carts(id) ON DELETE CASCADE
);

CREATE TYPE  orders.state AS ENUM ('NEW', 'PREPARE', 'COOKING', 'READY','FINISHED');

CREATE TABLE  orders.orders(
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  current_state orders.state NOT NULL DEFAULT 'NEW'::orders.state,
  current_state_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  orders.lines(
  id SERIAL PRIMARY KEY,
  order_id uuid NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER CHECK(quantity > 0) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders.orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES menu.products(id) ON DELETE CASCADE
);

CREATE TABLE  orders.states(
  id SERIAL PRIMARY KEY,
  order_id uuid NOT NULL,
  state orders.state NOT NULL DEFAULT 'NEW'::orders.state,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders.orders(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION log_states_fnc()

  RETURNS trigger AS

$$

BEGIN

    INSERT INTO orders.states ("order_id", "state", "created")

         VALUES(NEW."id",NEW."current_state",NEW."current_state_created");



RETURN NEW;

END;

$$

LANGUAGE 'plpgsql';



CREATE TRIGGER log_states

  AFTER UPDATE OF current_state OR INSERT

  ON orders.orders

  FOR EACH ROW

  EXECUTE PROCEDURE log_states_fnc();
