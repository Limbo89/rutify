const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;
// установка схемы
const MappingScheme = new Schema({
    id_composition: Number,
    id_playlist: Number,
});

module.exports = mongoose.model("Mapping", MappingScheme);