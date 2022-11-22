const { render } = require("nunjucks");
const Playlist = require("../models/playlistModel");
const Compositions = require("../models/compositionsModel");
const session = require('express-session');

class MusicController {
    constructor() {

    }
    async mainPage(req, res) {
        Playlist.find({}, (err, result) => {
            if (!err) {
                res.render("index.njk", { playlists: result });
            } else {
                console.log(err);
                res.send(err);
            }
        })
    }
    async deleteTrack(req, res) {
        console.log(req.params.idPlaylist);
        console.log(req.params.idTrack);
    }
    async getPlaylist(req, res) {
        Playlist.findOne({ _id: req.params.id }, (err, result) => {
            if (!err) {
                let allCompositionsInPlaylist = result.compositions;
                Compositions.find({
                    "_id": {
                        $in: allCompositionsInPlaylist
                    }
                }, (err, rows) => {
                    if (!err) {
                        res.render("playlist.njk", { data: rows, id: req.params.id });
                    } else {
                        console.log(err);
                        res.send(err);
                    }
                })
            } else {
                console.log(err);
                res.send(err);
            }
        })
    }
    async getCreatePlaylist(req, res) {
        res.render("playlistCreate.njk");
    }
}

module.exports = MusicController;