/**
 * Created by bingbing on 2016/12/31.
 */
var express = require('express');
var router = express.Router();
var EatMemberService = require('../module/service/EatMemberService');
var eatMemberService = new EatMemberService();

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
            res.send(data)
        })
});

module.exports = router;
