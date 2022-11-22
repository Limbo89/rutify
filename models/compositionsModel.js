const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;
// установка схемы
const CompositionsScheme = new Schema({
    avatar: String,
    composer: String,
    composition: String,
    track: String,
});

module.exports = mongoose.model("Compositions", CompositionsScheme);