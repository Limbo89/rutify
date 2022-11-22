const express = require('express');
const app = express();
const session = require('express-session');
const PORT = 3000;
const Music = require("./routes/music");
const User = require('./routes/user');
const njk = require('nunjucks');
const mongoose = require('mongoose');

njk.configure('templates', {
    autoescape: true,
    express: app
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

function randKey() {
    let abc = "qwertyuiop[]\asdfghjkl;'zxcvbnm,./!@#$%^&*()_+1234567890-=`~*";
    let rs = "";
    while (rs.length < 100) {
        rs += abc[Math.floor(Math.random() * abc.length)];
    };
    return rs;
};

app.use(
    session({
        secret: randKey(),
        resave: true,
        saveUninitialized: true,
    })
);
app.get("/registration", (req, res) => {
    res.render("registration.njk");
});
app.get("/login", (req, res) => {
    res.render("login.njk");
});
app.use('/user', User);
app.use((req, res, next)=> {
    if(req.session.user){
        next()
    } else {
        res.redirect("/login");
    }
});
app.get('/', (req, res) => {
    res.redirect("/music");
});
app.use('/music', Music);
// app.use((req, res) => {
//     res.sendStatus("404");
// });

mongoose.connect("mongodb://localhost:27017/rutify", { useUnifiedTopology: true }, (err) => {
    if (!err) {
        app.listen(PORT, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Server's started on http://localhost:${PORT}`);
            }
        });
    } else {
        console.log(err + "Ошибка в подключении к базе данных");
    }
});