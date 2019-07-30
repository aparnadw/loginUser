const User = require('../model/appModel');
const Image = require('../model/image') 
const Path = require('path');
const express = require('express');
const bodypares = require('body-parser');
const mongoose = require('mongoose')
const ejs = require('ejs');
const uuid = require('uuid/v4');   
var session = require('express-session');
const multer = require('multer');
const path = require('path')
var fs = require('fs');

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
/* register */
app.get('/singup' , async function(req , res){
    success_msg = req.flash('success_msg');
    await res.render('singup',{
        pageTitle : 'singup',
        path : '/singup',
        success_msg
    })
})

app.post('/addUser', async function(req , res ){
    const name = req.body.name;
    const email = req.body.email;
    const password1 = req.body.password1;
    const password2 = req.body.password2;
    //console.log('add user  -- ',name);

    User.findOne({email: email }, async function(err, result){
        if(err) throw err;
        if(result) {
            req.flash('success_msg','email is allready exist ')
            console.log("email: " + email);
            res.redirect('/singup');
        }
    });
            const user= new User({
                name : name,
                email : email,
                password1 : password1,
                password2 : password2
            })
            console.log(user);
    
            user.save().then(user =>{
                console.log('----  ',user);
                res.redirect('/login');      
            }).catch(err => {
                console.log('dupalicate value  '+ err);
                //res.send('allready exist ').status(400)
                req.flash('success_msg','error')
                res.redirect('/singup');
            })  
} )



/* login */
app.get('/login' , async function(req , res){
    success_msg = req.flash('success_msg');
        await res.render('login' ,{
            session: req.session,
            path : '/login',
            success_msg
        })
    })
const auth = (req, res, next) => {
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
    const email = req.body.email;
    const password = req.body.password;
    const user = User.findByCredentials(email, password)
    .then(user =>{      
       req.session.email = user.email;
       req.session.islogin=true;
       req.session.Userid = user._id;

        res.render('home', {
            session: req.session,
            User :user,
        })
        //res.redirect('/home');
        //res.redirect('/');
    }).catch(err => {
        console.log(err);
        req.flash('success_msg',' email and password not match')
        res.redirect('/login');
    })
})


app.get('/home', auth ,async function(req, res){
    await res.render('home', {
        path : '/home',
        session: req.session,
    })
})

app.use(express.static('uploads'))

        const storage = multer.diskStorage({
            destination :'./uploads/profile',
            filename: function(req , file,cb){
                cb(null ,file.originalname
                );
            }
        });
        const upload = multer({
            storage : storage,
        })

/* profile uplode */
app.post('/profile', auth, upload.single('photo')  ,async function(req ,res){
    console.log('start image uplode '); 
    let imagedata = req.file ; 
    console.log('onle file name  -   ' +imagedata)

    if(!imagedata){
        console.log(req.body.oldimage);
        imagedata = req.body.oldimage;
        console.log('1st ' +imagedata)    
    }else{
        imagedata = req.file.filename;
        console.log('2nd   ' +imagedata);   
    }
    console.log( 'result -     '+imagedata);
        await User.findByIdAndUpdate({_id: req.session.Userid },
            {$set:  {name : req.body.name, email : req.body.email  ,profile : imagedata} },
            {new:true})       
            .then(resultupdate =>{
                console.log(resultupdate)
                req.flash('success_msg',' update succesfully')
                res.render('home', {
                    session: req.session,
                    User : resultupdate,
                })
         }).catch((err)=>{
             console.log('-----------------catch --   '+err)
             res.send('error text'+err)
         })
        console.log('end image uplode '); 
         const number = User.find().count({ } , function(err , count) { 
           console.log('lenth of db -  ' + count);
        }) 
})

/* logout */
app.get('/logout', auth ,async function(req, res){
    await res.render('logout', {
        path : '/logout',
        session: req.session,
    })
})

app.post('/Userlogout',auth, function (req, res) {
    
    req.session.destroy(function (err) { })
    
    res.redirect('/')
    
    });


/* multipal image uplode   */
app.get('/multiUplods' , auth , async function(req , res) {

    await User.findById({_id : req.session.Userid})
    .then(result => {
         res.render('multiUplods' , {
            path : '/multiUplods',
            session : req.session,
            User : result
        })
    }).catch(err => {
        res.redirect('/home')
        console.log('ERROR - '+ err)
    })
})

app.post('/multiUplod' , auth ,upload.array('photo' , 10) , async function(req , res) {
    console.log ('multi user ');
    console.log(req.files); // use files for multi files uplode
    console.log(req.files.length);
    console.log(req.body);
    var array = [];
    for(var i=0 ; i< req.files.length ; i++){
        array[i] = req.files[i].filename;
        console.log(i +'----'+array[i]);
    
        console.log(array[i]);
        console.log('-------------------------')
        const image = new Image({
            UserName : req.body.name,
            image : array[i],
            UserID : req.body.ID
        })
        await image.save()
        .then(result => {
            // res.render('gallery', {
            //     path : '/gallery',
            //     session : req.session,
            //     User : result
            // })
            console.log('save image')
        }).catch( err =>{
            res.send('Error -   '+ err);
            console.log('ERROR  - '+ err)
        })
    }
})

/* gallery */
app.get('/gallery' , auth , async function(req , res , next){
    res.render('gallery' , {
        path : '/gallery',
        session : req.session,
    })
})

app.post('/gallerys', auth , async function(req, res,next0){
    console.log('gallerys data');
})




    
module.exports = app;






