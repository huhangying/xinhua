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
    .delete(Doctor.DeleteByUserId)
    .post(urlencodedParser, Doctor.AddByUserId)
    .patch(urlencodedParser, Doctor.UpdateByUserId);

router.route('/doctor/cell/:cell')
    .get(Doctor.GetByCell);
router.route('/doctor/userid/:userid')
    .get(Doctor.GetByUserId);

router.route('/login')
    .patch(urlencodedParser, Doctor.Login);


//---------------- 医院科室
var Department = require('../db/controller/department');

router.route('/departments')
    .get(Department.GetAll);

router.route('/department')
    .post(urlencodedParser, Department.Add);

router.route('/department/:id')
    .get(Department.GetById)
    .delete(Department.DeleteById)
    .patch(urlencodedParser, Department.UpdateById);


//---------------- 疾病类别
var Disease = require('../db/controller/disease');

router.route('/diseases')
    .get(Disease.GetAll);

router.route('/diseases/:did') // 获得科室下的疾病类别
    .get(Disease.GetByDepartmentId);

router.route('/disease')
    .post(urlencodedParser, Disease.Add);

router.route('/disease/:id')
    .get(Disease.GetById)
    .delete(Disease.DeleteById)
    .patch(urlencodedParser, Disease.UpdateById);


//---------------- 聊天室
var Chatroom = require('../db/controller/chatroom');

router.route('/chatrooms')
    .get(Chatroom.GetAll);

router.route('/chatrooms/doctor/:id')
    .get(Chatroom.GetByDoctorId);
router.route('/chatrooms/user/:id')
    .get(Chatroom.GetByUserId);

router.route('/chatroom')
    .post(urlencodedParser, Chatroom.FindOrAdd);

router.route('/chatroom/:id')
    .patch(urlencodedParser, Chatroom.UpdateById)
    .delete(Chatroom.DeleteById);



//---------------- 聊天 chat
var Chat = require('../db/controller/chat');

router.route('/chats')
    .get(Chat.GetAll);

router.route('/chat/:id')
    .get(Chat.GetById)
    .delete(Chat.DeleteById);;

router.route('/chat')
    .post(urlencodedParser, Chat.Add);




module.exports = router;
