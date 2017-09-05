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
    .post(urlencodedParser, User.AddPresetByLinkId);

router.route('/users/search') //GET
    .post(urlencodedParser, User.Search)


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

// 药师快捷回复
router.route('/doctor/shortcuts/:did')
    .get(Doctor.GetShortcuts)
    .patch(urlencodedParser, Doctor.UpdateShortcuts);
// 药师的基本信息: 
router.route('/doctor/brief/:did')
    .get(Doctor.GetBriefInfo);//

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
router.route('/relationship/:did/:uid')
    .get(Relationship.CheckIfRelationshipExisted);

router.route('/relationship')
    .post(urlencodedParser, Relationship.FindOrAdd);


router.route('/relationships/doctor/:id/select')  // 返回用户组和用户信息: [group name, group id,] user name, user id
    .get(Relationship.GetSelectionByDoctorId);
router.route('/relationships/doctor/:id/userdetails')  // 用于药师用户管理, 返回用户信息: [name, cell id,] user name, user id
    .get(Relationship.GetUserDetailsByDoctorId);


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
router.route('/schedule/find/:did/:period/:date')
    .get(Schedule.GetByDoctorPeriodDate);

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
router.route('/bookings/today/doctor/:did')
    .get(Booking.GetTodaysByDoctorId);

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



//---------------- 问卷模版,包含问题
var SurveyTemplate = require('../db/controller/surveyTemplate');

router.route('/surveytemplates')
    .get(SurveyTemplate.GetAll);

router.route('/surveytemplates/:department/type/:type')
    .get(SurveyTemplate.GetSurveyTemplatesByType);
router.route('/surveytemplates/:department/type/:type/:list')
    .get(SurveyTemplate.GetSurveyTemplatesByTypeAndList);
router.route('/surveytemplates/department/:did')
    .get(SurveyTemplate.GetSurveyTemplatesByDepartmentId);

router.route('/surveytemplate')
    .post(urlencodedParser, SurveyTemplate.Add);

router.route('/surveytemplate/:id')
    .get(SurveyTemplate.GetById)
    .delete(SurveyTemplate.DeleteById)
    .patch(urlencodedParser, SurveyTemplate.UpdateById);

//---------------- 问卷调查,包含问题
var Survey = require('../db/controller/survey');

router.route('/surveys')
    .get(Survey.GetAll);

router.route('/surveys/:doctor/:user/:type/:readonly')
    .get(Survey.GetSurveysByUserType);
router.route('/surveys/:doctor/:user/:type/:list/:readonly')
    .get(Survey.GetSurveysByUserTypeAndList);

router.route('/mysurveys/:user')
    .get(Survey.GetMySurveys);
router.route('/surveys/department/:did')
    .get(Survey.GetSurveysByDepartmentId);

router.route('/survey')
    .post(urlencodedParser, Survey.Add);

router.route('/survey/:id')
    .get(Survey.GetById)
    .delete(Survey.DeleteById)
    .patch(urlencodedParser, Survey.UpdateById);

router.route('/surveys/close/:doctor/:user') // set finished=true for type in [1,2,5]
    .patch(urlencodedParser, Survey.CloseAllRelativeSurveys);

//---------------- 问卷调查集合
var SurveyGroup = require('../db/controller/surveyGroup');

router.route('/surveygroups')
    .get(SurveyGroup.GetAll);

router.route('/surveygroups/:department/type/:type')
    .get(SurveyGroup.GetSurveyGroupsByType);

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
var ArticleCat = require('../db/controller/articleCat');

router.route('/articlecats')
    .get(ArticleCat.GetAll);
router.route('/articlecats/department/:did')
    .get(ArticleCat.GetArticleCatsByDepartmentId);

router.route('/articlecat')
    .post(urlencodedParser, ArticleCat.Add);

router.route('/articlecat/:id')
    .get(ArticleCat.GetById)
    .delete(ArticleCat.DeleteById)
    .patch(urlencodedParser, ArticleCat.UpdateById);


//---------------- 宣教材料模板
var ArticleTemplate = require('../db/controller/articleTemplate');

router.route('/templates')
    .get(ArticleTemplate.GetAll);

router.route('/templates/cat/:catid')
    .get(ArticleTemplate.GetArticleTemplatesByCatId);
router.route('/templates/department/:did')
    .get(ArticleTemplate.GetArticleTemplatesByDepartmentId);

router.route('/template')
    .post(urlencodedParser, ArticleTemplate.Add);

router.route('/template/:id')
    .get(ArticleTemplate.GetById)
    .delete(ArticleTemplate.DeleteById)
    .patch(urlencodedParser, ArticleTemplate.UpdateById);

//---------------- 宣教材料文章页面
var ArticlePage = require('../db/controller/articlePage');

router.route('/pages')
    .get(ArticlePage.GetAll);

router.route('/pages/cat/:catid')
    .get(ArticlePage.GetArticlePagesByCatId);
router.route('/pages/doctor/:did')
    .get(ArticlePage.GetArticlePagesByDoctorId);

router.route('/page')
    .post(urlencodedParser, ArticlePage.Add);

router.route('/page/:id')
    .get(ArticlePage.GetById)
    .delete(ArticlePage.DeleteById)
    .patch(urlencodedParser, ArticlePage.UpdateById);

router.get('/article/:id', ArticlePage.RenderById); // 显示页面

//---------------- 微信失败的发送消息 LOG
var MessageLog = require('../db/controller/messageLog');

router.route('/messagelogs')
    .get(MessageLog.GetAll);

router.route('/messagelogs/doctor/:did')
    .get(MessageLog.GetMessageLogsByDoctor);
router.route('/messagelogs/user/:uid')     // 只返回用户没有收到的
    .get(MessageLog.GetMessageLogsByUser);

