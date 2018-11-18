/**
 * Created by bingbing on 2016/12/31.
 */
var express = require('express');
var router = express.Router();
var ActiveService = require('../module/service/ActiveService');
var activeService = new ActiveService();
var fs = require('fs');
var ThanksGavingService = require('../module/service/ThanksGavingService');
var mThanksGavingService = new ThanksGavingService();
var UserSchema = require('../module/bean/UserBeanSchema')

function geFileList(path) {
    var filesList = [];
    readFile(path, filesList);
    return filesList;
}

function readFile(path, filesList) {
    var files = fs.readdirSync(path);//需要用到同步读取
    files.forEach(walk);

    function walk(file) {
        var states = fs.statSync(path + '/' + file);
        if (states.isDirectory()) {
            readFile(path + '/' + file, filesList);
        }
        else {
            //创建一个对象保存信息
            var obj = new Object();
            obj.size = states.size;//文件大小，以字节为单位
            obj.name = file;//文件名
            obj.path = "/" + path + file; //文件绝对路径
            filesList.push(obj);
        }
    }
}

/* GET home page. */
router.get('/random', function (req, res) {
    var pictures = geFileList("uploads/random/");
    activeService.getAllUser()
        .then(function (data) {
            res.render('active/random', {data, pictures});
        });
});

router.get('/thanksgiving', function (req, res) {
    mThanksGavingService.find(req.session.user, (result) => {
        if (result == null) {
            UserSchema.findAll()
                .then((users) => {
                    res.render('active/thanksgaving', {users});
                })
        } else {
            res.render('active/thanksgaving', {result});
        }
    }, () => {
        res.send("error");
    })
});

router.get('/thanksgivingdorandom', function (req, res) {
    mThanksGavingService.random(req.session.user, (result) => {
        res.send(result.user);
    }, () => {
        res.send("error")
    })
});


module.exports = router;
