var UserModel = require('../bean/UserBeanSchema');

module.exports = function (req, res, next) {
    var url = req.originalUrl;
    if (url != "/users/login" &&
        url != "/users/register" &&
        url != "/users/exit" && !req.session.user) {
        if (req.cookies.accessToken && req.cookies.accessToken != "undefined") {
            UserModel.findByProperty({accessToken: req.cookies.accessToken})
                .then(function (result) {
                    req.session.user = result;
                    next();
                }, function () {
                    returnIndex(url, res, next);
                });
        } else {
            returnIndex(url, res, next);
        }
    } else {
        next();
    }
};

function returnIndex(url, res, next) {
    if (url == '/') {
        next();
    } else {
        return res.redirect("/");
    }
}