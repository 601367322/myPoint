/**
 * Created by bingbing on 2017/6/27.
 */

var UserBeanSchema = require('../bean/UserBeanSchema');

class ActiveService {

    getAllUser() {
        return new Promise(function (res, rej) {
            UserBeanSchema.findAll()
                .then(function (data) {
                    res(data);
                });
        });
    }

}

module.exports = ActiveService;