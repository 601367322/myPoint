/**
 * Created by bingbing on 2016/12/31.
 */
var EatMemberModel = require('../bean/EatMemberSchema');
var UserModel = require('../bean/UserBeanSchema');
var ErrorCode = require('../../common/ErrorCode');
var ResultBean = require('../bean/ResultBean');

class EatMemberService {

    getMemberList() {
        return new Promise(function (res, rej) {
            UserModel.findAllWithEat()
                .then(function (result) {
                    res(result);
                }, function (err) {
                    rej(new ResultBean(ErrorCode.CommonError, ErrorCode.CommonErrorStr))
                });
        });
    }

    insertMember(userId) {
        return new Promise(function (res, reject) {
            EatMemberModel.findByUserId(userId)
                .then(function () {
                    reject(new ResultBean(ErrorCode.EatMemberExistError, ErrorCode.EatMemberExistErrorStr));
                }, function (err) {
                    EatMemberModel.insertMember(userId)
                        .then(function (member) {
                            UserModel.findByProperty({_id: userId})
                                .then(function (user) {
                                    user.eatMember = member._id;
                                    UserModel.updateUser(user)
                                        .then(function (result) {
                                            res(new ResultBean(ErrorCode.SUCCESS, result))
                                        }, function () {
                                            reject(new ResultBean(ErrorCode.CommonError, ErrorCode.CommonErrorStr));
                                        });
                                });
                        }, function () {
                            reject(new ResultBean(ErrorCode.EatMemberExistError, ErrorCode.EatMemberExistErrorStr));
                        });
                });
        })
    }

    removeMember(userId) {
        return new Promise(function (res, rej) {
            EatMemberModel.removeMember(userId)
                .then(function () {
                    res(new ResultBean(ErrorCode.SUCCESS, null))
                })
        });
    }

}

module.exports = EatMemberService;