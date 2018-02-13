const request = require('supertest')

describe('[SERVER] Express Test', () => {

  const api = request('http://localhost:3000')

  it("Should load '/' server route",  (done) => {
    api.get('/')
      .expect(200, done)
  });

  it("Should load '/users' server route",  (done) => {
    api.get('/users')
      .expect(200, done)
  });

  it("Should load '/users/:id' server route",  (done) => {
    api.get('/users/xxxxx')
      .expect(200, done)
  });
})
