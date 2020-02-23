const https = require("https");

module.exports = {
  callApi: function(url) {
    return new Promise((resolve, reject) => {
      let response = "";
      https
        .get(url, res => {
          res.on("data", data => {
            response += data;
          });
          res.on("end", () => {
            resolve(JSON.parse(response));
          });
        })
        .on("error", error => {
          reject(error);
        });
    });
  }
};
