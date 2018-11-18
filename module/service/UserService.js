var UserModel = require('../bean/UserBeanSchema');
var ThankGavingMember = require('../bean/ThankGavingMemberSchema');
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
            if (!daoSelf.checkMobileRegex(user.mobile)) {
                reject(new ResultBean(ErrorCode.UserMobileError, ErrorCode.UserMobileErrorStr));
                return;
            }
            //查找用户
            UserModel.findByProperty({mobile: user.mobile})
                .then(function () {
                    //不存在抛出异常
                    reject(new ResultBean(ErrorCode.UserExistsError, ErrorCode.UserExistsErrorStr));
                }, function () {
                    //设置token
                    user = UserModel.generateAccessTokenByUser(user);
                    //加密密码
                    user.password = helpers.md5(user.password);
                    //添加到数据库
                    UserModel.insertUser(user)
                        .then(function (doc) {
                            new ThankGavingMember({user:doc._id}).save();
                            resolve(new ResultBean(ErrorCode.SUCCESS, doc));
                        });
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
            if (!daoSelf.checkMobileRegex(user.mobile)) {
                reject(new ResultBean(ErrorCode.UserMobileError, ErrorCode.UserMobileErrorStr));
                return;
            }
            UserModel.findByProperty({mobile: user.mobile})
                .then(function (result) {
                    if (result.password == helpers.md5(user.password)) {
                        result = UserModel.generateAccessTokenByUser(result);
                        UserModel.updateUser(result)
                            .then(function (result) {
                                resolve(new ResultBean(ErrorCode.SUCCESS, result));
                            });
                    } else {
                        reject(new ResultBean(ErrorCode.UserPasswordError, ErrorCode.UserPasswordErrorStr));
                    }
                }, function () {
                    reject(new ResultBean(ErrorCode.UserUnExistsError, ErrorCode.UserUnExistsErrorStr));
                })
        });
    }

    checkMobileRegex(mobile) {
        var re = /^1\d{10}$/;
        if (re.test(mobile)) {
            return true;
        } else {
            return false;
        }
    }


    deleteUser(userId) {
        var self = this;
        return new Promise(function (res, rej) {
            UserModel.deleteUser(userId)
                .then(function () {
                    res();
                });
        })
    }
}

module.exports = UserService;