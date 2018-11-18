/**
 * Created by bingbing on 2016/12/31.
 */
var mongoose = require('mongoose');

var ThankGavingMemberSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
});

module.exports = mongoose.model('ThankGavingMember', ThankGavingMemberSchema);