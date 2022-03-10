INSERT INTO users (id, name, username, password, admin) VALUES (1, 'Addi', 'admin', '$2b$12$PHNN.XXbFJb.2UVvgYE7q.uwjULI8hoE7oHH100yaDh/FBq46MY8G', true);
INSERT INTO users (id, name, username, password) VALUES (2, 'Jón', 'jon', '$2b$12$dPBhkw2H.FWPWflgPUvnSOg0jJEmzUPiadaseJL/f77EdGZx6F9ay');
INSERT INTO users (id, name, username, password) VALUES (3, 'Benni', 'benni', '$2b$12$dPBhkw2H.FWPWflgPUvnSOg0jJEmzUPiadaseJL/f77EdGZx6F9ay');
INSERT INTO users (id, name, username, password) VALUES (4, 'Boggi', 'borgar', '$2b$12$dPBhkw2H.FWPWflgPUvnSOg0jJEmzUPiadaseJL/f77EdGZx6F9ay');
INSERT INTO users (id, name, username, password) VALUES (5, 'Fannar', 'fannar', '$2b$12$dPBhkw2H.FWPWflgPUvnSOg0jJEmzUPiadaseJL/f77EdGZx6F9ay');
ALTER SEQUENCE "users_id_seq" RESTART WITH 6;

INSERT INTO menu.categories (title) VALUES ('mains');
INSERT INTO menu.categories (title) VALUES ('sides');
INSERT INTO menu.categories (title) VALUES ('drinks');
INSERT INTO menu.categories (title) VALUES ('appetizers');
INSERT INTO menu.categories (title) VALUES ('desserts');

