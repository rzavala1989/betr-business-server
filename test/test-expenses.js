const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { Expense } = require('../expenses');
const { User } = require('../users');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/expense', () => {
    const description = 'descriptionExample';
    const note = 'noteExample';
    const amount = 333.33;
    const createdAt = 1234;
    const username = 'userExample';
    const password = 'passwordExample';
    const firstName = 'Example';
    const lastName = 'User';
  
    before(() => {
      return runServer(TEST_DATABASE_URL);
    });
  
    after(() => {
      return closeServer();
    });
  
    beforeEach(() => {
      return User.hashPassword(password).then(password =>
        User.create({
          username,
          password,
          firstName,
          lastName
        })
      );
    });
  
    afterEach(() => {
      return User.remove({});
    });

    describe('/api/expenses', () => {
        const token = jwt.sign(
          {
            user: {
              username,
              firstName,
              lastName
            }
          },
          JWT_SECRET,
          {
            algorithm: 'HS256',
            subject: username,
            expiresIn: '7d'
          }
        );
        describe('GET', () => {
            it('Should return an empty array at first', () => {
      
              return chai.request(app)
              .get('/api/expenses')
              .set('authorization', `Bearer ${token}`)
              .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length(0);
              });
            });
          });
          describe('POST', () => {
            it('Should return a newly created expense', () => {
              return chai
                .request(app)
                .post('/api/expenses')
                .set('authorization', `Bearer ${token}`)
                .send({ description, note, amount, createdAt})
                .then(res => {
                  expect(res).to.have.status(201);
                  expect(res.body).to.be.an('object');
                  const description = res.body.description;
                  const note = res.body.note;
                  const amount = res.body.amount;
                  expect(description).to.be.a("string");
                  expect(note).to.be.a("string");
                  expect(amount).to.be.a("number");
                });
            });
            it('Should reject expense with missing description', () => {
                return chai
                  .request(app)
                  .post('/api/expenses')
                  .set('authorization', `Bearer ${token}`)
                  .send({
                    note, 
                    amount,
                    createdAt
                  })
                  .then(() =>
                    expect.fail(null, null, 'Request should not succeed')
                  )
                  .catch(err => {
                    if (err instanceof chai.AssertionError) {
                      throw err;
                    }
        
                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing field');
                    expect(res.body.location).to.equal('description');
                  });
              });
              it('Should reject expenses with missing note', () => {
                return chai
                  .request(app)
                  .post('/api/expenses')
                  .set('authorization', `Bearer ${token}`)
                  .send({
                   description, 
                    amount,
                    createdAt, 
                  })
                  .then(() =>
                    expect.fail(null, null, 'Request should not succeed')
                  )
                  .catch(err => {
                    if (err instanceof chai.AssertionError) {
                      throw err;
                    }
        
                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing field');
                    expect(res.body.location).to.equal('note');
                  });
              });
              it('Should reject expense with missing amount', () => {
                return chai
                  .request(app)
                  .post('/api/expenses')
                  .set('authorization', `Bearer ${token}`)
                  .send({
                    description,
                    note,
                    createdAt
                  })
                  .then(() =>
                    expect.fail(null, null, 'Request should not succeed')
                  )
                  .catch(err => {
                    if (err instanceof chai.AssertionError) {
                      throw err;
                    }
        
                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing field');
                    expect(res.body.location).to.equal('amount');
                  });
              });
              
        
            describe('PUT', () => {
              it("it should update an expense given the id", () => {
                const updateData = { 
                  description: "Travel", 
                  note: "Plane ticket to Los Angeles", 
                  amount: 400.99,  
                };
        
                return Expense
                  .findOne()
                  .then((expense) => {
                    updateData.id = expense.id;
        
                    // make request then inspect it to make sure it reflects
                    // data we sent
                    return chai
                      .request(app)
                      .put(`/api/expenses/${expense.id}`)
                      .set("authorization", `Bearer ${token}`)
                      .send(updateData);
                  })
                  .then(res => {
                    expect(res).to.have.status(200);
        
                    return Expense.findById(updateData.id);
                  })
                  .then(function(expense) {
                    expect(expense.description).to.equal(updateData.description);
                    expect(expense.note).to.equal(updateData.note);
                    expect(expense.amount).to.equal(updateData.amount);
                  });
              });
            });
        
            describe('DELETE', () => {
              it('it should DELETE an expense given the id', () => {
                let expense;
        
                return Expense
                  .findOne()
                  .then(_expense => {
                    expense = _expense;
                    return chai
                    .request(app)
                    .delete(`/api/expenses/${expense.id}`)
                    .set('authorization', `Bearer ${token}`);
                  })
                  .then(res => {
                    expect(res).to.have.status(204);
                    return Expense
                    .findById(expense.id);
                  })
                  .then(_expense => {
                    expect(_expense).to.be.null;
                  });
              });
            });
        
        });
    });
});
    
        
