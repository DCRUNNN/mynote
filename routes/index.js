var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var { sequelize } = require("../config/db");

var User = sequelize.import("../models/user");
var Notebook = sequelize.import('../models/notebook');
var Page = sequelize.import('../models/page');

var page = [];


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//

router.get('/ajax', function(req, res, next) {
    res.render('ajax');
});

router.get('', function (request, response,next) {
    console.log("zheli")
    if (request.cookies.user == undefined ||request.cookies.user == '') {
        // response.render('404',{message:'请输入用户名和密码'});
        response.redirect('/login');
        return;
    }else{
        response.render('index', { title: 'My Note', user:request.cookies.user, note:[], pageMenu:[],pageContent:[]});
    }
});


router.get('/', function (request, response,next) {
    console.log("这里！");
    if (request.cookies.user == undefined ||request.cookies.user == '') {
        // response.render('404',{message:'请输入用户名和密码'});
        response.redirect('/login');
        return;
    }else{
        response.render('index', { title: 'My Note', user:request.cookies.user, note:[], pageMenu:[],pageContent:[]});
    }
});

router.get('/index', function (request, response,next) {

    if (request.cookies.username == undefined ||request.cookies.username == '') {
        response.render('404',{message:'请输入用户名和密码'});
        response.redirect('/')
        return;
    }else{
        response.render('index', { title: 'My Note', user:request.cookies.user, note:[], pageMenu:[],pageContent:[]});
    }
});

function handleData(sectionResult) {
    // console.log(JSON.stringify(sectionResult));
    var hello = sectionResult;
    var getPage = function (callback) {
        var returnResult = [];
        Page.findAll({
            where: {
                sectionID: 1
            }
        }).then(function (message) {
            var returnResult = [];
            var pageResult = JSON.stringify(message);
            pageResult = JSON.parse(pageResult);
            if (pageResult == null) {
                pageResult = {title: '还没有内容呢！', content: '还没有内容呢！快来记录一下吧！'};
            }
            for(var i=0;i<pageResult.length;i++) {
                var temp = {
                    id:pageResult[i].pageID,
                    text:pageResult[i].title,
                };
                returnResult.push(temp);
            }
            callback(returnResult);
        })
    }
    getPage(function (data) {
        var returnResult = [];
        console.log(hello);
        for(var i=0;i<hello.length;i++) {
            var temp = {
                id: hello[i].sectionID,
                text: hello[i].title,
                children: data
            };
        }
        returnResult.push(temp);
        // console.log("~~~~~~~~~~~~~~~~~~")
        // console.log(JSON.stringify(returnResult));
        // console.log("~~~~~~~~~~~~~~~~~~")
        return {
            // data: JSON.stringify(returnResult),
            data:'[{"id":1,"text":"大一上啊！","children":[{"id":2,"text":"上大一啦！"},{"id":6,"text":"大一下啦！"}]}]',
            message: 'success'
        };
    });

}

function getPageParentID(sectionID) {

    Page.findAll({
        where: {
            sectionID: sectionID
        }
    }).then(function (message,callback) {
        var returnResult = [];
        var pageResult = JSON.stringify(message);
        pageResult = JSON.parse(pageResult);
        console.log(pageResult);
        console.log("=================haha")
        if(pageResult==null) {
            pageResult = {title:'还没有内容呢！',content:'还没有内容呢！快来记录一下吧！'};
        }
        // for(var i=0;i<pageResult.length;i++) {
        //     var temp = {
        //         id:pageResult[i].pageID,
        //         text:pageResult[i].title,
        //     };
        //     returnResult.push(temp);
        // }
        // console.log("!!!!!!!!!!!!!!!!!!!!!!!!")
        // console.log(returnResult);
        // console.log("!!!!!!!!!!!!!!!!!!!!!!!!")
        // return returnResult;
    })

}

function setData(sectionResult) {
    return handleData(sectionResult);
}

router.get('/addNotebook',function (request,response,next) {
    var title = request.query.title;
    var tag = request.query.tag;

    Notebook.find({
        where:{
            userID:request.cookies.user.userID
        },
        attributes: [
            [sequelize.fn('max', sequelize.col('notebookID')),'maxID']
        ]
    }, {
        raw: true
    }).then(function (message) {
        var maxID=JSON.parse(JSON.stringify(message)).maxID;
        var thisID = maxID + 1;

        var notebook = {
            notebookID: thisID,
            userID:request.cookies.user.userID,
            title:title,
            tag:tag
        };

        Notebook.create(notebook).then(function(msg){
            Notebook.findAll({
                where:{
                    userID:request.cookies.user.userID
                }
            }).then(function(message){
                var notebookResult=JSON.stringify(message);
                // console.log(notebookResult)
                response.cookie('notebook', JSON.parse(notebookResult));

                // response.render('index', { title: 'My Note', user: request.cookies.user, note:JSON.parse(notebookResult),pageMenu:request.cookies.pageMenu,pageContent:request.cookies.pageContent });
                return  response.json({
                    message:'success'
                })
            });
        });

    });

    // Notebook.findAll({
    //     where: {
    //         userID: request.cookies.user.userID
    //     },
    //     order: sequelize.col('notebookID','DESC')
    // }).then(function (message) {
    //     console.log(message)
    // });

    // Notebook.findOne({
    //     order:[
    //         sequelize.fn('max', sequelize.col('notebookID'))
    //     ]
    // }).then(function (message) {
    //     console.log(message);
    // });
})

router.get('/showPageMenu/:notebookID', function (request, response,next) {
    var notebookID = request.params.notebookID;
    console.log("here!!!");
    Page.findAll({
        where:{
            notebookID:notebookID
        }
    }).then(function(message){
        var pageResult = JSON.stringify(message);
        pageResult = JSON.parse(pageResult);
        console.log(pageResult);
        if(pageResult==null) {
            pageResult = {title:'还没有内容呢！',content:'还没有内容呢！快来记录一下吧！'};
        }
        response.cookie('pageMenu', pageResult);
        // response.json(pageResult);
        response.render('index', { title: 'My Note', user:request.cookies.user, note:request.cookies.notebook, pageMenu:pageResult,pageContent:{content:'请选择笔记！'}});


    });
});

router.get('/showPageContent/:pageID', function (request, response,next) {
    var pageID = request.params.pageID;
    console.log("here!!!");
    Page.findOne({
        where:{
            pageID:pageID
        }
    }).then(function(message){
        var pageResult = JSON.stringify(message);
        pageResult = JSON.parse(pageResult);
        console.log(pageResult);
        if(pageResult==null) {
            pageResult = {title:'还没有内容呢！',content:'还没有内容呢！快来记录一下吧！'};
        }
        response.cookie('pageContent', pageResult);
        console.log(pageResult);
        // response.json(pageResult);
        response.render('index', { title: 'My Note', user:request.cookies.user, note:request.cookies.notebook, pageMenu:request.cookies.pageMenu,pageContent:pageResult});
        response.json({message: 'success'});
    });
});

module.exports = router;

