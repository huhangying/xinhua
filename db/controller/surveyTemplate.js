/**
 * Created by harry on 16/9/13.
 */

var SurveyTemplate = require('../model/surveyTemplate.js');

module.exports = {

    GetAll: function (req, res) {

        SurveyTemplate.find()
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

            SurveyTemplate.findOne({_id: req.params.id})
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

    // 根据 type 获取Survey template list
    GetSurveyTemplatesByType: function (req, res) {

        if (req.params && req.params.department && req.params.type) {

            SurveyTemplate.find({department: req.params.department, type: req.params.type})
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

    // 根据 Department ID 获取 Survey template list
    GetSurveyTemplatesByDepartmentId: function (req, res) {

        if (req.params && req.params.did) {

            SurveyTemplate.find({department: req.params.did})
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
    
    // 创建关系组
    Add: function (req, res) {

        // 获取请求数据（json）
        var template = req.body;
        if (!template) return res.sendStatus(400);

        // name
        if (!template.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }
        // department
        if (!template.department) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }
        // type
        if (!template.type) {
            return Status.returnStatus(res, Status.NO_TYPE);
        }
        
        // questions ? allow to create a survey without questions?
        


        // 不存在，创建
        SurveyTemplate.create({

            name: template.name,
            department: template.department,
            type: template.type,
            questions: template.questions,
            order: template.order
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
            var template = req.body;
            if (!template) return res.sendStatus(400);

            SurveyTemplate.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }

                if (template.name)
                    item.name = template.name;
                if (template.department)
                    item.department = template.department;
                if (template.type)
                    item.type = template.type;
                if (template.questions && template.questions.length > 0)
                    item.questions = template.questions;
                if (template.order)
                    item.order = template.order;
                if (template.apply || template.apply === false)
                    item.apply = template.apply;
                
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
        if (req.params && req.params.id) { // params.id is group ID

            SurveyTemplate.findOne({_id: req.params.id}, function (err, item) {
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