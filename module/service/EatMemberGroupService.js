/**
 * Created by bingbing on 2017/1/3.
 */
var EatMemberSchema = require('../bean/EatMemberSchema');
var EatMemberGroupSchema = require('../bean/EatMemberGroupSchema');
var UserBeanSchema = require('../bean/UserBeanSchema');
var ErrorCode = require('../../common/ErrorCode');
var ResultBean = require('../bean/ResultBean');

class Counter {

    constructor(count, user) {
        this.count = count;
        this.user = user;
    }

    getCount() {
        return this.count;
    }

    addCount() {
        this.count++;
    }

    getUser() {
        return this.user;
    }
}

class EatMemberGroupService {

    generateGroups() {
        var self = this;
        return new Promise(function (res, rej) {
            EatMemberGroupSchema.findAllEnableAndToday()
                .then(function (result) {
                    if (result.length > 0) {
                        res(result);
                    } else {
                        EatMemberGroupSchema.incapableAll()
                            .then(function () {
                                EatMemberSchema.findAll()
                                    .then(function (result) {
                                        if (result.length <= 1) {
                                            rej(new ResultBean(ErrorCode.CommonError, "加入配对列表的人太少了"));
                                            return;
                                        }
                                        var users = new Array();
                                        result.forEach(function (member) {
                                            users.push(member.user)
                                        });

                                        var randomUsers = new Array();
                                        //随机排序
                                        while (users.length > 0) {
                                            var index = parseInt(Math.random() * users.length);
                                            randomUsers.push(users[index]);
                                            users.splice(index, 1);
                                        }

                                        var groups = new Array();

                                        //去掉最后一个单身狗
                                        if (randomUsers.length % 2 != 0) {
                                            randomUsers.pop();
                                        }

                                        self.doPair(groups, randomUsers, res, rej);
                                    })
                            });
                    }
                });
        });
    }

    doPair(groups, randomUsers, res, rej) {
        var self = this;
        var jia = randomUsers[0];
        randomUsers.splice(0, 1);
        var yi = null;

        EatMemberGroupSchema.findByUserId(jia._id)
            .then(function (result) {
                var counters = new Array();
                result.forEach(function (group) {
                    var exist = false;
                    for (var i = 0; i < counters.length; i++) {
                        var counter = counters[i];
                        if (counter.getUser().mobile == group.yi.mobile) {
                            counter.addCount();
                            exist = true;
                            break;
                        }
                    }
                    if (!exist) {
                        counters.push(new Counter(1, group.yi));
                    }
                });
                //将没有配对过的人加入队列
                randomUsers.forEach(function (user) {
                    var exist = false;
                    for (var i = 0; i < counters.length; i++) {
                        var counter = counters[i];
                        if (counter.getUser().mobile == user.mobile) {
                            exist = true;
                        }
                    }
                    if (!exist) {
                        counters.push(new Counter(0, user));
                    }
                });

                //将已配对人删掉
                var unexist = new Array();
                for (var ci = 0; ci < counters.length; ci++) {
                    var counter = counters[ci];
                    var exist = false;
                    for (var i = 0; i < randomUsers.length; i++) {
                        if (randomUsers[i].mobile == counter.user.mobile) {
                            exist = true;
                        }
                    }
                    if (!exist) {
                        unexist.push(counter);
                    }
                }
                unexist.forEach(function (counter) {
                    self.removeByValue(counters, counter);
                });


                //筛选配对次数最少的所有人
                var minCount = counters[0].getCount();
                var filters = new Array();
                counters.forEach(function (counter) {
                    if (counter.getCount() < minCount) {
                        minCount = counter.getCount();
                        filters = new Array();
                        filters.push(counter.getUser());
                    } else if (counter.getCount() == minCount) {
                        filters.push(counter.getUser());
                    }
                });

                var yi_index = parseInt(Math.random() * filters.length);
                yi = filters[yi_index];

                var tempIndex = -1;
                for (var ran = 0; ran < randomUsers.length; ran++) {
                    if (randomUsers[ran].mobile == yi.mobile) {
                        tempIndex = ran;
                        break;
                    }
                }
                if (tempIndex != -1) {
                    randomUsers.splice(tempIndex, 1);
                }

                if (jia != null && yi != null) {
                    groups.push(new EatMemberGroupSchema({jia: jia._id, yi: yi._id}));
                    groups.push(new EatMemberGroupSchema({jia: yi._id, yi: jia._id}));
                }

                if (randomUsers.length > 0) {
                    self.doPair(groups, randomUsers, res, rej);
                } else {
                    self.addGroup(groups, res, rej);
                }
            });
    }

    removeByValue(array, val) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == val) {
                array.splice(i, 1);
                break;
            }
        }
    }

    addGroup(groups, res, rej) {
        var self = this;
        console.log(groups[0])
        EatMemberGroupSchema.insertEatMemberGroup(groups[0])
            .then(function () {
                groups.splice(0, 1);
                if (groups.length > 0) {
                    self.addGroup(groups, res, rej);
                } else {
                    EatMemberGroupSchema.findAllEnableAndToday()
                        .then(function (result) {
                            res(result);
                        });
                }
            })
    }

    getMyLastGroup(userId) {
        return new Promise(function (res, rej) {
            EatMemberGroupSchema.findLastByUserId(userId)
                .then(function (doc) {
                    if (!doc) {
                        rej(new ResultBean(ErrorCode.CommonError, "今天还未进行匹配or你可能是个单身狗"));
                    } else {
                        res(doc);
                    }
                })
        });
    }

    deleteTodayGroups() {
        return new Promise(function (res, rej) {
            EatMemberGroupSchema.removeTodayGroups()
                .then(function (doc) {
                    res(new ResultBean(ErrorCode.SUCCESS, ""));
                })
        });
    }

    test() {
        EatMemberGroupSchema.findAll();
    }
}

module.exports = EatMemberGroupService;