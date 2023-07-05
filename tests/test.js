const index = require('../index');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/', index);

test('index route works', done => {
  request(app)
    .get('/')
    .expect('Content-Type', /json/)
    .expect({ name: "frodo "})
    .expect(200, done);
});

test('testing route works', done => {
  request(app)
    .post('/test')
    .type('form')
    .send({ item: "hey" })
    .then(() => {
      request(app)
        .get('/test')
        .expect({ array: ["hey"]}, done);
    });
});

// Example of testing with in-memory db
const {MongoClient} = require('mongodb');

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(globalThis.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');

    const mockUser = {_id: 'some-user-id', name: 'John'};
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({_id: 'some-user-id'});
    expect(insertedUser).toEqual(mockUser);
  });
});

