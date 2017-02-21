var mongoose = require('mongoose');
var ErrorCode = require('../../common/ErrorCode');
var ResultBean = require('../bean/ResultBean');
var moment = require('moment');
var async = require("async");

var EatMemberGroupSchema = mongoose.Schema({
    jia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    yi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    time: {
        type: Date,
        default: Date.now
    },
    state: {type: Number, default: 0}
});

EatMemberGroupSchema.index({time: -1});

EatMemberGroupSchema.statics.insertEatMemberGroup = function (group) {
    return new Promise(function (res, rej) {
        var model = require('./EatMemberGroupSchema');
        new model(group)
            .save(function (err, doc) {
                res(doc);
            });
    })
};

EatMemberGroupSchema.statics.incapableAll = function () {
    var self = this;
    return new Promise(function (res, rej) {
        self.update({}, {state: 1}, {multi: true}, function (err, result) {
            res();
        })
    });
};

EatMemberGroupSchema.statics.findByUserId = function (userId) {
    var self = this;
    return new Promise(function (res, rej) {
        self.find({jia: userId})
            .populate(['jia', 'yi'])
            .exec(function (err, doc) {
                res(doc);
            })
    })
};

EatMemberGroupSchema.statics.findLastByUserId = function (userId) {
    var self = this;
    return new Promise(function (res, rej) {
        // var today = moment().format("YYYY-MM-DD");
        // self.findOne({jia: userId, time: {"$gte": new Date(today)}})
        //     .sort({time: -1})
        //     .populate(['jia', 'yi'])
        //     .exec(function (err, doc) {
        //         res(doc);
        //     })
        self.findAllEnableAndToday()
            .then(function (groups) {
                if (groups.length > 0) {
                    var myGroup = null;
                    groups.forEach(function (group) {
                        if (group.jia._id == userId) {
                            myGroup = group;
                        }
                    });
                    res(myGroup);
                } else {
                    res(null);
                }
            })
    })
};

EatMemberGroupSchema.statics.findAllEnable = function () {
    var self = this;
    return new Promise(function (res, rej) {
        self.find({state: 0})
            .populate(['jia', 'yi'])
            .exec(function (err, doc) {
                res(doc);
            })
    })
};

EatMemberGroupSchema.statics.findAll = function () {
    this.find({})
        .populate(['jia', 'yi'])
        .exec(function (err, doc) {
            for (var i = 0; i < doc.length; i++) {
                if (i % 2 == 0) {
                    if (i % 12 == 0) {
                        console.log("=======================")
                    }
                    console.log(doc[i].jia.nickname + "----" + doc[i].yi.nickname);
                }
            }
        });
};

EatMemberGroupSchema.statics.findAllEnableAndToday = function () {
    var self = this;
    return new Promise(function (res, rej) {
        var today = moment().format("YYYY-MM-DD");
        self.find({time: {"$gte": new Date(today)}, state: 0})
            .populate(['jia', 'yi'])
            .exec(function (err, doc) {
                var arr = new Array();
                arr.push({
                    user: '13488616135',//自己
                    want: '18510093194',//相匹配的人
                    users: ['18704664110', '13003370061', '18613860138', '15810537209', '18810750719', '15810216032']//不相匹配的人
                });
                arr.push({
                    user: '17310283602',
                    want: '18701591431',
                    users: ['18704664110', '13003370061', '18613860138', '15810537209', '18810750719', '15810216032']
                });
                xunhuan(doc, arr, res)
            })
    })
};

EatMemberGroupSchema.statics.removeAllByUserId = function (userId) {
    var self = this;
    return new Promise(function (res, rej) {
        self.remove({"$or": [{jia: userId}, {yi: userId}]}, function (err, result) {
            res(result);
        })
    });
};

EatMemberGroupSchema.statics.removeTodayGroups = function () {
    var self = this;
    return new Promise(function (res, rej) {
        self.remove({"state": "0"}, function (err, result) {
            res(result);
        })
    })
};


function xunhuan(doc, arr, res) {
    zuobi(doc, arr[0].user, arr[0].want, arr[0].users)
        .then(function (groups) {
            arr.splice(0, 1);
            if (arr.length > 0) {
                xunhuan(groups, arr, res);
            } else {
                res(groups)
            }
        })
}

function zuobi(groups, user, want, users) {
    return new Promise(function (res, rej) {
        var groupA, groupB, groupC, groupD;
        //找出自己今天匹配的人
        groups.forEach(function (group) {
            if (group.jia.mobile == user) {
                groupA = group;
            }
            if (group.yi.mobile == user) {
                groupB = group;
            }
        });
        if (groupA != null) {
            var needRest = false;//是否匹配了不想匹配的人
            for (var i = 0; i < users.length; i++) {
                if (groupA.yi.mobile == users[i]) {
                    needRest = true;
                }
            }
            if (needRest) {
                //如果匹配到了不想匹配的人
                //找出想要匹配的人的所有匹配项
                groups.forEach(function (group) {
                    if (group.jia.mobile == want) {
                        groupC = group;
                    }
                    if (group.yi.mobile == want) {
                        groupD = group;
                    }
                });
                if (groupC != null) {
                    var other1 = groupB.jia;
                    var she = groupC.jia;
                    groupA.yi = she;
                    groupB.jia = she;
                    groupC.jia = other1;
                    groupD.yi = other1;
                    res(groups);
                } else {
                    var UserBeanSchema = require('./UserBeanSchema');
                    //如果想要匹配的人是单身狗，就将不相匹配的人变为单身狗
                    UserBeanSchema.findByProperty({mobile: want})
                        .then(function (resu) {
                            groupA.yi = resu;
                            groupB.jia = resu;
                            res(groups);
                        }, function (err) {
                            res(groups);
                        })
                }
            } else {
                res(groups);
            }
        } else {
            res(groups);
        }
    });
}

module.exports = mongoose.model('eat_member_group', EatMemberGroupSchema);