//@desc User service
//@access Public

/* *This service calls util function to handle https request and get data.
It then calls model to insert data into MongoDB.
*/
const utils = require("../utils/utils.js");
const model = require("./model.js");

module.exports = {
  addUser(req, res) {
    utils
      .callApi("https://jsonplaceholder.typicode.com/users")
      .then(result => {
        model
          .add(result)
          .then(result => {
            const parsedResult = JSON.parse(result);
            res.status(200).json({ success: parsedResult.success });
          })
          .catch(error => {
            const parsedError = JSON.parse(result);
            res.status(400).json({ success: parsedError.success });
          });
      })
      .catch(error => {
        res.send(400).json({ message: "Try again later" });
      });
  }
};
