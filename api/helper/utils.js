const validator = require("validator");
const isEmpty = require("is-empty");

function validateLogin(data) {
  let errors = {};

  //convert empty fields to empty string since validator only works on strings
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  //check for empty strings and store the messages in in error array
  if (validator.isEmpty(data.username))
    errors.username = "Invalid Username";
  if (validator.isEmpty(data.password))
    errors.password = "Invalid Password";

  return { errors, isValid: isEmpty(errors) };
}

module.exports = validateLogin;
