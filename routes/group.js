var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/create', function (req, res) {
    res.render('group/create');
});

router.post('/create',function (req, res) {

});

module.exports = router;
