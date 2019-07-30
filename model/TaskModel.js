const mongoose = require('mongoose');
var validator = require('validator');
const Schema = mongoose.Schema

const TaskSchema = new Schema({
    name : {
        type : String
    },
    email : {
        type : String
    }
})


const imageSchemaT = new Schema({
    image :{
        type : String
    },
    UserID : {
        type:Schema.Types.ObjectId,
        ref: 'Task'
    }
})
 
 
const TaskImage= mongoose.model("TaskImage" , imageSchemaT);

const Task= mongoose.model("Task" , TaskSchema);

module.exports = {Task ,TaskImage }
