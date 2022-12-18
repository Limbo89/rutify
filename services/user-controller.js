const { render } = require("nunjucks");
const User = require("../models/userModel");

class UserController {
    constructor() {
    }

    async logout(req, res) {
        req.session.destroy;
        console.log('Пользователь успешно вышел из аккаунта!');
        res.redirect("/login");
    }

    async addUser(req, res) {
        User.findOne({ username: req.body.username }, function (err, result) {
            console.log(result);
            if (result === null) {
                if (req.body.password === req.body.passwordConfirm) {
                    const user = new User({ username: req.body.username, password: req.body.password });
                    user.save(function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log('Пользователь успешно создан!');
                        res.redirect("/login");
                    });
                } else {
                    res.render("registration.njk", { status: "Пароли не совпадают!" });
                }
            } else {
                res.render("registration.njk", { status: "Пользователя с таким логином уже существует!" });
            }
        })
    }
    
    async confirmUser(req, res) {
        User.findOne({ username: req.body.username }, function (err, result) {
            if (result === null) {
                res.render("login.njk", { status: "Пользователя с таким логином не существует!" });
            } else {
                if (result.password == req.body.password) {
                    req.session.user = {
                        auth: true,
                        name: result.username
                    }
                    console.log('Пользователь успешно авторизован!');
                    res.redirect("/");
                } else {
                    res.render("login.njk", { status: "Неверный пароль!" });
                }
            }
        })
    }
}

module.exports = UserController;