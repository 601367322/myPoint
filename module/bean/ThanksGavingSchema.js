var mongoose = require('mongoose');

var ThanksGavingSchema = mongoose.Schema({
    jia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    yi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
});

module.exports = mongoose.model('ThanksGaving', ThanksGavingSchema);