INSERT INTO menu.products (title, price, description, category, image) VALUES ('Vegan Peanut Steak',5390, 'We make the steak from scratch from nuts, beans and seasonal vegetables. Served with vegetables and green pesto', 1,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Grilled Cauliflower',4890, 'Creamy barley, grapes, coriander, wasabi beans and satay sauce', 1,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Duck Salat',4990, 'Confit duck, spinach, mandarins and mint dressing', 1,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Lightly Salted Cod',6290, 'Grilled apple puree, lobster salad, black garlic and shellfish sauce', 1,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Butcher Steak',6790, 'Grilled flank steak with shishito pepper in wasabi nuts and lemon oil, kimchi and truffle-yuzu dressing', 1,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Beef Tenderloin',7490, '250 gr. Beef tenderloin served on a wooden plate with Grillmarked french fries, lightly fried vegetables and mushroom glaze', 1,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Beef Ribeye',7391, '300 gr. Beef Rib eye served on a wooden plate with Grillmarkaður french fries, lightly fried vegetables and mushroom glaze', 1,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Robota Grilled Salmon',5690, 'Miso marinated salmon, bok choy, crispy quinoa and garlic teryaki', 1,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Horse Tenderloin',7690, '250 gr. Horse tenderloin served with Grillmarket fries, pan fried vegetables and mushroom glaze.', 1,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Grilled Lamb Chops',6990, 'Crispy potatoes, glazed carrots and spiced nut crumble', 1,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Tomahawk Steak',14990, '800gr Tomahawk is a rib eye on a bone and is a steak from the front spine, perfectly fat blasted which gives the steak the perfect taste', 1,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Porterhouse',15990, '1000gr Beef Porterhouse is a cut from the short loin and thus includes the tenderloin. The bone which separates these muscles gives the steak its divine flavour', 1,'/');

INSERT INTO menu.products (title, price, description, category, image) VALUES ('Bearnaise Sauce',790, 'Lovely bearnaise :)', 2,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Garlic Sauce',790, 'Horrid garlic sauce :(', 2,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Potato Purée',1490, 'Puréed potatoes from Deplar farm', 2,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Pan Fried Vegetables',1490, 'Kale, carrots, mushrooms and parsley root', 2,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Green Salad',1490, 'kale, pickled onions and carrots', 2,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Fried Mushrooms',1490, 'Chestnut mushrooms, oyster mushrooms and garlic', 2,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Grilled Corn Cob',15990, 'With Icelandic herb butter', 2,'/');

INSERT INTO menu.products (title, price, description, category, image) VALUES ('Chocolate Tart',3190, 'Toffee filled chocolate cake served with salted caramel ice cream', 5,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('The Grillmarket Chocolate',3290, 'Mascarpone mousse, warm caramel and coffee ice cream', 5,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Homemade Ice Cream Bliss',2890, 'Four types of ice cream and sorbet that the kitchen chooses. Fresh and good after dinner', 5,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Warm "Ástarpungar"',2890, 'Freshly baked doughnut balls , dulche de leche caramel and lemon', 5,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Dessert Platter',7990, 'A selection of our desserts along with exotic fruits, ice cream and sorbet', 5,'/');

INSERT INTO menu.products (title, price, description, category, image) VALUES ('Beef Carpaccio',3770, 'Chili jam, sweet almonds, herb pesto and ruccola salad', 4,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Tiger Shrimp Tempura',3680, 'Kimchi, lemon and yuzu dressing', 4,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Langoustine Tempura',4590, 'Beer batter, chili mayonnaise, oats and roasted garlic', 4,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Smoked Arctic Char',3440, 'Lightly smoked artic char, crispy spiced bread, pickled fennel and mustard sauce', 4,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Duck Salad',3390, 'Confit duck, spinach, mandarins and mint dressing. 1/2 portion.', 4,'/');

INSERT INTO menu.products (title, price, description, category, image) VALUES ('Sweet Black Death', 2990, 'Dill infused Brennivín, blueberry liquor, egg white', 3,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Jalapeno Margarita', 2990, 'Tequila, Grand Marnier, Jalapeno & Pineapple', 3,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Blueberry Dream', 2790, 'Ólafsson Gin, blueberry 64°, elderflower, port wine, egg white', 3,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Cocktail of the Week', 2390, 'Ask your server', 3,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Thirsty Rabbit', 2990, 'Bourbon, carrot mix, banana liquor', 3,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Rose Kiss', 2890, 'Amagin, chambord, red wine rasperry puree, rose prosecco', 3,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('African Wildlife', 2990, 'Elephant sloe gin, apple liquor, banana and egg white', 3,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Wild Wild West', 2790, 'Honey Jack Daniels, Salted Caramel, Fresh Lemon & Lemon Bitters', 3,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Basil Hendrick''s', 2990, 'Hendrick''s Gin, Basil, Lime & Sparkling Wine', 3,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Peach Perfect', 2890, 'Drambue, Peach Liquor, Elderflower, Cherry Heering & Lime', 3,'/');
INSERT INTO menu.products (title, price, description, category, image) VALUES ('Green Is Good', 2790, 'Woodford Reserve, Apple Liquor, Basil, Lemon & Green Apples', 3,'/');

INSERT INTO carts.carts (id) VALUES ('f811f9d0-e860-41c4-adb9-e6339f404c27');
INSERT INTO carts.carts (id) VALUES ('8b3f8a13-af8c-4fcb-b965-b53a7fd4019b');

INSERT INTO carts.lines (product_id, cart_id, quantity) VALUES (36, 'f811f9d0-e860-41c4-adb9-e6339f404c27', 1);
INSERT INTO carts.lines (product_id, cart_id, quantity) VALUES (5, 'f811f9d0-e860-41c4-adb9-e6339f404c27', 1);
INSERT INTO carts.lines (product_id, cart_id, quantity) VALUES (2, 'f811f9d0-e860-41c4-adb9-e6339f404c27', 1);

INSERT INTO carts.lines (product_id, cart_id, quantity) VALUES (6, '8b3f8a13-af8c-4fcb-b965-b53a7fd4019b', 1);
INSERT INTO carts.lines (product_id, cart_id, quantity) VALUES (9, '8b3f8a13-af8c-4fcb-b965-b53a7fd4019b', 1);
INSERT INTO carts.lines (product_id, cart_id, quantity) VALUES (30, '8b3f8a13-af8c-4fcb-b965-b53a7fd4019b', 1);

INSERT INTO orders.orders (id, name) VALUES ('b9e8ba22-96ea-4ef7-8c52-272fad6d76f1', 'Pöntun 1');
INSERT INTO orders.orders (id, name) VALUES ('e7b2a445-aa01-4166-b675-d4c0934b32b0', 'Pöntun 2');
UPDATE orders.orders SET current_state = 'PREPARE', current_state_created = NOW() WHERE id = 'b9e8ba22-96ea-4ef7-8c52-272fad6d76f1';
UPDATE orders.orders SET current_state = 'COOKING', current_state_created = NOW() WHERE id = 'b9e8ba22-96ea-4ef7-8c52-272fad6d76f1';

INSERT INTO orders.lines (order_id, product_id, cart_id, quantity) VALUES ('b9e8ba22-96ea-4ef7-8c52-272fad6d76f1',36, 'f811f9d0-e860-41c4-adb9-e6339f404c27', 1);
INSERT INTO orders.lines (order_id, product_id, cart_id, quantity) VALUES ('b9e8ba22-96ea-4ef7-8c52-272fad6d76f1',5, 'f811f9d0-e860-41c4-adb9-e6339f404c27', 1);
INSERT INTO orders.lines (order_id, product_id, cart_id, quantity) VALUES ('b9e8ba22-96ea-4ef7-8c52-272fad6d76f1',2, 'f811f9d0-e860-41c4-adb9-e6339f404c27', 1);

INSERT INTO orders.lines (order_id, product_id, cart_id, quantity) VALUES ('e7b2a445-aa01-4166-b675-d4c0934b32b0',6, '8b3f8a13-af8c-4fcb-b965-b53a7fd4019b', 1);
INSERT INTO orders.lines (order_id, product_id, cart_id, quantity) VALUES ('e7b2a445-aa01-4166-b675-d4c0934b32b0',9, '8b3f8a13-af8c-4fcb-b965-b53a7fd4019b', 1);
INSERT INTO orders.lines (order_id, product_id, cart_id, quantity) VALUES ('e7b2a445-aa01-4166-b675-d4c0934b32b0',30, '8b3f8a13-af8c-4fcb-b965-b53a7fd4019b', 1);
