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
const Emotion = require('./models/emotion').Emotion;

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "supersecretkey",
    saveUninitialized: true,
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
mongoose.connect(uri)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

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
    res.redirect('login');
});

app.get('/user', (req, res) => {
    if(req.session.currentUser){
        Entry.find({ username: req.session.currentUser.username }).then(data => res.render('user', {user:req.session.currentUser, entries:data}));
    }else{
        res.redirect('login');
    }
});

app.get('/entry', (req, res) => {
    if (req.session.currentUser) {
        Emotion.find({}).then(data => res.render('entry', {emotions:data}));
    } else {
        res.redirect('login');
    }
});

app.post('/entry', async (req, res) => {
    if (req.session.currentUser) {
        const emotions = [];
        for (let emotion of req.body.emotions){
            emotions.push(await Emotion.findOne({name:emotion}));
        }
        const newEntry = new Entry({
            name: req.body.entryName,
            text: req.body.entryText,
            username: req.session.currentUser.username,
            emotions: emotions
        });
        Entry.create(newEntry).then(res.redirect('user'));
    } else {
        res.redirect('/login')
    }
});

app.get('/register', (req, res) => {
    if (!req.session.currentUser) {
        res.render('register');
    } else {
        res.redirect('logout');
    }
});

app.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        id: uuidv4()
    });
    User.findOne({ username: newUser.username }).then(data => {
        if (data) {
            res.redirect('/register')
        } else {
            User.create(newUser).then(res.redirect('/login'));
        }
    });
});