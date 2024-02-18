const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require("cookie-parser");

//mongodb models
const User = require('./models/user');
const Entry = require('./models/entry');
const Emotion = require('./models/emotion');

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

session.currentUser = null;

//app.use(express.static(path.join(__dirname, 'stylesheets')))

const uri = "mongodb+srv://cougar:7l6AquytiUnbvq1J@couglife.jj8trpx.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri);

app.listen(port, () => {
    console.log("LISTENING ON PORT " + port);
});

//home
app.get('/', (req, res) => {
    res.render('index');
});

app.get("/about", (req, res) => {
    res.render("about");
  });

app.get('/test', (req, res) => {
    const newUser = new User({
        username: "User Name",
        password: "User password",
        id: uuidv4()
    });
    User.create(newUser);
    res.send("Hello");
});

app.get('/user', (req, res) => {

});

app.get('/login', (req, res) => {
    if (!req.session.currentUser) {
        res.render('login');
    } else {
        res.redirect('/logout');
    }
});

app.post('/login', (req, res) => {
    const tryUser = new User({
        username: req.body.username,
        password: req.body.password
    });
    User.findOne({ username: tryUser.username }).then(data => {
        if (data && data.password == tryUser.password) {
            req.session.currentUser = tryUser;
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });
});

app.get('/logout', (req, res) => {
    if (req.session.currentUser) {
        res.render('logout');
    } else {
        res.redirect('login');
    }
});

app.post('/logout', (req, res) => {
    if (req.session.currentUser) {
        req.session.currentUser = null;
    }
    res.redirect('/login');
});