const Path = require('path');
const express = require('express');
const bodypares = require('body-parser');
const mongoose = require('mongoose')
const ejs = require('ejs');
const session = require('express-session');
const Util = require('./util');
const uuid = require('uuid/v4');
const multer = require('multer');

const expressMongoDb = require('express-mongo-db');
const flash = require('express-flash');
const methodOverride = require('method-override');
const cockieParser = require('cookie-parser');

const appControler = require('./controler/appControler');
const task = require('./controler/task');

const app = express();

const port = process.env.PORT || 3000;

// const sum = Util.sub(5,15);
// console.log(sum);

app.set('view engine' , 'ejs');
app.set('views', Path.join(__dirname ,'views'))
app.use(express.static(__dirname + "/public"));

app.use(express.static('uploads'))

app.use(bodypares.json());
app.use(bodypares.urlencoded({extended: true}));
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //cookie: { maxAge: 60000 }
}))
app.use(flash());

// app.use(methodOverride(function (req, res){
//     if(req.body && typeof req.body === 'object' && '_method' in req.body){
//         const method = req.body._method
//         delete req.body._method
//         return method
//     }
// }))

app.use('/', appControler);
//app.use('/', task);

// session se name find out karne ke liye 
app.get('*', function(req,res, next){
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
})

mongoose.connect('mongodb://localhost:27017/webmongose',{
    useNewUrlParser : true,
    useCreateIndex: true
    }).then(result => {
        app.listen(port, ()=>{
            console.log(`server is on port ${port}`);
        })
    }).catch(err =>{
        console.log(err);
    })

