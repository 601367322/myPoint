/**
 * Created by bingbing on 2016/10/27.
 */

class ResultBean {
    constructor(errCode, result) {
        this.errCode = errCode;
        this.result = result;
    }

    getErrCode() {
        return this.errCode;
    }

    getResult() {
        return this.result;
    }
}

module.exports = ResultBean;