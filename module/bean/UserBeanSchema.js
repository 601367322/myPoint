/**
 * Created by bingbing on 2016/10/26.
 */

var mongoose = require('mongoose');
var sha1 = require('sha1');

var UserBeanSchema = mongoose.Schema({
    mobile: String,
    password: String,
    nickname: String,
    avatar: String,
    groupId: String,
    level: {type: Number, default: 0},
    accessToken: String
});

UserBeanSchema.statics.findByProperty = function (property) {
    var model = this;
    return new Promise(function (resolve, reject) {
        model.find(property, function (err, result) {
            if (err || result.length == 0) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        });
    });
};

UserBeanSchema.statics.generateAccessTokenByUser = function (user) {
    return new Promise(function (res, rej) {
        try {
            user.accessToken = sha1(user.mobile + new Date().getMilliseconds() + user.password);
            res(user);
        } catch (err) {
            rej(err);
        }
    })
};

UserBeanSchema.statics.updateUser = function (user) {
    var model = this;
    return new Promise(function (res, rej) {
        model.update(user, function (err, result) {
            res(user);
        })
    })
};

// UserBeanSchema.methods.findUserByMobile = function (callback) {
//     this.model.find({mobile: this.mobile}, callback);
// };

module.exports = mongoose.model('users', UserBeanSchema);