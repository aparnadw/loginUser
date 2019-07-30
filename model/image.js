const mongoose = require('mongoose');
var validator = require('validator');
require('./appModel');
const Schema = mongoose.Schema

const imageSchema = new Schema({
    UserName : {
        type : String
    },
    image :{
        type : String
    },
    UserID : {
        type:Schema.Types.ObjectId,
        ref: 'User'
    }
})

 
const Image= mongoose.model("Image" , imageSchema);

module.exports = Image