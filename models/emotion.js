const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emotionSchema = new Schema({
    name: String,
    color: String
});

module.exports = {Emotion: mongoose.model('Emotion', emotionSchema), emotionSchema:emotionSchema};