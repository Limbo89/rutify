const { render } = require("nunjucks");
const Playlist = require("../models/playlistModel");
const Compositions = require("../models/compositionsModel");
const session = require('express-session');

class MusicController {
    constructor() {

    }
    async mainPage(req, res) {
        Playlist.find({ author: "system" }, (err, resultSystem) => {
            let dataTemplate;
            if (!err) {
                Playlist.find({ author: req.session.user.name }, (err, resultUser) => {
                    if (!resultUser) {
                        dataTemplate = {
                            "systemPlaylists": resultSystem,
                        };
                    } else {
                        dataTemplate = {
                            "systemPlaylists": resultSystem,
                            "userPlaylists": resultUser,
                        };
                    }
                    res.render("index.njk", { dataTemplate });
                });
            } else {
                console.log(err);
                res.send(err);
            }
        })
    }
    async deleteTrack(req, res) {
        let idPlaylist = req.params.idPlaylist;
        let idTrack = req.params.idTrack;
        Playlist.updateOne({ _id: idPlaylist }, {
            $pullAll: {
                compositions: [idTrack],
            },
        }, (err) => {
            if (!err) {
                res.redirect("/music/playlist/" + idPlaylist);
            } else {
                res.send(err);
                console.log(err);
            }
        });
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
                        let permission; // Разрешение на редактирование плейлиста
                        if (result.author == "system") {
                            permission = false;
                        } else {
                            permission = true;
                        }
                        res.render("playlist.njk", { data: rows, id: req.params.id, permission });
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
        Compositions.find({}, (err, result) => {
            if (!err) {
                res.render("playlistCreate.njk", { data: result });
            } else {
                console.log(err);
            }
        })
    }
    async postCreatePlaylist(req, res) {
        let avatarPath;
        if (req.files) {
            avatarPath = "static/media/avatars/" + req.files.avatar.name;
            req.files.avatar.mv(avatarPath, (err) => {
                console.log(err);
            });
            avatarPath = "media/avatars/" + req.files.avatar.name;
        } else {
            avatarPath = "media/avatars/default.png";
        }
        let _name = req.body.name;
        let _description = req.body.description;
        let _compositions = req.body.tracks;
        let _author = req.session.user.name;
        const playlist = new Playlist({ author: _author, avatar: avatarPath, description: _description, name: _name, compositions: _compositions });
        playlist.save(function (err) {
            if (err) {
                return console.log(err);
            }
            console.log('Плейлист успешно создан!');
            res.redirect("/music");
        });
    }
}

module.exports = MusicController;