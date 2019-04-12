'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const {Expense} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', { session: false });

router.use(jsonParser);


//GET ALL EXPENSES
router.get('/', jwtAuth, (req, res) => {
  console.log(req.params);
  return Expense.find() 
    .then(expenses => res.status(200).json(expenses.map(expense => expense.serialize())))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


//POST NEW EXPENSE
router.post("/", jwtAuth, (req, res) => {
  console.log(req.body);
  const requiredFields = ["description", "note", "amount"];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Missing field",
      location: missingField
    });
  }

  return Expense.create(req.body)
    .then(expense => {
      return res.status(201).json(expense.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client
      if (err.reason === "ValidationError") {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});


router.put("/:id", jwtAuth, jsonParser, (req, res) => {
  const requiredFields = ["description", "note", "amount"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  Expense.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
    .then(expense => res.status(200).json(expense));
});

//DELETE EXPENSE

router.delete("/:id", jwtAuth, jsonParser, (req, res) => {
  return Expense
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});



module.exports = {router};
