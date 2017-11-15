var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var { sequelize } = require("../config/db");

var User = sequelize.import("../models/user");
var Notebook = sequelize.import('../models/notebook');
var Section = sequelize.import('../models/section');
var Page = sequelize.import('../models/page');

var section = [{title:'大学'},{title:'阅读'},{title:'生活'}];

var page = [];


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//

router.get('/ajax', function(req, res, next) {
    res.render('ajax');
});

router.post('/req_ajax', urlencodedParser, function(req, res, next){
    /* req.body对象
       包含POST请求参数。
       这样命名是因为POST请求参数在REQUEST正文中传递，而不是像查询字符串在URL中传递。
       要使req.body可用，可使用中间件body-parser
    */
    var type = req.body.type;
    var info = req.body.info;
    console.log("服务器收到一个Ajax ["+type+"] 请求，信息为："+info);
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.json(['success', "服务器收到一个Ajax ["+type+"] 请求，信息为："+info]);
});

router.get('/req_ajax', function(req, res, next){
    /* req.query对象
       通常称为GET请求参数。
       包含以键值对存放的查询字符串参数
       req.query不需要任何中间件即可使用
    */
    var type = req.query.type;
    var info = req.query.info;
    console.log("服务器收到一个Ajax ["+type+"] 请求，信息为："+info);
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.json(['success', "服务器收到一个Ajax ["+type+"] 请求，信息为："+info]);
});


router.get('/', function (request, response,next) {
    if (request.body.username == undefined ||request.body.username == '') {
        response.render('404',{message:'请输入用户名和密码'});
        return;
    }
});

router.get('/index', function (request, response,next) {

    if (request.body.username == undefined ||request.body.username == '') {
        response.render('404',{message:'请输入用户名和密码'});
        response.redirect('/')
        return;
    }

    User.findOne({
        where:{
            username:username
        }
    }).then(function(message){
        console.log(JSON.stringify(message))
    });


    var user = {username: request.body.username};

    var note=[{title:'大学'},{title:'阅读'},{title:'生活'}];

    response.render('index', { title: 'My Note', user: user,note:note });
});


router.get('/showSection/:notebookID', function (request, response,next) {

    var type = request.query.type;
    var info = request.query.info;

    var notebookID = request.params.notebookID;
    console.log(notebookID);

    Section.findAll({
        where:{
            notebookID:notebookID
        }
    }).then(function(message){
        var sectionResult = JSON.stringify(message);
        sectionResult = JSON.parse(sectionResult);
        response.cookie('section', sectionResult);
        console.log(sectionResult);
        response.setHeader("Access-Control-Allow-Origin", "*")
        // response.render('index', { title: 'My Note', user:request.cookies.user, note:request.cookies.notebook, sect:sectionResult,page:[]});
        // response.json(['success', '[{"id":1,"text":"Root node22","children":[{"id":2,"text":"Child node 1"},{"id":3,"text":"Child node 2"}]}]']);
        response.json({data:'[{"id":1,"text":"Root node22","children":[{"id":2,"text":"Child node 1"},{"id":3,"text":"Child node 2"}]}]', message: 'success'})
    });
});

router.get('/showPage/:sectionID', function (request, response,next) {

    var sectionID = request.params.sectionID;
    console.log("here!!!");

    Page.findOne({
        where:{
            sectionID:sectionID,
        }
    }).then(function(message){
        var pageResult = JSON.stringify(message);
        pageResult = JSON.parse(pageResult);
        console.log(pageResult);
        if(pageResult==null) {
            pageResult = {title:'还没有内容呢！',content:'还没有内容呢！快来记录一下吧！'};

        }
        response.cookie('page', pageResult);


        response.render('index', { title: 'My Note', user:request.cookies.user, note:request.cookies.notebook, sect:request.cookies.section, page:pageResult});


    });
});

// router.route('/login')
//     .get(function (req,res,next) {
//     res.render('login', {title: '用户登录界面a a'});
// })
//     .post(function (request, response,next) {
//         var user = {
//             username: 'DC',
//             password:'admin'
//         };
//         console.log("======");
//
//         console.log(request.body);
//
//         console.log("======");
//
//         if(request.body.username === user.username && request.body.password === user.password) {
//             response.redirect('/')
//         }
//         response.redirect('/login');
//     });

// router.get('/login',function (req,res,next) {
//     res.render('login', {title: '用户登录界面heihei'});
// })


module.exports = router;

