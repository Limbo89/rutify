const express = require('express');
const app = express();
const session = require('express-session');
const PORT = 3000;
const Music = require("./routes/music");
const User = require('./routes/user');
const fileUpload = require('express-fileupload');
const njk = require('nunjucks');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const oneDay = 1000 * 60 * 60 * 24;
const redisStore = require('connect-redis')(session);
const redis = require('redis');
const client = redis.createClient({
    legacyMode: true
});
const auth = require("./scripts/authCheck");

njk.configure('templates', {
    autoescape: true,
    express: app
});

function randKey() {
    let abc = "qwertyuiop[]\asdfghjkl;'zxcvbnm,./!@#$%^&*()_+1234567890-=`~*";
    let rs = "";
    while (rs.length < 100) {
        rs += abc[Math.floor(Math.random() * abc.length)];
    };
    return rs;
};

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({}));
app.use(express.static('static'));
app.use(
    session({
        secret: randKey(),
        store: new redisStore({
            host: '127.0.0.1',
            port: 6379,
            client: client,
            ttl: 260
        }),
        saveUninitialized: true,
        cookie: {
            maxAge: oneDay
        },
        resave: false,
    })
);
app.use(cookieParser());
app.get('/', (req, res) => {
    auth(req, res);
    res.send("Hello!");
});
app.use('/user', User);
app.get("/registration", (req, res) => {
    res.render("registration.njk");
});
app.get("/login", (req, res) => {
    res.render("login.njk");
});
app.use('/music', Music);

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/rutify", { useUnifiedTopology: true }, (err) => {
    if (!err) {
        client.connect();
        app.listen(3000, (err) => {
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