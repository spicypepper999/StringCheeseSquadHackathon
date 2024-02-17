const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require("cookie-parser");

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "supersecretkey",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use(cookieParser());

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.listen(port, () => {
    console.log("LISTENING ON PORT " + port);
});

//home
app.get('/', (req, res) => {
    res.render('index');
});