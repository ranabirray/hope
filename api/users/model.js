//@desc User Model
const ObjectID = require("mongodb").ObjectID;
const { getDb } = require("../loader/db");
const MongoClient = require("mongodb").MongoClient;

const user = {};
allposts = [];

//@desc fetch user detail using username,password
user.authenticate = function (username, password) {
    return new Promise(function (resolve, reject) {
        const db = getDb();
        const query = [
            { $match: { username: username, password: password } }
        ];
        db.collection("users")
            .aggregate(query)
            .toArray(function (err, result) {
                if (err) {
                    let response = { success: false };
                    reject(JSON.stringify(response));
                }

                resolve(JSON.stringify(result));
            });
    });
};

//@desc fetch user detail using _id
user.findById = function (id) {
    return new Promise(function (resolve, reject) {
        const db = getDb();

        const query = { id: { $eq: parseInt(id) } };

        db.collection("users")
            .find(query)
            .toArray(function (err, result) {
                if (err) {
                    let response = { success: false };
                    reject(JSON.stringify(response));
                }
                let response = { success: true, data: result };
                resolve(JSON.stringify(response));
            });
    });
};

//@desc fetch user posts
user.findUserPosts = function (id) {
    return new Promise(function (resolve, reject) {
        let dbUrl = "mongodb://localhost:27017/" + id;
        MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err;

            const dbo = db.db(id.toString());

            dbo
                .collection("posts")
                .find()
                .toArray(function (err, result) {
                    if (err) {
                        let response = { success: false };
                        reject(JSON.stringify(response));
                    }
                    let response = { success: true, data: result };
                    resolve(JSON.stringify(response));
                });

        });
    });
};

//@get user list
user.listUser = function () {
    return new Promise(function (resolve, reject) {
        const db = getDb();

        db.collection("users")
            .find()
            .toArray(function (err, result) {
                if (err) {
                    let response = { success: false };
                    reject(JSON.stringify(response));
                }

                let response = { success: true, data: result };
                resolve(JSON.stringify(response, null, 10));
            });
    });
};

module.exports = user;
