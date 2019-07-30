



const User = require('../model/appModel') 
const Path = require('path');
const express = require('express');
const bodypares = require('body-parser');
const mongoose = require('mongoose')
const ejs = require('ejs');
const uuid = require('uuid/v4');   
var session = require('express-session');

const app = express()
app.use(bodypares.json());

app.get('/' ,function(req , res){
    const {userID} = req.session;
     res.render('welcome' ,{
        pageTitle : 'welcome',
        userID,
        path : '/'
    })
})

app.get('/singup' , async function(req , res){
    await res.render('singup',{
        pageTitle : 'singup',
        name : '',
        username : '',
        email : '',
        password1 : '',
        password2 : '',
        path : '/singup'
    })
})

app.post('/addUser', async function(req , res , next){
    req.assets('name' ,'name is required').notEmpty();
    req.assets('username','user name is required').notEmpty();
    req.assets('email','user email is required').notEmpty();
    req.assets('password1','password is required').notEmpty();
    req.assets('password2','password is required').notEmpty();
    
    const error = req.validationErrors();
    if(!errors){

        const name = req.body.name;
        const username = req.body.username;
        const email = req.body.email;
        const password1 = req.body.password1;
        const password2 = req.body.password2;
        console.log('add user  -- ',name)
        const user= await new User({
            name : name,
            username : username,
            email : email,
            password1 : password1,
            password2 : password2
        })
        console.log(user);
         user.save().then(user , function(err , result){
            if(err){
                req.flash('error', err)
                 res.render('singup',{
                    pageTitle : 'singup',
                    name : '',
                    username : '',
                    email : '',
                    password1 : '',
                    password2 : '',
                    path : '/singup'
                })

            }else {
                req.flash('success', 'Data added successfully!')
                console.log('----  ',user);
                res.redirect('/login');
            }
            // console.log('----  ',user);
            // res.redirect('/login');      
        })
        // .catch(err => {
        //     console.log('dupalicate value');
        //     //res.send('allready exist ').status(400)
        //     res.redirect('/singup');
        // })
    } else {
        var error_message = '';
        error.forEach(function(error) {
            error_message += error_message + '<br>'
        });
        req.flash('error' , error_message);

        res.render('singup',{
            pageTitle : 'singup',
            name : '',
            username : '',
            email : '',
            password1 : '',
            password2 : '',
            path : '/singup'
        })
    }

} )

app.get('/login' , async function(req , res){
        await res.render('login' ,{
            //session: req.session,
            path : '/login'
        })
    })

    const auth = (req, res, next) => {
        console.log(req.session.user_name);
        console.log(req.session.islogin);
        if(!req.session.islogin){
        res.redirect('/login')
        }
        else {
        res.set('Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next()
        }
        } 

        

app.post('/loginuser', async function(req , res){
    const username = req.body.username;
    const password = req.body.password;
    const user = User.findByCredentials(username, password)
    .then(user =>{       
       req.session.user_name = user.username;
       req.session.islogin=true;
       req.session.email = user.email;
        console.log('userid set --- '+req.session.user_name)
        res.redirect('/home');
        //res.redirect('/');
    }).catch(err => {
        console.log(err);
        res.redirect('/login');
    })
})


app.get('/home', auth ,async function(req, res){
    await res.render('home', {
        path : '/home',
        session :  req.session.qqq,
    })
})

app.post('/logout',auth, function (req, res) {
    
    req.session.destroy(function (err) { })
    
    res.redirect('/')
    
    });


    
module.exports = app;Login