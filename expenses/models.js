'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ExpenseSchema = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  amount: {
    type: Number, 
    required: true
  },
  createdAt: {
    type: Date, 
    default: Date.now
  }
});

ExpenseSchema.methods.serialize = function() {
  return {
    description: this.description || '',
    note: this.note || '',
    amount: this.amount || '',
    createdAt: this.createdAt || '',
    id: this._id || ''
  };
};



const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = {Expense};
