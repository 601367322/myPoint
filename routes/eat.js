/**
 * Created by bingbing on 2016/12/30.
 */
var express = require('express');
var router = express.Router();
var EatMemberService = require('../module/service/EatMemberService');
var EatMemberGroupService = require('../module/service/EatMemberGroupService');
var eatMemberService = new EatMemberService();
var eatMemberGroupService = new EatMemberGroupService();

/* GET home page. */
router.get('/', function (req, res) {
    eatMemberService.getEnableMemberList()
        .then(function (data) {
            eatMemberGroupService.getMyLastGroup(req.session.user._id)
                .then(function (group) {
                    res.render('eat/eat', {data: data, group: group});
                }, function (err) {
                    res.render('eat/eat', {error: err});
                });
        }, function (err) {
            res.render('eat/eat', {error: err});
        });
});

module.exports = router;
