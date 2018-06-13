const mongodb = require('mongodb');

class MongoDBOperator {
  constructor(mongodb) {}

  find({ condition }) {

  }

  update() {

  }

  upsert() {

  }

  insert() {

  }

  delete() {

  }
}

class DBOperator {
  constructor({ mongodb, leveldb }) {
    this.mongodb = new MongoDBOperator(mongodb);
    this.leveldb = leveldb;
  }
}

module.exports = DBOperator;