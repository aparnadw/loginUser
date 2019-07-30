const mongoose = require('mongoose');
var validator = require('validator');

const UserSchema = new mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String,
        unique : true
    },
    password1 : {
        type: String
    },
    password2 : {
        type : String
    },
    profile : {
        type : String
    }
})

/* password verification */
UserSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})
    if(!user){
        console.log("unable to login");
        res.redirect('/login');
    }else {
        if(user.password1 != password){
            console.log("unable to login");
            throw new Error('not match')
        }else {
            console.log('login ')
            return user;
        }
    }  
}

 
const User= mongoose.model("User" , UserSchema);

module.exports = User