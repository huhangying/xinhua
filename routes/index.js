var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
//通常 POST 内容的格式是 application/x-www-form-urlencoded, 因此要用下面的方式来使用
var urlencodedParser = bodyParser.urlencoded({ extended: false })



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '新华e药项目 API Server' });
});


//---------------- 用户注册
var User = require('../db/controller/user');

router.route('/users/:number')
    .get(User.GetAll);//

router.route('/user/:cell')
    .get(User.GetByCell);

router.route('/user/wechat/:id')
    .get(User.GetByLinkId)
    .post(urlencodedParser, User.AddByLinkId)
    .patch(urlencodedParser, User.UpdateByLinkId);




//---------------- 药师注册
var Doctor = require('../db/controller/doctor');

router.route('/doctors/:number')
    .get(Doctor.GetAll);//

router.route('/doctor/:id')
    .get(Doctor.GetByUserId)
    .post(urlencodedParser, Doctor.AddByUserId)
    .patch(urlencodedParser, Doctor.UpdateByUserId);

router.route('/doctor/cell/:cell')
    .get(Doctor.GetByCell);

router.route('/login')
    .patch(urlencodedParser, Doctor.Login);



module.exports = router;
