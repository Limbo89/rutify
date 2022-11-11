const express = require('express');
const Router = express.Router();
const controller = require("../services/user-controller");

const UserController = new controller();

class User {
    constructor() {
        Router.get("/logout", this.logout);
        Router.post("/registration", this.regUser);
        Router.post("/authorization", this.authUser);
    }
    async logout(req, res) {
        UserController.logout(req, res);
    }
    async regUser(req, res) {
        UserController.addUser(req, res);
    }
    async authUser(req, res) {
        UserController.confirmUser(req, res);
    }
}

new User();
module.exports = Router;