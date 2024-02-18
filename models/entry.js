const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Emotion = require('./emotion');

const entrySchema = new Schema({
    name: String,
    text: String,
    username: String,
    emotions: [Emotion.emotionSchema]
});

module.exports = mongoose.model('Entry', entrySchema);