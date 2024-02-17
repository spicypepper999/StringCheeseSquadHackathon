const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emotionSchema = new Schema({
    comment: String,
    username: String,
    id: String
});

module.exports = mongoose.model('Emotion', emotionSchema);