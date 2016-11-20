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

router.route('/user/preset/wechat/:id')
    .post(urlencodedParser, User.AddPresetByLinkId)




//---------------- 药师注册
var Doctor = require('../db/controller/doctor');

router.route('/doctors/:number')
    .get(Doctor.GetAllDoctors);//
router.route('/doctors/:number/all')
    .get(Doctor.GetAll);//

router.route('/doctors/notfocus/:user')
    .get(Doctor.GetAllNotFocus);//

router.route('/doctors/find/:number/:skip')
    .get(Doctor.GetAndSkip);//

router.route('/doctor/cell/:cell')
    .get(Doctor.GetByCell);
router.route('/doctor/userid/:userid')
    .get(Doctor.GetByUserId);

router.route('/doctor/:id')
    .get(Doctor.GetById)
    .delete(Doctor.DeleteByUserId)
    .post(urlencodedParser, Doctor.AddByUserId)
    .patch(urlencodedParser, Doctor.UpdateByUserId);


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
    .get(Relationship.GetByDoctorId)
    .delete(Relationship.DeleteByDoctorId);
router.route('/relationships/user/:id')
    .get(Relationship.GetByUserId)
    .delete(Relationship.DeleteByUserId);
router.route('/relationships/group/:group')
    .get(Relationship.GetByGroupId);

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

router.route('/chatroom/find/:doctorId/:userId')
    .get(Chatroom.GetByDoctorIdUserId);

router.route('/chatroom')
    .post(urlencodedParser, Chatroom.FindOrAdd);

router.route('/chatroom/:id')
    .get(Chatroom.GetById)
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
    .patch(urlencodedParser, Chat.UpdateById)
    .delete(Chat.DeleteById);

router.route('/chats/chatroom/:chatroom')
    .delete(Chat.DeleteByChatroom);

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
router.route('/schedules/cms/populated')
    .get(Schedule.GetAllPopulated);


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
router.route('/bookings/cms/populated')
    .get(Booking.GetAllPopulated);

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

//---------------- 系统全局变量
var Const = require('../db/controller/const');

router.route('/consts')
    .get(Const.GetAll);

router.route('/const')
    .post(urlencodedParser, Const.Add);

router.route('/const/:id')
    .delete(Const.DeleteById)
    .patch(urlencodedParser, Const.UpdateById);

router.route('/const/:name')
    .get(Const.GetByName);


//===================================== Version 1.0

//---------------- 问卷调查类别/section
var SurveyCat = require('../db/controller/surveyCat');

router.route('/surveycats')
    .get(SurveyCat.GetAll);
router.route('/surveycats/department/:did')
    .get(SurveyCat.GetSurveyCatsByDepartmentId);

router.route('/surveycat')
    .post(urlencodedParser, SurveyCat.Add);

router.route('/surveycat/:id')
    .get(SurveyCat.GetById)
    .delete(SurveyCat.DeleteById)
    .patch(urlencodedParser, SurveyCat.UpdateById);


//---------------- 问卷调查,包含问题
var Survey = require('../db/controller/survey');

router.route('/surveys')
    .get(Survey.GetAll);

router.route('/surveys/cat/:catid')
    .get(Survey.GetSurveysByCatId);
router.route('/surveys/department/:did')
    .get(Survey.GetSurveysByDepartmentId);

router.route('/survey')
    .post(urlencodedParser, Survey.Add);

router.route('/survey/:id')
    .get(Survey.GetById)
    .delete(Survey.DeleteById)
    .patch(urlencodedParser, Survey.UpdateById);

//---------------- 问卷调查集合
var SurveyGroup = require('../db/controller/surveyGroup');

router.route('/surveygroups')
    .get(SurveyGroup.GetAll);

router.route('/surveygroup')
    .post(urlencodedParser, SurveyGroup.Add);

router.route('/surveygroup/:id')
    .get(SurveyGroup.GetById)
    .delete(SurveyGroup.DeleteById)
    .patch(urlencodedParser, SurveyGroup.UpdateById);

//---------------- 药品管理
var Medicine = require('../db/controller/medicine');

router.route('/medicines')
    .get(Medicine.GetAll);

router.route('/medicines/available')
    .get(Medicine.GetAllAvailable);

// router.route('/medicines/cat/:catid')
//     .get(Medicine.GetMedicinesByCatId);

router.route('/medicine')
    .post(urlencodedParser, Medicine.Add);

router.route('/medicine/:id')
    .get(Medicine.GetById)
    .delete(Medicine.DeleteById)
    .patch(urlencodedParser, Medicine.UpdateById);

//---------------- 处方管理
var Prescription = require('../db/controller/prescription');

router.route('/prescriptions')
    .get(Prescription.GetAll);

router.route('/prescriptions/booking/:id')
    .get(Prescription.GetByBookingId);
router.route('/prescriptions/doctor/:id')
    .get(Prescription.GetByDoctorId);
router.route('/prescriptions/user/:id')
    .get(Prescription.GetByUserId);

router.route('/prescription')
    .post(urlencodedParser, Prescription.Add);

router.route('/prescription/:id')
    .get(Prescription.GetById)
    .delete(Prescription.DeleteById)
    .patch(urlencodedParser, Prescription.UpdateById);

//---------------- 宣教材料类别
var PageCat = require('../db/controller/pageCat');

router.route('/pagecats')
    .get(PageCat.GetAll);
router.route('/pagecats/department/:did')
    .get(PageCat.GetPageCatsByDepartmentId);

router.route('/pagecat')
    .post(urlencodedParser, PageCat.Add);

router.route('/pagecat/:id')
    .get(PageCat.GetById)
    .delete(PageCat.DeleteById)
    .patch(urlencodedParser, PageCat.UpdateById);


//---------------- 宣教材料
var Page = require('../db/controller/page');

router.route('/pages')
    .get(Page.GetAll);

router.route('/pages/cat/:catid')
    .get(Page.GetPagesByCatId);
router.route('/pages/department/:did')
    .get(Page.GetPagesByDepartmentId);

router.route('/page')
    .post(urlencodedParser, Page.Add);

router.route('/page/:id')
    .get(Page.GetById)
    .delete(Page.DeleteById)
    .patch(urlencodedParser, Page.UpdateById);


module.exports = router;
