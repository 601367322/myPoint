/**
 * Created by bingbing on 2016/12/31.
 */
var mongoose = require('mongoose');
var UserModel = require('./UserBeanSchema');

var EatMemberSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
});

EatMemberSchema.statics.insertMember = function (userId) {
    return new Promise(function (res, rej) {
        var model = require('./EatMemberSchema');
        var memberBean = new model();
        memberBean.user = userId;
        memberBean.save(function (err, result) {
            res(result);
        })
    })
};

EatMemberSchema.statics.findAll = function () {
    var model = this;
    return new Promise(function (res, rej) {
        model.find({}, function (err, result) {
            if (err) {
                rej(err);
            } else {
                res(result);
            }
        })
    })
};

EatMemberSchema.statics.findByUserId = function (userId) {
    var self = this;
    return new Promise(function (res, rej) {
        self.find({user: userId}, function (err, result) {
            if (result.length == 0) {
                res("no_exist")
            } else {
                rej("exist");
            }
        })
    })
};

module.exports = mongoose.model('eat_member', EatMemberSchema);