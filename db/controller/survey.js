/**
 * Created by harry on 16/9/13.
 */

var Survey = require('../model/survey.js');

module.exports = {

    GetAll: function (req, res) {

        Survey.find()
            .exec(function (err, items) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!items || items.length < 1) {
                    return Status.returnStatus(res, Status.NULL);
                }

                res.json(items);
            });
    },

    // 根据ID获取详细信息
    GetById: function (req, res) {

        if (req.params && req.params.id) {

            Survey.findOne({_id: req.params.id})
                .exec(function (err, item) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!item) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    res.json(item);
                });
        }
    },

    // 根据 doctor & type & user 获取Survey list
    GetSurveysByUserType: function (req, res) {

        if (req.params && req.params.doctor && req.params.type && req.params.user) {
            var searchCriteria = {
                user: req.params.user,
                doctor: req.params.doctor,
                type: req.params.type
            };

            Survey.find(searchCriteria)
                .sort({order: 1})
                .exec(function (err, items) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!items || items.length < 1) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    res.json(items);
                });
        }
    },


    // 根据 doctor & type & user and list to retrieve details
    GetSurveysByUserTypeAndList: function (req, res) {

        if (req.params && req.params.doctor && req.params.type && req.params.user && req.params.list) {
            var searchCriteria = {
                user: req.params.user,
                doctor: req.params.doctor,
                type: req.params.type
            };

            Survey.find(searchCriteria)
                .sort({order: 1})
                .exec(function (err, items) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!items || items.length < 1) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    var surveyList = req.params.list.split('|');

                    items = items.filter(function(item) {
                        return surveyList.indexOf(item._id.toString()) > -1;
                    });

                    res.json(items);
                });
        }
    },


    // 根据Department ID获取Survey list
    GetSurveysByDepartmentId: function (req, res) {

        if (req.params && req.params.did) {

            Survey.find({department: req.params.did})
                .exec(function (err, items) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!items || items.length < 1) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    res.json(items);
                });
        }
    },
    
    // 创建
    Add: function (req, res) {

        // 获取请求数据（json）
        var survey = req.body;
        if (!survey) return res.sendStatus(400);

        // doctor
        if (!survey.doctor) {
            return Status.returnStatus(res, Status.NO_DOCTOR);
        }

        // user
        if (!survey.user) {
            return Status.returnStatus(res, Status.NO_USER);
        }

        // name
        if (!survey.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }
        // department
        if (!survey.department) {
            return Status.returnStatus(res, Status.NO_DEPARTMENT);
        }
        // type
        if (!survey.type) {
            return Status.returnStatus(res, Status.NO_TYPE);
        }
        // group
        // if (!survey.group) {
        //     return Status.returnStatus(res, Status.NO_GROUP);
        // }
        
        // questions ? allow to create a survey without questions?
        


        // 不存在，创建
        Survey.create({

            doctor: survey.doctor,
            user: survey.user,
            surveyTemplate: survey.surveyTemplate,

            name: survey.name,
            department: survey.department,
            type: survey.type,
            //group: survey.group,
            order: survey.order,
            availableBy: survey.availableBy,
            questions: survey.questions
        }, function (err, raw) {
            if (err) {
                return Status.returnStatus(res, Status.ERROR, err);
            }

            return res.send(raw);
        });

    },

    UpdateById: function (req, res) {
        if (req.params && req.params.id) { // params.id is ID
            var id = req.params.id;

            // 获取数据（json）
            var survey = req.body;
            if (!survey) return res.sendStatus(400);

            Survey.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }

                if (survey.doctor)
                    item.doctor = survey.doctor;
                if (survey.user)
                    item.user = survey.user;
                if (survey.surveyTemplate)
                    item.surveyTemplate = survey.surveyTemplate;
                if (survey.name)
                    item.name = survey.name;
                if (survey.department)
                    item.department = survey.department;
                // if (survey.group)
                //     item.group = survey.group;
                if (survey.type || survey.type == 0)
                    item.type = survey.type;
                if (survey.questions && survey.questions.length > 0)
                    item.questions = survey.questions;
                if (survey.order)
                    item.order = survey.order;
                if (survey.availableBy)
                    item.availableBy = survey.availableBy;
                if (survey.apply || survey.apply === false)
                    item.apply = survey.apply;
                
                //console.log(JSON.stringify(item));

                //
                item.save(function (err, raw) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }
                    res.json(raw);
                });

            });

        }
    },


    DeleteById: function (req, res) {
        if (req.params && req.params.id) { // params.id is ID

            Survey.findOne({_id: req.params.id}, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item){
                    return Status.returnStatus(res, Status.NULL);
                }

                //
                item.remove(function(err, raw){
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }
                    res.json(raw);
                });

            });
        }
    },

}