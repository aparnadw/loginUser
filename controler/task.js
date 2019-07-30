const User = require('../model/appModel');
const {Task , TaskImage}= require('../model/TaskModel');
//const TaskImage = require('../model/Taskimage');
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
app.get('/TaskCreategallery'  , async function(req , res , next){
    res.render('TaskCreategallery' , {
        path : '/TaskCreategallery'
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

app.post('/multiUplodTask'  ,upload.array('photo' , 10) , async function(req , res) {
    console.log ('multi user ');
   
    console.log(req.body.name);
    var array = [];
     
    const task = new Task({
        name :  req.body.name,
        email : req.body.email
    })
    var imageData;
    var hello;
    await task.save()
            .then(result => {
                console.log(result);
                console.log(req.files.length);

                    for(var i=0 ; i< req.files.length ; i++){
                    array[i] = req.files[i].filename;
                    console.log(i +'----'+array[i]);
                
                    const taskImage = new TaskImage({
                        image : array[i],
                        UserID : result._id
                    })
                    console.log(taskImage);
                    console.log('-------------------------')
                    taskImage.save()
                    .then(result1 =>{
                        hello = "hello",
                        imageData = result1, 
                        console.log('save image')
                    }).catch( eTaskImagerr =>{
                        res.send('Error -   '+ err);
                        console.log('ERROR  - '+ err)
                    })
                } 
                
            res.redirect('/taskGallery')   

            }).catch(err => {
                res.send('ERROR   - '+ err);
            })
})

// <% taskimage.image.forEach(function(img){  %>
//     <img src="../profile/<%- img %>" height="200" width="200" style="margin: 20px">                                   
//    <% }) %>


app.get('/taskGallery'  , async function(req , res , next){

    console.log('data')
    await TaskImage.find({})
    .populate('UserID','name')
   .then(result => {
       console.log(result);
       const imagename = result[0].image;
       console.log(imagename);
       const name = result[0].UserID.name;
       console.log(name);
       console.log('-----------------------');
    res.render('taskGallery' , {
            path : '/taskGallery',
            Result :result
        })
    //res.send(result)
   
   }).catch(err => {
       console.log(err);
       res.send(err);
   })
})



//-------------------------------------------------------------------------------------//
//uniq id
app.get('/uid' ,  function(req , res) {
    //console.log(res);
    const uniqueId = uuid()
    console.log(uniqueId);
    res.send(`Hit home page. Received the unique id: ${uniqueId}\n`)
})

// helper function
app.locals.add = function(num1 , num2){
    console.log(num1+num2)
    return num1+num2;
    }


app.locals.findData = function() {
        const data = User.find({username : 'aparna321'})
        .then(result => {
            console.log(result);
            const show = result[0].name.toString();
            console.log(show);
            return show;
            res.send(show);
        }).catch(err => {
            console.log(err);
        })
        }

// locals ke andar function banna ke return kare ge nahi return kare ga 
// but function ke andar locals banna kar kare ge to ho jaye ga
app.use(function(req,res,next){
    User.find({name : 'aparna'},function(err,result){
        if(err){
            console.log(err)
        }else{
            const show = result[0].name.toString();
            res.locals.greet=function(){
                return show;
            }
            next();
        }
    })
});

app.get('/ejsHelper', async function(req, res){
        await res.render('ejsHelper', {
                path : '/ejsHelper'
     })
})

app.use(function(req,res,next){
    User.find({},function(err,result){
        if(err){
             console.log(err)
        }else{           
            res.locals.greet=function(name){      //helper function        
            for(var i =0; i<=500;i++ ){
                if(result[i].name.toString()===name){
                return result[i].name.toString();
                break;
                }
                }         
            }
            next();
        }
    })         
});             
 

      
module.exports = app;


// app.post('/multiUplodTask'  ,upload.array('photo' , 10) , async function(req , res) {
//     console.log ('multi user ');
   
//     console.log(req.body.name);
//     var array = [];
     
//     const task = new Task({
//         name :  req.body.name,
//         email : req.body.email
//     })
//     var imageData;
//     var hello;
//     await task.save()
//             .then(result => {
//                 console.log(result);
//                 console.log(req.files.length);

//                     for(var i=0 ; i< req.files.length ; i++){
//                     array[i] = req.files[i].filename;
//                     console.log(i +'----'+array[i]);
                
//                     const taskImage = new TaskImage({
//                         image : array[i],
//                         UserID : result._id
//                     })
//                     console.log(taskImage);
//                     console.log('-------------------------')
//                     taskImage.save()
//                     .then(result1 =>{
//                         hello = "hello",
//                         imageData = result1, 
//                         console.log('save image')
//                     }).catch( eTaskImagerr =>{
//                         res.send('Error -   '+ err);
//                         console.log('ERROR  - '+ err)
//                     })
//                 } 
                
//             res.redirect('/taskGallery')   

//             }).catch(err => {
//                 res.send('ERROR   - '+ err);
//             })
// })