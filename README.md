# Teste API

## #1 Test
[Front-end](https://github.com/lucaslollobrigida/food-client)

## Instalation
Check if a instance of MongoDB is running locally or remote.
Check the settings in `.env-example` and update property
Then rename it to `.env` and run:
```
npm i && npm start
```

## Routes

### People

```
GET /people

GET /people/id

POST /people
body {
  "name": "example",
  "email": "example",
  "password": "example",
  "cpf": "example",
  "phone": "example",
  "address": "example"
  }

PUT /people/id
body {
  "name": "example",
  "email": "example",
  "password": "example",
  "cpf": "example",
  "phone": "example",
  "address": "example"
}

DELETE /people/id

PATCH /people/id
body {
  "name": "example"
  }
```

### Discussions

```
GET /discussions

GET /discussions/id

POST /discussions
body {
  "participants": [
    "participant-id",
    "participant-idi"
    ]
  }

PUT /discussions/id
body {
  "participants": [
    "participant-id",
    "participant-id",
    "participant-idi"
    ]
  }

DELETE /discussions/id
```
## Contact
Lucas Rosa Lollobrigida
lucaslollobrigida@gmail.com
