/**
 * Created by bingbing on 2017/1/3.
 */
var ThanksGavingSchema = require('../bean/ThanksGavingSchema');
var ThanksGavingDao = require('../dao/ThanksGavingDao')
var UserBeanSchema = require('../bean/UserBeanSchema');
var ErrorCode = require('../../common/ErrorCode');
var ResultBean = require('../bean/ResultBean');

var mThanksGavingDao = new ThanksGavingDao();

class ThanksGavingService {

    random(user, res, rej) {
        mThanksGavingDao.findRandomUser(user, (result) => {
            if (result.yi != null) {
                UserBeanSchema.findByProperty({_id: result.yi})
                    .then((u) => {
                        result.user = u;
                        res(result)
                    }, (err) => {
                        res(result)
                    })
            } else {
                res(result)
            }
        }, rej);
    }

    //找到与我匹配的人
    find(user, res, rej) {
        mThanksGavingDao.find({jiaId: user._id}, (result) => {
                if (result.yi != null) {
                    UserBeanSchema.findByProperty({_id: result.yi})
                        .then((u) => {
                            result.user = u;
                            res(result)
                        }, (err) => {
                            res(result)
                        })
                } else {
                    res(result)
                }
            }
            , () => {
                res(null)
            })
    }

}

module.exports = ThanksGavingService;