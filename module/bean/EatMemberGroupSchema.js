var mongoose = require('mongoose');
var ErrorCode = require('../../common/ErrorCode');
var ResultBean = require('../bean/ResultBean');
var moment = require('moment');

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
        var today = moment().format("YYYY-MM-DD");
        self.findOne({jia: userId, time: {"$gte": new Date(today)}})
            .sort({time: -1})
            .populate(['jia', 'yi'])
            .exec(function (err, doc) {
                res(doc);
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
                res(doc);
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


module.exports = mongoose.model('eat_member_group', EatMemberGroupSchema);