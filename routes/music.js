const express = require('express');
const Router = express.Router();
const controller = require("../services/music-controller");

const MusicController = new controller();

class Music {
    constructor() {
        Router.get("/", this.main);
        Router.get("/playlistCreate", this.getCreatePlaylist);
        Router.get("/playlist/:id", this.viewPlaylist);
        Router.get("/playlistUpdate/:id",);
        Router.post("/playlist/playlistTrack/delete", this.deleteTrackInPlaylist);
        Router.post("/playlistDelete", this.playlistDelete);
        Router.post("/playlistCreate", this.postCreatePlaylist);
    }
    async main(req, res) {
        MusicController.mainPage(req, res);
    }
    async getCreatePlaylist(req, res) {
        MusicController.getCreatePlaylist(req, res);
    }
    async viewPlaylist(req, res) {
        MusicController.getPlaylist(req, res);
    }
    async deleteTrackInPlaylist(req, res) {
        MusicController.deleteTrack(req, res);
    }
    async postCreatePlaylist(req, res) {
        MusicController.postCreatePlaylist(req, res);
    }
    async playlistDelete(req, res) {
        MusicController.playlistDelete(req, res);
    }
}

new Music();
module.exports = Router;