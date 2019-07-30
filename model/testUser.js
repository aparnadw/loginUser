const mongoose = require('mongoose');
var validator = require('validator');
// for pagination
const UserSchema = new mongoose.Schema({

    id: {
        type: Number
    },
    first_name : {
        type : String
    },
    last_name : {
        type : String
    },
    email : {
        type : String
    },
    gender : {
        type: String
    },
})

const users= mongoose.model("users" , UserSchema);

module.exports = users;
