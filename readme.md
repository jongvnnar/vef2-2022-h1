# Vefforritun 2, 2022. Hópaverkefni 1: Matarkerfi

## Vefsíða

Verkefnið keyrir á vefsíðunni [https://vef2-2022-h1.herokuapp.com](https://vef2-2022-h1.herokuapp.com)

Notandi að síðu stjórnenda er `admin` og password hans `adminPassword`.

## Höfundar

- Benedikt Aron Ívarsson, [bai3@hi.is](mailto:bai3@hi.is)
  - github: [`Ben-Ivars`](https://github.com/Ben-Ivars)
- Björn Borgar Magnússon, [bbm5@hi.is](mailto:bbm5@hi.is)
  - github: [`BearPays`](https://github.com/BearPays)
- Fannar Steinn Aðalsteinsson, [fsa3@hi.is](mailto:fsa3@hi.is)
  - github: [`fsa3`](https://github.com/fsa3)
- Jón Gunnar Hannesson, [ jgh12@hi.is](mailto:jgh12@hi.is)
  - github: [`jongvnnar`](https://github.com/jongvnnar)

## Keyrsla

Dæmi um .env skrá sem þarf að hafa til að hægt sé að keyra forritið:

```
DATABASE_URL=postgres://:@localhost/vef2_h1
JWT_SECRET=kldkfaKW#JKQ"%#KLJ#LKQASDFjzlksdfjklajdlkajl
TOKEN_LIFETIME=10000
PORT=3000
BCRYPT_ROUNDS=12
CLOUDINARY_URL=cloudinary://293432196917864:_xCctAOa3zSBNjwcfJ-80j8ZiSA@doq8yuvyt
```

ATH: notandi á gagnagrunn verður að vera með CREATE role fyrir gagnagrunninn svo uuid virki.

Til að keyra verkefni:

```
createdb vef2_h1
npm install
npm run setup
npm start
```

## Lint og prettier

Eslint er sett upp, hægt að keyra með:

```
npm run lint
```

Prettier er einnig sett upp. Hægt er að keyra með:

```
npm run prettier
```

## Test

Dæmi um .env.test skrá sem þarf að vera til staðar til þess að keyra test:

```
DATABASE_URL=postgres://:@localhost/vef2_h1_test
JWT_SECRET=kldkfaKW#JKQ"%#KLJ#LKQASDFjzlksdfjklajdlkajl
TOKEN_LIFETIME=3600
PORT=8020
BCRYPT_ROUNDS=12
CLOUDINARY_URL=cloudinary://293432196917864:_xCctAOa3zSBNjwcfJ-80j8ZiSA@doq8yuvyt
ADMIN_USER=admin
ADMIN_PASS=adminPassword
TEST_USER=jon
TEST_PASS=password
```

Test eru keyrð með:

```
createdb vef2_h1_test
npm run setup-test
#Eftirfarandi keyrt í öðru terminal
npm test
```

## Nokkur dæmi um köll með cURL

### Að sækja matseðil

```
curl --location --request GET 'https://vef2-2022-h1.herokuapp.com/menu'
```

### Innskráning admin

```
curl --location --request POST 'https://vef2-2022-h1.herokuapp.com/users/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "admin",
    "password": "adminPassword"
}'
```

### Innskráning uppsetts notanda

```
curl --location --request POST 'https://vef2-2022-h1.herokuapp.com/users/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "borgar",
    "password": "password"
}'
```

### Að skrá nýjan notanda

```
curl --location --request POST 'https://vef2-2022-h1.herokuapp.com/users/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Jonas",
    "username": "jonas",
    "password": "password"
}'
```

### Að búa til nýja körfu

```
curl --location --request POST 'https://vef2-2022-h1.herokuapp.com/cart'
```

### Að bæta við nýrri línu í körfu

```
curl --location --request POST 'https://vef2-2022-h1.herokuapp.com/cart/f811f9d0-e860-41c4-adb9-e6339f404c27' \
--header 'Content-Type: application/json' \
--data-raw '{
    "product": 12,
    "quantity": 3
}'
```

### Að búa til pöntun útfrá körfu

```
curl --location --request POST 'https://vef2-2022-h1.herokuapp.com/orders' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Pöntun",
    "cart": "f811f9d0-e860-41c4-adb9-e6339f404c27"
}'
```

### Dæmi um endapunkta þar sem notandi þarf að vera loggaður inn

#### Búa til nýjan rétt á matseðli

```
curl --location --request POST 'https://vef2-2022-h1.herokuapp.com/menu' \
--header 'Authorization: Bearer YOUR_TOKEN' \
--form 'title="Steak"' \
--form 'price="12345"' \
--form 'description="Jucy steak"' \
--form 'image=@"PATH_TO_IMAGE"' \
--form 'category="1"'
```

#### Uppfæra stöðu pöntunnar

```
curl --location --request POST 'https://vef2-2022-h1.herokuapp.com/orders/e7b2a445-aa01-4166-b675-d4c0934b32b0/status' \
--header 'Authorization: Bearer YOUR_TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{"status":"PREPARE"}'
```

## Websocket

- Logga sig inn á WS fyrir admin

  - `ws://vef2-2022-h1.herokuapp.com/admin`
  - Header `Authorization: Bearer YOUR_TOKEN`

- Tengjast WS fyrir client
  - `ws://vef2-2022-h1.herokuapp.com/orders/e7b2a445-aa01-4166-b675-d4c0934b32b0`
