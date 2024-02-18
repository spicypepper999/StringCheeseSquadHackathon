const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Emotion = require('../models/emotion').Emotion;

let emotionList = [];
let entriesList = [];
emotionList = Emotion.find({}).then(
entriesList = [
    {
        name: "I love my life!",
        text: "Today was a really good day. I went shopping, skiing, snowboarding, snorkeling, and scuba diving. Wow!",
        date: new Date(2024, 1, 5),
        emotions: emotionList
    }
]
);

module.exports = entriesList;