const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    mobile:{
        type: String,
        required: true,
        unique: true
    },
    gender:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: false,
        null: true
    },
    password:{
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        default: false
    },
    blocked :[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }]
},{timestamps: true});

module.exports = mongoose.model("Users", userschema);