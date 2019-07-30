const mongoose = require('mongoose');
var validator = require('validator');

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
// {
//     "_id" : ObjectId("5d358947ee91110cc0cef3e7"),
//     "id" : 1,
//     "first_name" : "Lisle",
//     "last_name" : "Itscowicz",
//     "email" : "litscowicz0@unblog.fr",
//     "gender" : "Male"
// }
const users= mongoose.model("users" , UserSchema);

module.exports = users;