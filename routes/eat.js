/**
 * Created by bingbing on 2016/12/30.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('eat/eat');
});

module.exports = router;
