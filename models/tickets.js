const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    desc: String,
    created: String,
    author: {
        id: String,
        userTag: String
    },
    guild: {
        id: String,
        name: String
    },
    open: Boolean,
    ticketNumber: {type: String, unique: true}
});

module.exports = mongoose.model('Tickets', ticketSchema);