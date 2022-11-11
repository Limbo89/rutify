const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;
// установка схемы
const userScheme = new Schema({
    username: String,
    password: String,
    email: String,
});

module.exports = mongoose.model("User", userScheme);