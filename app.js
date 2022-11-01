const express = require('express');
const app = express();
const session = require('express-session');
const PORT = 3000;
const njk = require('nunjucks');
const mongoose = require('mongoose');

njk.configure('templates', {
    autoescape: true,
    express: app
});

app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'aboba',
        resave: true,
        saveUninitialized: true,
    })
);

app.get('/', (req, res) => {
    res.send("<h1>Rutify</h1>");
});

app.listen(PORT, (req, res) => {
    console.log(`Server started on the link http://localhost:${PORT}`);
});
