//@desc User Model
//@access Public

/* 
This model handles db transactions related to user.
*/
const { getDb } = require("../loader/db");

const user = {};

user.add = function (data) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    let newData = data.map(function (val, index) {
      const pwd = Math.floor(100000 + Math.random() * 900000);
      val["password"] = pwd;
      if (index < 2) val["role"] = "admin";
      else val["role"] = "viewer";

      return val;
    });

    db.collection("users").insertMany(newData, (err, result) => {
      if (err) {
        let response = { success: false };
        reject(JSON.stringify(response));
      }

      let response = { success: true };
      resolve(JSON.stringify(response));
    });
  });
};

module.exports = user;
