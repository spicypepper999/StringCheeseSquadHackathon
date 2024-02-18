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

//seeding
//const SeedEntries = require('./seed/entries');

//

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

app.get('/testseed', (req, res) => {
    Entry.create(new Entry({
        name: "Today was an excellent day",
        text: "I ate ice cream at ferdinands and met up with a friend",
        username: "butchtcougar",
        date: new Date(2024, 1, 3),
        emotions: [allEmotions[6]]
    }));
    Entry.create(new Entry({
        name: "Exam failure :(",
        text: "Today I absolutely messed up an exam I studied for. Oh well ",
        username: "butchtcougar",
        date: new Date(2024, 1, 5),
        emotions: [allEmotions[0],allEmotions[4]]
    }));
    Entry.create(new Entry({
        name: "Presentation",
        text: "I presented about my cheese findings. I was nervous but I did it!",
        username: "butchtcougar",
        date: new Date(2024, 1, 6),
        emotions: [allEmotions[3], allEmotions[6]]
    }));
    Entry.create(new Entry({
        name: "Got a bad grade",
        text: "Didn't do too well on that homework assignment. A bit bummed",
        username: "butchtcougar",
        date: new Date(2024, 1, 8),
        emotions: [allEmotions[4], allEmotions[5]]
    }));
    Entry.create(new Entry({
        name: "Went on a hike",
        text: "I went to Kamiak Butte. it was beautiful. definitely coming back, my mental health is excellent",
        username: "butchtcougar",
        date: new Date(2024, 1, 10),
        emotions: [allEmotions[6]]
    }));
    Entry.create(new Entry({
        name: "So much homework!",
        text: "I have too much homework ugh. Seventeen assignment, forty of which are due right before midnight. I hope I can finish them all",
        username: "butchtcougar",
        date: new Date(2024, 1, 11),
        emotions: [allEmotions[3]]
    }));
    Entry.create(new Entry({
        name: "Good exam",
        text: "I did so well on that exam!!! I just KNOW i got a good result, can't wait to see it!",
        username: "butchtcougar",
        date: new Date(2024, 1, 12),
        emotions: [allEmotions[2]]
    }));
    Entry.create(new Entry({
        name: "My dog ate my homework",
        text: "My dog devoured every little bit of my homework. It confused me, but I got in on video so my teacher will excuse me. Okay!",
        username: "butchtcougar",
        date: new Date(2024, 1, 14),
        emotions: [allEmotions[4], allEmotions[5]]
    }));
    Entry.create(new Entry({
        name: "Delicious dinner",
        text: "I made some tacos with whole  chickens. It was so good, I made myself happy :)",
        username: "butchtcougar",
        date: new Date(2024, 1, 15),
        emotions: [allEmotions[6]]
    }));
    Entry.create(new Entry({
        name: "Getting ready for hackathon?",
        text: "Getting ready for the hackathon coming up. I am nervous, but my group seems like good people. Itll be fun!",
        username: "butchtcougar",
        date: new Date(2024, 1, 16),
        emotions: [allEmotions[2], allEmotions[3]]
    }));
    Entry.create(new Entry({
        name: "Hackathon!!!",
        text: "I am learning so much at the hackathon, but it's stressful!",
        username: "butchtcougar",
        date: new Date(2024, 1, 17),
        emotions: [allEmotions[2], allEmotions[4]]
    }));
    res.send(allEmotions);
    //res.send("success");
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
        username: "user",
        password: "password",
        id: uuidv4()
    });
    User.create(newUser);
    res.send("Hello");
});

app.get('/testentry', (req, res) => {
    Entry.create(newEntry1);
    res.send("Hello");
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

app.get('/entries', (req, res) => {
    if(req.session.currentUser){
        Entry.find({ username: req.session.currentUser.username }).then(data => res.render('entries', {user:req.session.currentUser, entries:data}));
    }else{
        res.redirect('login');
    }
});

app.get('/user', (req, res) => {
    if (req.session.currentUser) {
        Entry.find({ username: req.session.currentUser.username, date:{ $gte: new Date(2024, 1, 1),
            $lte: new Date(2024, 2, 0)} }).then(data=>res.render('user', {user:req.session.currentUser, entries:data}));
    } else {
        res.redirect('login');
    }
});

app.get('/entries/new', (req, res) => {
    if (req.session.currentUser) {
        Emotion.find({}).then(data => res.render('newentry', {emotions:data}));
    } else {
        res.redirect('/login');
    }
});

app.post('/entries/new', async (req, res) => {
    if (req.session.currentUser) {
        let emotions = req.body.emotions;
        // Ensure emotions is always an array
        if (typeof emotions === 'string') {
            emotions = [emotions];
        }

        const emotionsObjects = [];
        for (let emotion of emotions){
            emotionsObjects.push(await Emotion.findOne({name:emotion}));
        }

        const newEntry = new Entry({
            name: req.body.entryName,
            text: req.body.entryText,
            username: req.session.currentUser.username,
            date: new Date(),
            emotions: emotionsObjects
        });

        Entry.create(newEntry).then(res.redirect('/entries'));
    } else {
        res.redirect('/login');
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