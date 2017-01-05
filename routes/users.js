var express = require('express');
var router = express.Router();
var UserService = require('../module/service/UserService');
var ErrCode = require('../common/ErrorCode');
var userService = new UserService();
var multer = require('multer');
var fs = require("fs");
var ResultBean = require('../module/bean/ResultBean');
var sharp = require("sharp");

/**
 * 用户主页
 */
router.get('/', function (req, res, next) {
    res.render('user/user');
});

/**
 * 登录
 */
router.post('/login', function (req, res, next) {
    let mobile = req.body.mobile;
    userService.loginUser({mobile: mobile, password: req.body.password})
        .then(function (result) {
            loginSuccess(req, res, result);
        }, function (error) {
            loginSuccess(req, res, error);
        });
});

/**
 * 注册页跳转
 */
router.get('/register', function (req, res, next) {
    res.render('user/register');
});

/**
 * 注册
 */
var upload = multer({dest: 'uploads/avatar'});
router.post('/register', upload.single('avatar'), function (req, res, next) {
    sharp(req.file.path)
        .resize(100, 100)
        .sharpen()
        .quality(100)
        .toFile(req.file.path + "_", function (err) {
            fs.unlink(req.file.path);
            if (!err) {
                userService.regUser({
                    mobile: req.body.mobile,
                    password: req.body.password,
                    nickname: req.body.nickname,
                    avatar: "/" + req.file.path + "_"
                }).then(function (result) {
                    loginSuccess(req, res, result);
                }, function (error) {
                    fs.unlink(req.file.path + "_");
                    res.render('user/register', {error: error});
                });
            } else {
                res.render('user/register', {error: new ResultBean(ErrCode.CommonError, "头像上传失败")})
            }
        });

});

router.get('/exit', function (req, res, next) {
    if (req.session.user) {
        req.session.user = null;
    }
    if (req.cookies.accessToken) {
        res.cookie("accessToken", 'undefined');
    }
    res.redirect('/');
});

/**
 * 登录或注册成功后
 * @param res
 * @param data
 */
var loginSuccess = function (req, res, data) {
    if (data.errCode == ErrCode.SUCCESS) {
        req.session.user = data.getResult();
        res.cookie("accessToken", data.getResult().accessToken, {maxAge: 30 * 24 * 60 * 60 * 1000});
        res.redirect('/users');
    } else {
        res.render('user/login', {error: data});
    }
};

router.post('/delete', function (req, res) {
    userService.deleteUser(req.body.userId)
        .then(function () {
            res.send("ok");
        });
});


module.exports = router;
