const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchema = new Schema({
    name: String,
    rating: Number,
    color: String
});

module.exports = mongoose.model('Entry', entrySchema);