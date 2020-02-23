//@desc Posts model
/*
This model handles posts request. 
It then calls comments API to handle comments related to posts.
*/
const MongoClient = require("mongodb").MongoClient;
const utils = require("../utils/utils.js");

const posts = {};

posts.add = function (data) {
  return new Promise((resolve, reject) => {
    let na = data.map(function (val, index) {
      let dbname = val.userId;
      let dbUrl = "mongodb://localhost:27017/" + dbname.toString();
      MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;

        utils
          .callApi(
            "https://jsonplaceholder.typicode.com/comments?postId=" + val.id
          )
          .then(result => {
            const dbo = db.db(dbname.toString());

            val["comments"] = result;

            dbo
              .collection("posts")
              .find()
              .toArray(function (err, result) {
                if (err) throw err;

                dbo.collection("posts").insertOne(val, (err, data) => {
                  if (err) {
                    let response = { success: false };
                    reject(JSON.stringify(response));
                  }

                  let response = { success: true };
                  resolve(JSON.stringify(response));
                });
              });
          })
          .catch(error => {
            res.send(400).json({ message: "Try again later" });
          });
      });
    });
  });
};

module.exports = posts;
