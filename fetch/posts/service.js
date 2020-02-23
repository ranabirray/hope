//@desc Post service
//@access Public
/*
This service handles posts. It uses util finction to handle API request and get data.
It then calls model to insertdata to MongoDB.
*/
const utils = require("../utils/utils.js");
const model = require("./model.js");

module.exports = {
  addPost(req, res) {
    utils
      .callApi("https://jsonplaceholder.typicode.com/posts")
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
        res.sendStatus(400);
      });
  }
};
