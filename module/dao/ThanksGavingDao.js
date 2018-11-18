var ThanksGavingSchema = require('../bean/ThanksGavingSchema');
var UserBeanSchema = require('../bean/UserBeanSchema')
var ThanksGavingMemberSchema = require('../bean/ThankGavingMemberSchema')


module.exports = class ThanksGavingDao {

    save() {

    }

    find({jiaId}, res, rej) {
        ThanksGavingSchema.find({jia: jiaId}, function (err, result) {
            if (err || result.length == 0) {
                rej();
            } else {
                res(result[0]);
            }
        });
    }

    findCount(res) {
        ThanksGavingMemberSchema.find({}, (error, result) => {
            res(result)
        });
    }

    findRandomUser(user, res, rej) {
        var self = this;
        ThanksGavingSchema.find({jia: user._id}, function (err, result) {
            if (result.length > 0) {
                rej()
            } else {
                self.findCount((result) => {
                    var member = self.findUnique(user, result);

                    if (member != null) {
                        new ThanksGavingSchema({jia: user._id, yi: member.user}).save(function (err, result) {
                            res(result);
                        })
                        ThanksGavingMemberSchema.remove({"user": member.user}, function (err, result) {
                            console.log("ThanksGavingMemberSchema")
                        })
                    } else {
                        new ThanksGavingSchema({jia: user._id, yi: null}).save(function (err, result) {
                            res(result);
                        })
                    }
                    console.log(member);
                });
            }
        })
    }

    findUnique(user, users) {
        var index = parseInt(Math.random() * users.length);
        var member = users[index];

        console.log(member.user.toString())
        console.log(user._id)

        if (member.user.toString() == user._id) {
            if (users.length === 1) {
                return null;
            }
            users.splice(index, 1);
            return this.findUnique(user, users)
        }
        return member
    }
}
