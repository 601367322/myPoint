var UserModel = require('../bean/UserBeanSchema');
var ErrorCode = require('../../common/ErrorCode');
var ResultBean = require('../bean/ResultBean');
var helpers = require("request/lib/helpers");

class UserService {

    /**
     * 注册
     * @param regUser
     */
    regUser(user) {
        var daoSelf = this;
        return new Promise(function (resolve, reject) {
            daoSelf.checkMobile(user.mobile)
                .then(function () {
                    return UserModel.findByProperty({mobile: user.mobile});
                }, function (err) {
                    reject(err);
                    throw 0;
                })
                .then(function () {
                    reject(new ResultBean(ErrorCode.UserExistsError, ErrorCode.UserExistsErrorStr));
                }, function () {
                    return UserModel.generateAccessTokenByUser(user);
                })
                .then(function () {
                    user.password = helpers.md5(user.password);
                    return UserModel.insertUser(user);
                })
                .then(function (doc) {
                    resolve(new ResultBean(ErrorCode.SUCCESS, doc));
                })
                .catch(err=> {
                    reject(err);
                });
        });
    }

    /**
     * 登录
     * @param user
     * @returns {Promise}
     */
    loginUser(user) {
        var daoSelf = this;
        return new Promise(function (resolve, reject) {
            daoSelf.checkMobile(user.mobile)
                .then(function () {
                    return UserModel.findByProperty({mobile: user.mobile});
                }, function (err) {
                    reject(err);
                })
                .then(function (result) {
                    if (result.password == helpers.md5(user.password)) {
                        return UserModel.generateAccessTokenByUser(result);
                    } else {
                        reject(new ResultBean(ErrorCode.UserPasswordError, ErrorCode.UserPasswordErrorStr));
                    }
                })
                .then(function (result) {
                    return UserModel.updateUser(result);
                })
                .then(function (result) {
                    resolve(new ResultBean(ErrorCode.SUCCESS, result));
                })
                .catch(err=> {
                    reject(err);
                })
        });
    }

    checkMobile(mobile) {
        var daoSelf = this;
        return new Promise(function (res, rej) {
            if (!daoSelf.checkMobileRegex(mobile)) {
                rej(new ResultBean(ErrorCode.UserMobileError, ErrorCode.UserMobileErrorStr));
            } else {
                res();
            }
        });

        return true;
    }

    checkMobileRegex(mobile) {
        var re = /^1\d{10}$/;
        if (re.test(mobile)) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = UserService;