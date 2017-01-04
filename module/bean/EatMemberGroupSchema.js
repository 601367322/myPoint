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
        self.find({jia: userId}, function (err, doc) {
            res(doc);
        })
    })
};

EatMemberGroupSchema.statics.findAllEnable = function () {
    var self = this;
    return new Promise(function (res, rej) {
        self.find({state: 0}, function (err, doc) {
            res(doc);
        })
    })
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


module.exports = mongoose.model('eat_member_group', EatMemberGroupSchema);