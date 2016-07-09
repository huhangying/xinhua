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

router.route('/user/:id')
    .get(User.GetById)
    .delete(User.DeleteById); // for test

router.route('/user/cell/:cell')
    .get(User.GetByCell);

router.route('/user/wechat/:id')
    .get(User.GetByLinkId)
    .post(urlencodedParser, User.AddByLinkId)
    .patch(urlencodedParser, User.UpdateByLinkId);




//---------------- 药师注册
var Doctor = require('../db/controller/doctor');

router.route('/doctors/:number')
    .get(Doctor.GetAll);//
router.route('/doctors/find/:number/:skip')
    .get(Doctor.GetAndSkip);//

router.route('/doctor/:id')
    .get(Doctor.GetById)
    .delete(Doctor.DeleteByUserId)
    .post(urlencodedParser, Doctor.AddByUserId)
    .patch(urlencodedParser, Doctor.UpdateByUserId);

router.route('/doctor/cell/:cell')
    .get(Doctor.GetByCell);
router.route('/doctor/userid/:userid')
    .get(Doctor.GetByUserId);

router.route('/doctors/department/:departmentid')
    .get(Doctor.GetByDepartmentId);//

router.route('/login/doctor')
    .patch(urlencodedParser, Doctor.Login);
router.route('/doctor/passwd/:did')
    .get(Doctor.GetPassword);//


//---------------- 医患关系组
var Group = require('../db/controller/group');

router.route('/groups')
    .get(Group.GetAll);
router.route('/groups/populated')
    .get(Group.GetAllPopulated);

router.route('/groups/doctor/:id')
    .get(Group.GetByDoctorId);

router.route('/group/:id')
    .get(Group.GetById)
    .patch(urlencodedParser, Group.UpdateById)
    .delete(Group.DeleteById);

router.route('/group')
    .post(urlencodedParser, Group.FindOrAdd);


//---------------- 医患关系
var Relationship = require('../db/controller/relationship');

router.route('/relationships')
    .get(Relationship.GetAll);

router.route('/relationships/doctor/:id')
    .get(Relationship.GetByDoctorId);
router.route('/relationships/user/:id')
    .get(Relationship.GetByUserId);

router.route('/relationship/:id')
    .get(Relationship.GetById)
    .patch(urlencodedParser, Relationship.UpdateById)
    .delete(Relationship.DeleteById);

router.route('/relationship')
    .post(urlencodedParser, Relationship.FindOrAdd);


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


router.route('/chatrooms/check/doctor/:id')
    .get(Chatroom.CheckDoctorMsg);
router.route('/chatrooms/check/user/:id')
    .get(Chatroom.CheckUserMsg);
//router.route('/chatroom/:userid/:doctorid')
//    .get(Chatroom.GetByUseIdAndDoctorId);


//---------------- 聊天 chat
var Chat = require('../db/controller/chat');

router.route('/chats')
    .get(Chat.GetAll);

router.route('/chat/:id')
    .get(Chat.GetById)
    .delete(Chat.DeleteById);

router.route('/chat')
    .post(urlencodedParser, Chat.Add);


router.route('/chat/send')
    .post(urlencodedParser, Chat.SendMsg);

router.route('/chats/receive')
    .post(urlencodedParser, Chat.ReceiveMsg);

router.route('/chats/load/doctor/:chatroom')
    .get(Chat.LoadDoctorMsg);
router.route('/chats/load/user/:chatroom')
    .get(Chat.LoadUserMsg);
router.route('/chats/load/:chatroom')
    .get(Chat.LoadMsg);


//---------------- 门诊
var Schedule = require('../db/controller/schedule');

router.route('/schedules')
    .get(Schedule.GetAll);

router.route('/schedules/:did')
    .get(Schedule.GetByDoctorId);
router.route('/schedules/all/:did') // for test
    .get(Schedule.GetAllByDoctorId);
router.route('/schedules/:did/:date')
    .get(Schedule.GetByDoctorIdAndDate);

router.route('/schedule')
    .post(urlencodedParser, Schedule.Add);

router.route('/schedule/:id')
    .get(Schedule.GetById)
    .patch(urlencodedParser, Schedule.UpdateById)
    .delete(Schedule.DeleteById);

router.route('/schedules/find/doctors/:departmentid')
    .get(Schedule.FindScheduleDoctorsByDepartmentId);

//---------------- 门诊时间端
var Period = require('../db/controller/period');

router.route('/periods')
    .get(Period.GetAll);

router.route('/period/:id')
    .get(Period.GetById)
    .patch(urlencodedParser, Period.UpdateById)
    .delete(Period.DeleteById);

router.route('/period')
    .post(urlencodedParser, Period.Add);

//---------------- 预约
var Booking = require('../db/controller/booking');

router.route('/bookings')
    .get(Booking.GetAll);

router.route('/bookings/user/:uid')
    .get(Booking.GetByUserId);

router.route('/bookings/doctor/:did')
    .get(Booking.GetByDoctorId);
router.route('/bookings/doctor/:did/:date')
    .get(Booking.GetByDoctorIdAndDate);

router.route('/bookings/schedule/:sid')
    .get(Booking.GetByScheduleId);

router.route('/booking')
    .post(urlencodedParser, Booking.Add);

router.route('/booking/:id')
    .get(Booking.GetById)
    .patch(urlencodedParser, Booking.UpdateById)
    .delete(Booking.DeleteById);


module.exports = router;
