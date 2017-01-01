/**
 * Created by bingbing on 2016/10/26.
 */

var mongoose = require('mongoose');
var sha1 = require('sha1');

var ErrorCode = require('../../common/ErrorCode');
var ResultBean = require('../bean/ResultBean');

var UserBeanSchema = mongoose.Schema({
    mobile: String,
    password: String,
    nickname: String,
    avatar: String,
    groupId: String,
    level: {type: Number, default: 0},
    accessToken: String,
    eatMember: {type: mongoose.Schema.Types.ObjectId, ref: "eat_member"}
});

UserBeanSchema.statics.findByProperty = function (property) {
    var model = this;
    return new Promise(function (resolve, reject) {
        model.find(property, function (err, result) {
            if (err || result.length == 0) {
                reject(new ResultBean(ErrorCode.UserUnExistsError, ErrorCode.UserUnExistsErrorStr));
            } else {
                resolve(result[0]);
            }
        });
    });
};

UserBeanSchema.statics.generateAccessTokenByUser = function (user) {
    user.accessToken = sha1(user.mobile + new Date().getMilliseconds() + user.password);
    return user;
};

UserBeanSchema.statics.findAll = function () {
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

UserBeanSchema.statics.findAllWithEat = function () {
    var model = this;
    return new Promise(function (res, rej) {
        model.find()
            .populate('eatMember')
            .exec(function (err, result) {
                if (err) {
                    rej(err);
                } else {
                    console.log(result);
                    res(result);
                }
            });
    })
};

UserBeanSchema.statics.updateUser = function (user) {
    var model = this;
    return new Promise(function (res, rej) {
        model.update({_id: user._id}, user, {multi: true}, function (err, result) {
            res(user);
        })
    })
};

UserBeanSchema.statics.insertUser = function (user) {
    return new Promise(function (res, rej) {
        var model = require('./UserBeanSchema');
        new model(user).save(function (err, result) {
            res(result);
        });
    });
};

// UserBeanSchema.methods.findUserByMobile = function (callback) {
//     this.model.find({mobile: this.mobile}, callback);
// };

module.exports = mongoose.model('users', UserBeanSchema);