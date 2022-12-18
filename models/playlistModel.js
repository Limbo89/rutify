const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;
// установка схемы
const PlaylistScheme = new Schema({
    name: String,
    description: String,
    author: String,
    avatar: String,
    compositions: Array,
    private: Boolean,
    viewer: Array,
});
module.exports = mongoose.model("Playlist", PlaylistScheme);