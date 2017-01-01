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
                .then(function (data) {
                    res(EatMemberModel.insertMember(userId));
                }, function (err) {
                    reject(new ResultBean(ErrorCode.EatMemberExistError, ErrorCode.EatMemberExistErrorStr));
                })
                .then(function (member) {
                    UserModel.findByProperty({_id: userId})
                        .then(function (user) {
                            user.eatMember = member._id;
                            return UserModel.updateUser(user);
                        })
                        .then(function (result) {
                            res(new ResultBean(ErrorCode.SUCCESS, result))
                        }, function (err) {
                            rej(new ResultBean(ErrorCode.CommonError, ErrorCode.CommonErrorStr));
                        })
                },function (err) {
                    reject(new ResultBean(ErrorCode.EatMemberExistError, ErrorCode.EatMemberExistErrorStr));
                });
            ;
        })
    }

}

module.exports = EatMemberService;