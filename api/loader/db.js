const assert = require("assert");
const client = require("mongodb").MongoClient;
const config = require("../config/dbconfig");

let _db;

module.exports = {
  initDb(callback) {
    if (_db) return callback(null, _db);
    var connectionString = config.dbstring;
    client.connect(
      connectionString,
      { useNewUrlParser: true, useUnifiedTopology: true },
      connected
    );

    function connected(err, db) {
      if (err) {
        return callback(err);
      }
      console.log("DB initialized");
      const dbCon = db.db();
      _db = dbCon;
      return callback(null, _db);
    }
  },
  getDb() {
    assert.ok(_db, "Database is not connected. Please called init first.");
    return _db;
  }
};
