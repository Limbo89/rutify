const { render } = require("nunjucks");
const Playlist = require("../models/playlistModel");
const Compositions = require("../models/compositionsModel");

class MusicController {
    constructor() {

    }
    async mainPage(req, res) {
        Playlist.find({ author: "system" }, (err, resultSystem) => {
            let dataTemplate;
            let sess = req.session;
            if (!err) {
                Playlist.find({ author: req.session.user.name }, (err, resultUser) => {
                    Playlist.findOne({ viewer: sess.user.name }, (err, resultViewer) => {
                        // console.log(resultViewer);
                        if (!resultUser) {
                            dataTemplate = {
                                "systemPlaylists": resultSystem,
                            };
                        } else {
                            if (resultViewer === null) {
                                dataTemplate = {
                                    "systemPlaylists": resultSystem,
                                    "userPlaylists": resultUser,
                                };
                            } else {
                                dataTemplate = {
                                    "systemPlaylists": resultSystem,
                                    "userPlaylists": resultUser,
                                    "viewerPlaylists": [resultViewer],
                                };
                            }
                        }
                        res.render("index.njk", { dataTemplate: dataTemplate });
                    });
                });
            } else {
                console.log(err);
                res.send(err);
            }
        })
    }
    async deleteTrack(req, res) {
        let idPlaylist = req.body.idPlaylist;
        let idTrack = req.body.idTrack;
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
    async playlistDelete(req, res) {
        let playlistId = req.body.idPlaylist;
        Playlist.deleteOne({ _id: playlistId }, (err) => {
            if (!err) {
                res.redirect("/music");
            } else {
                console.log(err);
                res.send(err);
            }
        });
    }
    async getPlaylist(req, res) {
        let sess = req.session;
        let user = sess.user.name;
        Playlist.findOne({ _id: req.params.id }, (err, result) => {
            if (!err) {
                let allCompositionsInPlaylist = result.compositions;
                Compositions.find({
                    "_id": {
                        $in: allCompositionsInPlaylist
                    }
                }, (err, rows) => {
                    if (!err) {
                        if (user == result.author || result.viewer.includes(user) || result.author == "system") {
                            let permission; // Разрешение на редактирование плейлиста
                            if (result.author == "system" || user !== result.author) {
                                permission = false;
                            } else {
                                permission = true;
                            }
                            res.render("playlist.njk", { data: rows, id: req.params.id, permission });
                        } else {
                            console.log("пиздец");
                        }
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
        // let _status = req.body.status;
        let _status = false;
        let _name = req.body.name;
        let _description = req.body.description;
        let _compositions = req.body.tracks;
        let _author = req.session.user.name;
        const playlist = new Playlist({ author: _author, avatar: avatarPath, description: _description, name: _name, compositions: _compositions, private: _status });
        playlist.save(function (err) {
            if (err) {
                return console.log(err);
            }
            res.redirect("/music");
        });
    }
}

module.exports = MusicController;