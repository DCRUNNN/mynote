var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function (request, response,next) {
    var user = {
        username: 'DC',
        password: 'admin'
    }
    response.render('index', { title: 'My Note', user: user });
});

router.route('/login')
    .get(function (request, response,next) {
        response.render('login', {title: '用户登录界面'});
    })
    .post(function (request, response,next) {
        var user = {
            username: 'DC',
            password:'admin'
        };
        if(request.body.username === user.username && request.body.password === user.password) {
            response.redirect('/');
        }
        response.redirect('/login');
    });

router.get('/index', function (request, response,next) {
    response.redirect('/')
});

router.get('/logout', function(req, res,next) {
    res.redirect('/login');
});


module.exports = router;

