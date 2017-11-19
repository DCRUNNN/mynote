var express = require('express');
var router = express.Router();

var { sequelize } = require("../config/db");

var User = sequelize.import("../models/user");
var Notebook = sequelize.import('../models/notebook');
var Page = sequelize.import('../models/page');

// var User = require('../models/user');

router.get('/', function (req, res, next) {
    res.render('login',{title: '用户登录界面哦！'});
});

router.get('/login',function (req,res,next) {
    res.redirect('/')
})

router.get('/signUp',function (req,res,next) {
    console.log("注册！");
    res.render('signUp',{title: '用户注册界面哦！'});

})

router.post('/index',function (request, response,next) {

    const self = this;


    if (request.body.username == undefined ||request.body.username == '') {
        response.render('error');
        return;
    }
    var username = request.body.username;
    var password = request.body.password;

    User.findOne({
        where:{
            username:username
        }
    }).then(function(message){
        var obj=JSON.stringify(message);
        var data = JSON.parse(obj);
        // console.log(data);
        // var realPassword = message.dataValues.password;
        var realPassword = data.password;
        if(realPassword===password){
            var user = data;

            Notebook.findAll({
                where:{
                    userID:data.userID
                }
            }).then(function(message){
                var notebookResult=JSON.stringify(message);
                // console.log(notebookResult)

                response.cookie('user', user);
                response.cookie('notebook', JSON.parse(notebookResult));
                response.render('index', { title: 'My Note', user: user, note:JSON.parse(notebookResult),pageMenu:[],pageContent:[] });

            });

            // response.redirect('/',{title:'My Note', user: user,note:note });
            return;
        }else{
            response.redirect('/');
        }

    });

    });

router.post('/signUp',function (request, response,next) {
    // var username = request.query.username;

    User.findAll({
        where: {
            username: request.body.username
        }
    }).then(function (message) {
        var obj=JSON.stringify(message);
        var data = JSON.parse(obj);
        var check=data[0]==undefined;
        if(check==false){
            response.render('404', {message: '该用户名已存在！'});
        }else{
            var user = {
                username: request.body.username,
                password: request.body.password,
                email:request.body.email,
                phoneNumber:request.body.phoneNumber,
                privilege:0
            };

            User.create(user).then(function(msg){
                response.redirect('/login');
            });
        }
    })


});

module.exports = router;
