/**
 * Created by bingbing on 2016/12/31.
 */
var mongoose = require('mongoose');
var UserModel = require('./UserBeanSchema');
var ErrorCode = require('../../common/ErrorCode');
var ResultBean = require('../bean/ResultBean');

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
        model.find()
            .populate('user')
            .exec(function (err, result) {
                if (err) {
                    rej(err);
                } else {
                    res(result);
                }
            });
    });
};

EatMemberSchema.statics.findByUserId = function (userId) {
    var self = this;
    return new Promise(function (res, rej) {
        self.find({user: userId}, function (err, result) {
            if (result.length > 0) {
                res(result)
            } else {
                rej();
            }
        })
    })
};

EatMemberSchema.statics.removeMember = function (userId) {
    var self = this;
    return new Promise(function (res, rej) {
        self.remove({user: userId}, function (err, result) {
            res();
        })
    })
};

module.exports = mongoose.model('eat_member', EatMemberSchema);