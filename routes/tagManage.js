var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var { sequelize } = require("../config/db");

var User = sequelize.import("../models/user");
var Notebook = sequelize.import('../models/notebook');
var Page = sequelize.import('../models/page');
var Tag = sequelize.import('../models/tag');

/* GET users listing. */

router.get('/getNotebookByTag', function(request, response, next) {
    var notebookTag = request.query.notebookTag;

    if(notebookTag=="所有"){
        return response.json({
            message: 'success',
            data: request.cookies.notebook
        });
    }else{
        Notebook.findAll({
            where:{
                userID:request.cookies.user.userID,
                tag:notebookTag
            }
        }).then(function(message){
            var notebookResult=JSON.stringify(message);
            return response.json({
                message: 'success',
                data: JSON.parse(notebookResult)
            });

        });
    }

});

router.get('/getPageByTag', function(request, response, next) {
    var pageTag = request.query.pageTag;

    if(pageTag=="所有"){
        return response.json({
            message: 'success',
            data: request.cookies.pageResultForTag
        });
    }else{
        Page.findAll({
            where:{
                userID:request.cookies.user.userID,
                tag:pageTag
            }
        }).then(function(message){
            var pageResult=JSON.stringify(message);
            return response.json({
                message: 'success',
                data: JSON.parse(pageResult)
            });

        });
    }

});

router.get('/addNotebookTag', function(request, response, next) {
    var notebookTag = request.query.notebookTag;

    var tag = {
        tagID: "",
        type: "笔记本",
        value: notebookTag,
        userID: request.cookies.user.userID
    };

    Tag.create(tag).then(function(msg){
        Tag.findAll({
            where:{
                type:"笔记本",
                userID:request.cookies.user.userID

            }
        }).then(function(message){
            var notebookTagResult=JSON.stringify(message);
            response.cookie('notebookTagResult', JSON.parse(notebookTagResult));
            return  response.json({
                message:'success'
            })
        });
    });


});

router.get('/addPageTag', function(request, response, next) {
    var pageTag = request.query.pageTag;

    var tag = {
        tagID: "",
        type: "笔记",
        value: pageTag,
        userID: request.cookies.user.userID
    };

    Tag.create(tag).then(function(msg){
        Tag.findAll({
            where:{
                type:"笔记",
                userID:request.cookies.user.userID
            }
        }).then(function(message){
            var pageTagResult=JSON.stringify(message);
            response.cookie('pageTagResult', JSON.parse(pageTagResult));
            // response.render('index', { title: 'My Note', user: request.cookies.user, note:JSON.parse(notebookResult),pageMenu:request.cookies.pageMenu,pageContent:request.cookies.pageContent });
            return  response.json({
                message:'success'
            })
        });
    });


});



module.exports = router;
