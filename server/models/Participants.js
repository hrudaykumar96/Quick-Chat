const mongoose = require("mongoose");

const participantsschema = new mongoose.Schema({
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
    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Messages'
    }]
},{timestamps: true});

module.exports = mongoose.model('Participants', participantsschema);