/**
 * Created by bingbing on 2016/12/31.
 */
var express = require('express');
var router = express.Router();
var EatMemberService = require('../module/service/EatMemberService');
var EatMemberGroupService = require('../module/service/EatMemberGroupService');
var eatMemberService = new EatMemberService();
var eatMemberGroupService = new EatMemberGroupService();

/* GET home page. */
router.get('/', function (req, res) {
    eatMemberService.getMemberList()
        .then(function (data) {
            res.render('member/list', {data: data});
        }, function (err) {
            res.render('member/list', {error: err});
        });
});

router.post('/add', function (req, res) {
    eatMemberService.insertMember(req.body.userId)
        .then(function (data) {
            res.send(data)
        }, function (err) {
            res.send(err)
        })
});

router.post('/remove', function (req, res) {
    eatMemberService.removeMember(req.body.userId)
        .then(function (data) {
            res.send(data)
        }, function (err) {
            res.send(err)
        })
});

router.get('/generate', function (req, res) {
    if (!global.generateEatGroup) {
        //防止重复生成配对异常，同一时间只能有一个请求访问。
        global.generateEatGroup = true;
        eatMemberGroupService.generateGroups()
            .then(function (data) {
                global.generateEatGroup = false;
                res.render('group/list', {data, data});
            }, function (err) {
                global.generateEatGroup = false;
                res.render('group/list', {error: err});
            });
    }
});

module.exports = router;
