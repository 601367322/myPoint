/**
 * Created by bingbing on 2016/10/26.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ty-system');
var db = mongoose.connection;
module.exports = db;