const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSessionSchema = new mongoose.Schema({
    userId:{
        type:String,
        default: ''
    },
    timpstamp:{
        type:Date,
        default: Date.now()
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
});

module.exports = mongoose.model('UserSession', UserSessionSchema)