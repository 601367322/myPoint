var UserModel = require('../bean/UserBeanSchema');
var ErrCode = require('../../common/ErrorCode');
var ResultBean = require('../bean/ResultBean');

class UserDao {

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
                }, function (error) {
                    reject(error);
                })
                .then(function () {
                    reject(new ResultBean(ErrCode.UserExistsError, ErrCode.UserExistsErrorStr));
                }, function (error) {
                    console.log(error);
                    return UserModel.generateAccessTokenByUser(user);
                })
                .then(function (result) {
                    console.log(result.accessToken);
                    var userSaveModel = new UserModel(user);
                    userSaveModel.save(function (err, doc) {
                        resolve(new ResultBean(ErrCode.SUCCESS, doc));
                    })
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
                }, function (error) {
                    reject(error)
                })
                .then(function (result) {
                    if (result.password == user.password) {
                        return UserModel.generateAccessTokenByUser(result);
                    } else {
                        reject(new ResultBean(ErrCode.UserPasswordError, ErrCode.UserPasswordErrorStr));
                    }
                }, function (error) {
                    console.log(error);
                    reject(new ResultBean(ErrCode.UserUnExistsError, ErrCode.UserUnExistsErrorStr));
                })
                .then(function (result) {
                    return UserModel.updateUser(result);
                })
                .then(function (result) {
                    resolve(new ResultBean(ErrCode.SUCCESS, result));
                });
        });
    }

    checkMobile(mobile) {
        var daoSelf = this;
        return new Promise(function (res, rej) {
            if (!daoSelf.checkMobileRegex(mobile)) {
                rej(new ResultBean(ErrCode.UserMobileError, ErrCode.UserMobileErrorStr));
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

module.exports = UserDao;