var express = require('express');
var router = express.Router();

var { sequelize } = require("../config/db");

var User = sequelize.import("../models/user");
var Notebook = sequelize.import('../models/notebook');
var Section = sequelize.import('../models/section');
var Page = sequelize.import('../models/page');

// var User = require('../models/user');

router.get('/', function (req, res, next) {
    res.render('login',{title: '用户登录界面哦！'});
});


router.get('/login',function (req,res,next) {
    res.redirect('/')
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
                response.render('index', { title: 'My Note', user: user, note:JSON.parse(notebookResult),sect:[],page:[] });
            });

            // response.redirect('/',{title:'My Note', user: user,note:note });
            return;
        }else{
            response.redirect('/');
        }

    });

    });

module.exports = router;
