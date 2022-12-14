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

njk.configure('templates', {
    autoescape: true,
    express: app
});

function randKey() {
    let abc = "qwertyuiop[]asdfghjkl;'zxcvbnm,.!@#$%^&*()_+1234567890-=`~*";
    let rs = "";
    while (rs.length < 100) {
        rs += abc[Math.floor(Math.random() * abc.length)];
    };
    return rs;
};

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({}));
app.use(express.static("static/styles"));
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
        resave: true,
    })
);
app.use(cookieParser());
app.use((req, res, next) => {
    let unauth = ['/', '/login', '/registration', '/user/authorization', '/user/registration']
    let sess = req.session;
    if (!unauth.includes(req.url) && sess.user) {
        next()
    } else if (unauth.includes(req.url)) {
        next()
    }    
    else {
        res.redirect("/login");
    }
});
app.get('/', (req, res) => {
    res.redirect("/music/");
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
mongoose.connect("mongodb://192.168.50.40:27017/rutify", { useUnifiedTopology: true }, (err) => {
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
        console.log(err + "???????????? ?? ?????????????????????? ?? ???????? ????????????");
    }
});