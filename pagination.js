const Path = require('path');
const express = require('express');
const bodypares = require('body-parser');
const mongoose = require('mongoose')
var Util = require('./util');
const TestUser = require('./model/testUser');
var pagination = require('pagination')
var ejs = require('ejs')

const app = express()
const port = process.env.PORT || 3000;

const sum = Util.sub(5,15);
console.log(sum);

app.set('view engine' , 'ejs');
app.set('views', Path.join(__dirname ,'views'))

app.use(bodypares.json());
app.use(bodypares.urlencoded({extended: false}))

app.use(bodypares.json());
app.use(bodypares.urlencoded({extended: true}))


mongoose.connect('mongodb://localhost:27017/demo',{
    useNewUrlParser : true,
    useCreateIndex: true
    }).then(result => {
        app.listen(port, ()=>{
            console.log(`server is on port ${port}`);
        })
    }).catch(err =>{
        console.log(err);
    })

    app.get('/show' , async function(req , res){
        await res.render('show' ,{
             //pages: Math.ceil(count / perPage),
            pageTitle : 'show',
            path : '/show'
        })
    })

    app.get('/products/:page', function(req, res, next) {
        var perPage = 20
        var page = req.params.page || 1

        TestUser
            .find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, user) {
                TestUser.count().exec(function(err, count) {
                    console.log(count);
                    if (err) return next(err);
                    res.render('show' , {
                        users : user,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            })
    })


 