router.route('/messagelog')
    .post(urlencodedParser, MessageLog.Add);

router.route('/messagelog/:id')
    .get(MessageLog.GetById)
    .delete(MessageLog.DeleteById)
    .patch(urlencodedParser, MessageLog.UpdateById);


//---------------- 不良反应(基于科室)
var AdverseReaction = require('../db/controller/adverseReaction');

router.route('/adversereactions')
    .get(AdverseReaction.GetAll);
router.route('/adversereactions/department/:did')
    .get(AdverseReaction.GetByDepartmentId);

router.route('/adversereaction')
    .post(urlencodedParser, AdverseReaction.Add);

router.route('/adversereaction/:id')
    .get(AdverseReaction.GetById)
    .delete(AdverseReaction.DeleteById)
    .patch(urlencodedParser, AdverseReaction.UpdateById);

//---------------- 用户反馈
var UserFeedback = require('../db/controller/userFeedback');

router.route('/feedbacks')
    .get(UserFeedback.GetAll);

router.route('/feedbacks/user/:type/:uid')
    .get(UserFeedback.GetByUserId);

router.route('/feedbacks/user/:type/:uid/:did')
    .get(UserFeedback.GetByUserIdDoctorId);

router.route('/feedbacks/doctor/:type/:did')
    .get(UserFeedback.GetByDoctorId);
router.route('/feedbacks/unread/:type/:did')
    .get(UserFeedback.GetUnreadByDoctorId);
router.route('/feedback/unreadcount/:type/:did')
    .get(UserFeedback.GetUnreadCountByDoctorId);

router.route('/feedbacks/unread/:type/:did/:uid')
    .get(UserFeedback.GetUnreadByDoctorIdUserId);

router.route('/feedback')
    .post(urlencodedParser, UserFeedback.Add);

router.route('/feedback/:id')
    .get(UserFeedback.GetById)
    .patch(urlencodedParser, UserFeedback.UpdateById);

//---------------- 药师坐诊
var Diagnose = require('../db/controller/diagnose');

router.route('/diagnose/:doctor/:user')
    .get(Diagnose.GetByUserAndDoctor);

router.route('/diagnoses/currentmonth/:doctor')
    .get(Diagnose.GetCurrentMonthFinishedByDoctor);

router.route('/diagnoses/history/:user')
    .get(Diagnose.GetUserHistoryList);
router.route('/diagnose/history/latest/:user')
    .get(Diagnose.GetUserLatestDiagnose);


router.route('/diagnose')
    .post(urlencodedParser, Diagnose.Add);

router.route('/diagnose/:id')
    .get(Diagnose.GetById)
    .delete(Diagnose.DeleteById)
    .patch(urlencodedParser, Diagnose.UpdateById);

// 药师评估
router.route('/diagnose-assessment/:id')
    .get(Diagnose.GetAssessmentById)
    .patch(urlencodedParser, Diagnose.UpdateAssessmentById);

// 药师评估统计
router.route('/diagnose-assessments/:did')
    .get(Diagnose.GetAssessmentsByDoctor);
router.route('/diagnose-counts/:did')
    .get(Diagnose.GetDiagnoseCountsByDoctor);

//---------------- 文章关键字搜索
var ArticleSearch = require('../db/controller/articleSearch');

router.route('/keywordsearchs')
    .get(ArticleSearch.GetAll);

router.route('/keywordsearch')
    .post(urlencodedParser, ArticleSearch.Add);

router.route('/keywordsearch/:id')
    .get(ArticleSearch.GetById)
    .delete(ArticleSearch.DeleteById)
    .patch(urlencodedParser, ArticleSearch.UpdateById);

router.route('/keywordsearchs/keyword/:keyword')
    .get(ArticleSearch.GetSerachResults);

//---------------- 实验室化验结果
var LabResult = require('../db/controller/labResult');

router.route('/labresults')
    .get(LabResult.GetAll);
router.route('/labresult/user/:uid')
    .get(LabResult.GetLabResultsByUserId);

router.route('/labresult')
    .post(urlencodedParser, LabResult.Add);

router.route('/labresult/:id')
    .get(LabResult.GetById)
    .delete(LabResult.DeleteById)
    .patch(urlencodedParser, LabResult.UpdateById);

//---------------- FAQ
var Faq = require('../db/controller/faq');

router.route('/faqs')
    .get(Faq.GetAll);
router.route('/faqs/edit')
    .get(Faq.GetEditAll);
router.route('/faq')
    .post(urlencodedParser, Faq.Add);
router.route('/faq/:id')
    .delete(Faq.DeleteById)
    .patch(urlencodedParser, Faq.UpdateById);


//---------------- FAQ
var SurveyStatusLog = require('../db/controller/surveyStatusLog');

router.route('/surveyStatusLogs')
    .get(SurveyStatusLog.GetAll);
router.route('/surveyStatusLog')
    .post(urlencodedParser, SurveyStatusLog.Add);
router.route('/surveyStatusLog/:key')
    .get(SurveyStatusLog.GetByKey);

//===================== 图片上传
var Uploader = require('../db/controller/upload');

// router.route('/upload/:dir')
router.route('/upload')
    .post(urlencodedParser, Uploader.receiveFile);

router.route('/upload/list/:dir')
    .get(Uploader.getFolderImageList);



///////////////////////////////////////////////////////////////////////////////////
//
//  数据库管理
//
///////////////////////////////////////////////////////////////////////////////////
var Admin = require('../db/controller/admin');

router.route('/admin/userdata/:id')
    .delete(Admin.DeleteUserAndRelatedData);

///////////////////////////////////////////////////////////////////////////////////

module.exports = router;
