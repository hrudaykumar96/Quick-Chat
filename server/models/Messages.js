const mongoose = require('mongoose');

const messageschema = new mongoose.Schema({
    message:{
        type: String,
        required: true
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required: true
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required: true
    },
    isread:{
        type: Boolean,
        default: false
    }
},{timestamps: true});

module.exports = mongoose.model("Messages", messageschema);