const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;
// установка схемы
const PlaylistScheme = new Schema({
    name: String,
    description: String,
    author: String,
    avatar: String,
});

module.exports = mongoose.model("Playlist", PlaylistScheme);